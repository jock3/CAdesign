# Arkitekturbeslut — Re-plattformering av [CA Design] AI in design-arkivet

**Version:** 1.0
**Datum:** 2026-06-17
**Fas:** 3b — Tech-arkitekt
**Modell:** Opus
**Föregående faser:** brief.md, requirements.md
**Parallell fas:** ux-decisions.md (UX-designer)
**Nästa fas:** Implementor (fas 4)

---

## 0. Sammanfattning av kontext

Befintlig produkt är **en enda statisk `index.html`** (ingen build, inline CSS, vanilla JS, Fuse.js via CDN, `meetings`-array hårdkodad i en `<script>`). Projektet är **greenfield på Next.js-sidan** — ingen `package.json`, `next.config`, `tsconfig` eller `node_modules` finns ännu. Git-repot finns (branch `claude/determined-johnson-gg7c0u`).

Stacken är **låst av stakeholdern: Next.js + React, deploy till Vercel.** Detta åsidosätter agentens defaultstack (Vite + Supabase). Ingen backend, ingen databas, ingen auth, inget CMS — data lever i källkoden (FR + scope §5.2 bekräftar). Därför **ingen Supabase-inspektion relevant**: det finns ingen databas att inspektera, och kravspecen utesluter explicit backend/DB (scope §5.2).

Produkten är liten (4 möten, långsam tillväxt), men kravet på **tung animation** ("LOTS of animation", FR-36–39) och **Lighthouse Performance ≥ 80 desktop / ≥ 70 mobil** (NFR-01/02) med **CLS < 0,1** (NFR-04) sätter den verkliga tekniska spänningen: animationsbudget kontra prestandabudget. Arkitekturen nedan är optimerad runt den spänningen.

---

## 1. Stackbeslut (översikt)

| Lager | Val | Enradsmotivering | Förkastat |
|---|---|---|---|
| Framework | **Next.js 15 (App Router)** | Senaste stabila, statisk export, RSC minimerar klient-JS | Pages Router, Next 14 |
| Språk | **TypeScript (strict)** | Mötesdatan är en typad kontrakt; fångar fel i datainmatning | Plain JS |
| UI | **React 18/19** (följer Next 15) | Krav från stakeholder | — |
| Styling | **Tailwind CSS v4** | Inget separat configsteg, CSS-variabler nativt → matchar befintliga tokens | Tailwind v3, ren CSS |
| Animation | **Framer Motion (`motion` v11+)** | Deklarativa variants, `AnimatePresence`, inbyggt reduced-motion-stöd | GSAP, react-spring, ren CSS |
| Sök | **Fuse.js 7** | Redan i bruk, samma beteende, ~5 kB gzip | Egen fuzzy, MiniSearch |
| Ikoner | **lucide-react** | Tree-shakeable, ersätter teckenglyfer (☀/☾/⌄) med a11y-vänliga SVG | react-icons (sämre tree-shaking) |
| Tema | **next-themes** | Löser FOUC + `prefers-color-scheme` + localStorage utan eget bootstrap-script | Egen `useTheme`-hook |
| Deploy | **Vercel (static output)** | Krav; nollkonfig för Next | Netlify, GitHub Pages |
| Datakälla | **Hårdkodad `meetings.ts`** | Inget CMS i scope; typad fil = enklast att redigera och versionshantera | JSON-fil, MDX, Supabase |

---

## 2. Beslut 1 — Next.js-version och routing-modell

### Beslut
**Next.js 15 med App Router.** Sidan är en enda route (`/`) genererad som statisk HTML via `output: 'export'`.

### Motivering
- **App Router + React Server Components** är default i Next 15 och låter oss rendera allt ointeraktivt (header-skelett, schema-panelens statiska JSON, fot) som server-komponenter med **noll klient-JS**. Endast den interaktiva arkiv-vyn blir en `"use client"`-ö. Det är direkt avgörande för Lighthouse-budgeten (NFR-01/02) när Framer Motion annars drar upp bundlen.
- **Statisk export** (`output: 'export'`) uppfyller NFR-21 (statisk output, ingen runtime-SSR) och ger Vercel en ren CDN-leverans. Inga API-routes behövs (scope §5.2).
- Next 15 är den senaste stabila linjen per 2026-06 och får säkerhets-/prestandaförbättringar som 14 inte längre prioriterar.

### Förkastat
- **Pages Router:** äldre modell, ingen RSC, hela sidan blir en klientbundle. Ingen fördel här och sämre default-prestanda.
- **Next 14:** fungerar, men ingen anledning att starta greenfield på en äldre major.

### Konsekvens
Filstruktur följer `app/`-konventionen. `next.config.ts` sätter `output: 'export'`. Inga dynamiska serverfunktioner får införas utan att bryta export-läget — det är en medveten begränsning som matchar scope.

---

## 3. Beslut 2 — Tailwind-version

### Beslut
**Tailwind CSS v4.**

### Motivering
- v4 konfigureras **CSS-först** (`@theme` i en global CSS-fil) istället för `tailwind.config.js`. De befintliga CA Design-tokenerna är redan uttryckta som **CSS custom properties** (`--ca-anthracite`, `--bg-1`, `--accent` …) med en `[data-theme="dark"]`-override. Detta mappar 1:1 mot v4:s `@theme`/CSS-variabel-modell — vi kan flytta in tokenblocket nästan oförändrat och låta UX-designern förfina det på ett ställe.
- v4 har **snabbare Oxide-motor** och mindre genererad CSS, vilket hjälper LCP/CLS.
- Mörkt tema drivs av en **klass/attribut-strategi** (`data-theme`) snarare än `prefers-color-scheme` ensamt, eftersom temat ska kunna togglas och persisteras (FR-26–29). Konfigureras via `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`.

### Förkastat
- **Tailwind v3:** kräver `tailwind.config.js` + `postcss.config.js` och en separat tokenduplicering mellan JS-config och CSS-variabler. Mer yta att hålla synkad för ingen vinst i ett projekt av den här storleken.
- **Ren CSS/CSS-moduler:** skulle fungera (befintlig sida bevisar det), men Tailwind är förväntat av "21st.dev-stilen" i briefen och ger UX-designern ett snabbare iterationsflöde.

### Konsekvens
Tokens lever i `app/globals.css` under `@theme` + en `[data-theme="dark"]`-block. Implementor importerar Tailwind med `@import "tailwindcss";`. Ingen `tailwind.config.js` behövs (skapa bara om en plugin kräver det).

---

## 4. Beslut 3 — Animationsbibliotek

### Beslut
**Framer Motion** (paketet `motion`, v11+). Bekräftar briefens förstahandsval.

### Använda features
- **`motion.*`-komponenter** — grundläggande enter/hover/tap på kort, knappar, filterchips.
- **`AnimatePresence`** — accordion-expansion/kollaps (FR-39, AC-09.3) och listfiltrering (mount/unmount med layout-animation). Använd `mode="popLayout"` + `layout` för att undvika hopp vid filtrering.
- **`variants`** — stagger-in av mötesrader vid sidladdning och vid filterbyte (en variant-uppsättning per lista, `staggerChildren`).
- **`useReducedMotion`** — central hook som styr om loop-animationer och transforms ska köras (se Beslut 9).
- **`useScroll` / `useTransform`** — endast om UX-designern vill ha parallax/scroll-driven glow. Valfritt; lazy-laddas.
- **`useMotionValue` / `animate`** — för den prickade bakgrundens och blobbarnas drivna värden (se nedan).

### Bundle-strategi (kritiskt för NFR-01/02)
Framer Motion är det tyngsta beroendet (~30–50 kB gzip beroende på använda delar). Strategi:
1. **Isolera tunga, dekorativa animationer bakom `next/dynamic` med `ssr: false`** — `DottedBackground` och `LiquidBlobs` laddas som separata chunks efter first paint. De är rent dekorativa (FR-36–38) och får inte blockera LCP.
2. **Använd `LazyMotion` + `domAnimation`-feature-paketet** för de interaktiva komponenterna istället för full `motion`-import. Importera `m.div` i stället för `motion.div`. Detta tar ner Framer Motions kärnruntime markant.
3. **Bakgrund och blobbar renderas i `<canvas>` eller via CSS/SVG där det räcker** — den prickade ytan bör vara **CSS/SVG + en enda transformdriven loop**, inte hundratals individuellt animerade DOM-noder. Många animerade DOM-element är den största risken för frame drop under 45 FPS (NFR-05). Föredra `transform`/`opacity` (GPU-komposit) över layoutpåverkande egenskaper.

### Förkastat
- **GSAP:** kraftfullt men imperativt; sämre React-integration, större licens-/bundleöverväganden, ingen inbyggd `prefers-reduced-motion`-koppling till React.
- **react-spring:** bra fysik men `AnimatePresence`-ekvivalenten är klumpigare för accordion/list-exit; Framer Motion är förväntat av briefen.
- **Ren CSS-animation:** räcker inte för det orkestrerade list-/accordion-beteendet och layout-animationer som krävs (FR-39).

### Konsekvens
All animationskod kapslas i `components/motion/` och `components/background/`. Implementor MÅSTE lazy-ladda bakgrundsdekoren och använda `LazyMotion`. En budget på max ~2 ambient loop-animationer (bakgrund + blobbar) gäller för att hålla FPS-kravet.

---

## 5. Beslut 4 — Datalager

### Beslut
Mötesdatan bor i **`data/meetings.ts`** som en typad, exporterad array (`export const meetings: Meeting[]`). Typerna definieras i `data/types.ts`.

### Datamodell (entiteten `Meeting`)
Detta är det mest kostsamma att få fel — det är kontraktet hela UI:t läser. Härlett exakt från befintlig data + datakatalogen i requirements §7.

```ts
// data/types.ts
export interface Meeting {
  id: string;          // "YYYY-MM", unik nyckel, används som React key + öppet-id
  title: string;       // visningstitel
  date: string;        // ISO "YYYY-MM-DD" — sorterings- och årfilterkälla
  summary: string;     // kort beskrivning (klipps till 2 rader i stängt läge)
  tools: string[];     // verktygslista
  takeaways: string[]; // insikter, renderas som bullet-lista
  tags: string[];      // taggar; källa för tagg-filter (dynamiskt)
  link?: string;       // valfri materiallänk (tom sträng = saknas)
  miro?: string;       // valfri Miro-länk (tom sträng = saknas)
}
```

**Constraints / invarianter implementor måste hålla:**
- `id` är **unik** och **stabil** (används som React-key och som `openId`).
- `date` MÅSTE vara giltig ISO `YYYY-MM-DD`; allt datum-, år- och sorteringsbeteende härleds från den (matcha `new Date(date + 'T12:00:00')` för att undvika TZ-skift, exakt som befintlig kod).
- `link`/`miro`: behandla **tom sträng `""` som "saknas"** (befintlig data använder `""`, inte `undefined`). Länk-avsnittet döljs när båda saknas (FR-35, AC-05.4). Normalisera i en hjälpfunktion `hasLink(m)` snarare än att sprida `m.miro && …` överallt.
- Alla fyra befintliga möten (2025-11, 2025-12, 2026-02, 2026-05) porteras **ordagrant** inklusive Miro-tokens (A-05: exponering accepteras som-är).

### Härledd data (computeras vid modulladdning, memoiseras)
- `allTags` = unika `tags`, sorterade (befintlig logik).
- `allYears` = unika `date.split('-')[0]`, sorterade fallande.
- `totalCount` = `meetings.length`.

Lägg dessa i `data/derived.ts` eller computa i en `useMemo` i toppkomponenten. Eftersom datan är statisk vid byggtid kan de lika gärna computas en gång på modulnivå.

### "Lägg till ett möte"-flöde (utvecklare)
Manuell kodredigering kvarstår (scope §5.2, OQ-05 → manuell):
1. Öppna `data/meetings.ts`.
2. Lägg till ett `Meeting`-objekt i arrayen. TypeScript `strict` tvingar fram alla obligatoriska fält → fel fångas i editor/build, inte i prod.
3. Commit + push → Vercel bygger om automatiskt.

JSON-schema-panelen (FR-30–32) förblir **ren dokumentation** som speglar `Meeting`-typen. Rendera den från en statisk sträng/kodblock i en server-komponent (ingen klient-JS).

### Förkastat
- **JSON-fil:** tappar typkontroll vid redigering — den huvudsakliga vinsten med TS-filen.
- **MDX/CMS/Supabase:** explicit utanför scope (§5.2). Översparat för 4 rader data.

### Konsekvens
`Meeting`-typen importeras av sök (Fuse-keys), filter, accordion och schema-doc. Ändras typen måste alla konsumenter uppdateras — håll den smal.

---

## 6. Beslut 5 — Fil- och katalogstruktur

App Router, statisk export, en route. Klientinteraktivitet isolerad till så få öar som möjligt.

```
CAdesign/
├── app/
│   ├── layout.tsx              # <html lang="sv">, ThemeProvider (next-themes), font-setup, globals
│   ├── page.tsx                # RSC: sätter ihop sidan; renderar statisk header/schema + <Archive/> (client)
│   ├── globals.css             # Tailwind v4 @import + @theme tokens + [data-theme=dark] + reduced-motion
│   └── favicon.ico
│
├── components/
│   ├── archive/
│   │   ├── Archive.tsx         # "use client" — TOPP-ön: håller all UI-state, orkestrerar filter→lista
│   │   ├── SearchBar.tsx       # sökinput + resultaträknare (FR-06/07/08)
│   │   ├── TagFilters.tsx      # tagg-filterknappar (FR-11–14)
│   │   ├── YearSortBar.tsx     # år-filter + sorteringsknapp (FR-15–22)
│   │   ├── MeetingList.tsx     # AnimatePresence + stagger; load-more (FR-23–25)
│   │   ├── MeetingItem.tsx     # accordion-rad (FR-02–04), aria-expanded/controls
│   │   ├── MeetingDetail.tsx   # expanderat innehåll: summary/tools/takeaways/tags/länkar
│   │   └── LoadMore.tsx        # "Ladda fler" + kvarvarande-räknare
│   │
│   ├── layout/
│   │   ├── Header.tsx          # logo, schema-trigger ("AI in design"), tema-toggle, total-räknare
│   │   ├── ThemeToggle.tsx     # "use client" — next-themes setTheme, aria-label
│   │   └── SchemaPanel.tsx     # dold JSON-doc; toggle-state lyfts hit (FR-30–32)
│   │
│   ├── background/             # ALLA lazy-laddade via next/dynamic, ssr:false
│   │   ├── DottedBackground.tsx# animerad prickad/grid-yta (FR-36)
│   │   └── LiquidBlobs.tsx     # blob/liquid ambient + glow (FR-37/38)
│   │
│   └── motion/
│       ├── MotionProvider.tsx  # LazyMotion + domAnimation wrapper
│       └── variants.ts         # delade variants (stagger, accordion, fade)
│
├── data/
│   ├── types.ts                # Meeting-interface
│   ├── meetings.ts             # const meetings: Meeting[]  ← redigeras manuellt
│   └── derived.ts              # allTags, allYears, totalCount
│
├── lib/
│   ├── search.ts               # Fuse-instans + getFiltered() (sök→tagg→år→sort, pipeline)
│   ├── format.ts               # formatDate, getDay, getMonth (sv-SE), hasLink()
│   └── hooks/
│       └── useReducedMotionSafe.ts  # wrappar Framer useReducedMotion + ev. SSR-default
│
├── public/                     # statiska assets (ev. fontfiler om self-hosted)
├── next.config.ts              # output: 'export'
├── tsconfig.json               # strict: true
├── package.json
├── postcss.config.mjs          # endast om Tailwind v4 PostCSS-plugin krävs i toolingen
└── README.md
```

### Var state bor (komponentarkitektur)
- **All interaktiv state lyfts till `Archive.tsx`** (en client-komponent): `search`, `currentTag`, `currentYear`, `sortAsc`, `openId`, `visibleCount`. Detta speglar den befintliga vanilla-JS-modellen (globala `let`-variabler + `render()`), men idiomatiskt som React `useState`. Ingen extern state-manager behövs — staten är liten, lokal och icke-delad. **Zustand/Redux vore omotiverad boilerplate här.**
- **Härledd lista** (`getFiltered()`) computas i en `useMemo` med dessa som dependencies → ersätter den imperativa `render()`-loopen.
- **Tema-state** ägs av `next-themes` (separat concern, korsande hela trädet, persisterad). Schema-panelens öppet/stängt-state är lokal boolean i `page.tsx`/`Header`-nivå.
- **Server/klient-gräns:** `page.tsx` och `layout.tsx` är RSC. Statisk header-text och schema-JSON renderas server-side. Endast `Archive`, `ThemeToggle` och bakgrundsdekoren är klientkod.

---

## 7. Beslut 6 — Beroendelista (npm)

| Paket | Roll | Dep-typ |
|---|---|---|
| `next` (^15) | Framework, statisk export | dependencies |
| `react`, `react-dom` | UI-runtime (följer Next 15) | dependencies |
| `motion` (^11, Framer Motion) | Animation: variants, AnimatePresence, LazyMotion, useReducedMotion | dependencies |
| `fuse.js` (^7) | Fuzzy-sökning (samma beteende som idag) | dependencies |
| `next-themes` (^0.4) | Tema: toggle + persistens + FOUC-fri init | dependencies |
| `lucide-react` | Ikoner (sol/måne, chevron, sök, extern länk) tree-shakeable | dependencies |
| `tailwindcss` (^4) | Styling | devDependencies |
| `@tailwindcss/postcss` | Tailwind v4 PostCSS-integration för Next | devDependencies |
| `typescript` | Typkontroll | devDependencies |
| `@types/react`, `@types/react-dom`, `@types/node` | Typer | devDependencies |
| `eslint`, `eslint-config-next` | Lint (Next default) | devDependencies |

Medvetet **inte** inkluderat: ingen state-manager (state är litet), ingen UI-kit (Tailwind räcker), ingen backend/DB-klient (scope §5.2), ingen analytics/cookie-lib (scope §5.2).

---

## 8. Beslut 7 — Build och deploy

### `next.config.ts`
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",            // statisk HTML/CSS/JS → CDN (NFR-21)
  images: { unoptimized: true },// next/image-optimering kräver server; export → av
  // basePath/trailingSlash endast om subkatalog-deploy; ej för Vercel-rot
};
export default nextConfig;
```

### Vercel
- **Framework preset:** Next.js (autodetekteras). Build: `next build`. Output: `out/` (vid `output: 'export'` serverar Vercel den statiska outputen).
- **Push till branch → preview deploy; merge till default branch → production deploy.** Ingen extra CI/CD (A-06, scope §5.2).
- **Node-version:** 20 LTS (Vercel default för Next 15).

### Miljövariabler
**Inga.** Ingen backend, inga API-nycklar, inga hemligheter. Miro-tokenen är hårdkodad i datan (A-05, accepterat). Om en variabel någonsin behövs (t.ex. analytics) ska den läggas i Vercel-projektets env och prefixas `NEXT_PUBLIC_` endast om den läses i klienten — men inget sådant ingår i denna iteration.

### Domän/URL (OQ-03)
Deploy-beslut, ej applikationskrav (scope §5.2). Default: Vercel-genererad `*.vercel.app`-subdomän. Pekas eventuellt om till befintlig domän av deployer-fasen — ingen kodpåverkan.

---

## 9. Beslut 8 — Prestandabegränsningar (Lighthouse-budget)

Mål: **Performance ≥ 80 desktop / ≥ 70 mobil, LCP ≤ 2,5 s, CLS < 0,1, ≥ 45 FPS** (NFR-01–05). Den tunga animationen är det enda reella hotet. Strategi:

1. **Code splitting av dekor:** `DottedBackground` och `LiquidBlobs` via `next/dynamic({ ssr: false })`. De ligger utanför LCP-elementet och laddas efter att huvudinnehållet målats. De får aldrig vara LCP-kandidat.
2. **`LazyMotion` + `domAnimation`** istället för full `motion`-import (se Beslut 3) → minskar Framer Motions klientruntime.
3. **RSC-först:** header, schema-doc och sidskelett är server-renderade utan klient-JS. Bara `Archive`-ön hydreras.
4. **CLS-disciplin (NFR-04):** accordion expanderar via `AnimatePresence`/`height: auto`-animation, inte via layout-hopp ovanför fold. Bakgrundsdekoren är `position: fixed`, `inset: 0`, `z-index: -1`, `pointer-events: none` → påverkar **aldrig** layoutflödet. Reservera plats för räknare/filterrader så de inte skjuter innehåll när data fylls i.
5. **Font-laddning:** ladda **Montserrat + Caveat via `next/font/google`** (self-hostas vid byggtid, `display: 'swap'`, preload). Detta eliminerar den externa `fonts.googleapis.com`-render-blockeringen i nuvarande sida och stabiliserar CLS via storleksjusterade fallbacks.
6. **Bildstrategi:** sidan har **inga innehållsbilder** — bakgrunden är genererad (CSS/SVG/canvas), Miro-"ikonen" är ren CSS. `images.unoptimized: true` är därför ofarligt. Inga `<img>`/`next/image` förväntas; om UX inför dekorbilder ska de vara SVG eller `loading="lazy"`.
7. **GPU-vänlig animation:** endast `transform`/`opacity` i loop-animationer; undvik animering av `width/height/top/left/box-shadow` i varje frame (glow får animeras via `opacity` på ett pseudo-lager, inte via animerad `box-shadow`). Detta skyddar FPS-kravet (NFR-05).
8. **Mobil:** reducera partikel-/blob-antal under en breakpoint eller via `matchMedia`; mobilbudgeten (≥ 70) är lägre men datat (coarse pointer, svagare GPU) är känsligare. Färre animerade element på små skärmar.

---

## 10. Beslut 9 — `prefers-reduced-motion` (komponentnivå)

### Beslut
**Både CSS och hook — två lager som backar upp varandra.**

### Lager 1 — Hook (primär, för Framer Motion)
`lib/hooks/useReducedMotionSafe.ts` wrappar Framer Motions `useReducedMotion()`. Varje animerad komponent läser den och:
- **Loop-animationer (bakgrund, blobbar): renderas inte alls** vid reducerad rörelse (AC-09.4, NFR-13). `DottedBackground`/`LiquidBlobs` returnerar en statisk variant (eller `null` + statisk CSS-gradient).
- **Accordion:** byt ut height/transform-animation mot ren `opacity`-fade eller direkt visning (NFR-13).
- **Tema-byte, hover:** inga transforms — endast färgövergång (NFR-13).
- **Stagger/enter:** hoppa över eller reducera till en kort fade.

Framer Motion respekterar dessutom själv `useReducedMotion` i `MotionConfig reducedMotion="user"` — sätt detta i `MotionProvider` så att `transform`-baserade animationer auto-degraderas globalt.

### Lager 2 — CSS (skyddsnät i `globals.css`)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Detta fångar all CSS-driven rörelse (även sådant som inte går via Framer Motion) och garanterar att inga loop-animationer spelas även om en hook missas. Hook-lagret behövs ändå eftersom canvas/JS-drivna loopar inte stoppas av CSS — de måste villkoras i JS.

### Motivering
CSS ensamt stoppar inte JS-/canvas-loopar; hook ensamt riskerar att missa ren CSS-animation i en delkomponent. Tillsammans ger de fullständig täckning av NFR-13 / AC-09.4.

---

## 11. Beslut 10 — TypeScript

### Beslut
**Ja, TypeScript med `strict: true`.**

### Motivering
Den enda källan till "data-buggar" i det här projektet är manuell redigering av mötesarrayen (Beslut 4). En `strict` `Meeting`-typ gör felaktig inmatning (saknat fält, fel typ, felstavad nyckel) till ett **build-fel som Vercel fångar** innan deploy — vilket är exakt det "add a meeting"-flöde stakeholdern behåller. För 4 objekt som växer långsamt är den ergonomiska vinsten (autocomplete, säkra refaktoreringar av komponentprops) gratis givet att Next har TS som förstaklassval. Ingen runtime-kostnad (typer raderas vid byggtid).

### Förkastat
Plain JS — sparar inget meningsfullt och tar bort den enda automatiska kvalitetsgrinden för datainmatning.

---

## 12. Dataflöde (källa → skärm)

```
data/meetings.ts (statisk, byggtid)
   │
   ├─► derived.ts ──► allTags, allYears, totalCount ──► Header / TagFilters / YearSortBar (props)
   │
   └─► Archive.tsx (client, äger state)
          │  state: search, currentTag, currentYear, sortAsc, openId, visibleCount
          ▼
       lib/search.ts  getFiltered(meetings, state)
          │  1. fuse.search(search) eller [...meetings]
          │  2. filter på tag
          │  3. filter på year
          │  4. sort på date (asc/desc)
          ▼
       useMemo(filtered)  ──► slice(0, visibleCount) ──► MeetingList
          ▼
       AnimatePresence + variants ──► MeetingItem[] (openId styr expansion)
          ▼
       LoadMore (om visibleCount < filtered.length)
```
Inga mutationer mot källan, ingen fetch, ingen cache-invalidering — datan är statisk och unidirektionell. Alla "skriv"-operationer är ren UI-state i `Archive`. Filterändring nollställer `visibleCount` till `PAGE_SIZE` (FR-09/14/19/22).

---

## 13. Tekniska risker och de-riskning

| Risk | Påverkan | De-riskning |
|---|---|---|
| **Animation sänker Lighthouse < tröskel** | NFR-01/02 missas | Lazy-load dekor, `LazyMotion`, RSC-först, transform/opacity-only. Mät tidigt med `next build` + lighthouse i implementor-fasen. |
| **Många animerade DOM-noder → FPS-drop** | NFR-05 | Prickad bakgrund som CSS/SVG/canvas med EN drivande loop, inte N DOM-element. Tak: ~2 ambient loopar. |
| **CLS från font-swap eller sen dekor** | NFR-04 | `next/font` self-host + storleksjusterade fallbacks; dekor `position: fixed` utanför flödet. |
| **`output: 'export'` bryts av oavsiktlig serverfeature** | Build fail på Vercel | Inga API-routes, ingen `next/image`-optimering, inga dynamiska params. Dokumenterat som begränsning. |
| **Reduced-motion missas i en JS-loop** | NFR-13 / WCAG | Dubbellager (CSS + hook), `MotionConfig reducedMotion="user"`, villkora canvas-loopar i JS. |
| **Tema-FOUC vid laddning** | Visuell glitch, ev. CLS | `next-themes` med `attribute="data-theme"` + `suppressHydrationWarning` på `<html>`. |
| **Kontrast i ljust läge för glow/accent** | NFR-06/07 (≥ 90 a11y) | UX-designern äger paletten; verifieras i a11y-fasen. Arkitektur exponerar tokens som CSS-variabler så kontrast kan justeras på ett ställe. |

---

## 14. Beslutsregister (ADR-sammanfattning)

| # | Beslut | Kontext | Konsekvens |
|---|---|---|---|
| ADR-1 | Next 15 App Router + static export | Stack låst; en route; ingen runtime-SSR (NFR-21) | RSC minimerar klient-JS; inga serverfeatures tillåtna |
| ADR-2 | Tailwind v4 (CSS-först) | Befintliga tokens är redan CSS-variabler | Tokens i `@theme`/`globals.css`; ingen JS-config |
| ADR-3 | Framer Motion + LazyMotion + lazy dekor | "LOTS of animation" vs Lighthouse-budget | Tung dekor i separata chunks; budget på loopar |
| ADR-4 | Hårdkodad typad `meetings.ts` | Inget CMS i scope; manuell add-flow | Typ = kontrakt; build fångar datafel |
| ADR-5 | Ingen state-manager | State litet, lokalt, icke-delat | `useState` i `Archive`; `next-themes` för tema |
| ADR-6 | TypeScript strict | Datainmatning är enda buggkällan | Felinmatning blir build-fel |
| ADR-7 | `next/font` self-host | Extern Google Fonts render-blockerar idag | Bättre LCP/CLS, offline-stabilt |
| ADR-8 | Reduced-motion: CSS + hook | CSS stoppar inte JS-loopar | Full NFR-13-täckning |

---

## 15. Överlämning till Implementor (fas 4)

Bygg enligt katalogstrukturen i §6 och datamodellen i §5. Hårda krav:
1. **Statisk export** måste fortsätta fungera (`next build` utan serverfeatures).
2. Portera alla fyra möten **ordagrant** till `data/meetings.ts`.
3. Behåll exakt befintligt sök-/filter-/sort-/paginerings-/tema-beteende (FR-01–35) — referensimplementationen finns i `index.html` rad 730–1027.
4. Lazy-ladda all bakgrundsdekor och använd `LazyMotion`.
5. Implementera reduced-motion i båda lagren innan dekor anses klar.
6. Tema via `next-themes` med `attribute="data-theme"` och nyckel `ca-theme` (FR-27) — konfigurera `storageKey="ca-theme"`.
7. Mät Lighthouse lokalt innan fas 5; sikta över tröskeln med marginal.

UX-designern (parallell fas 3a) äger paletten, typografin, animationskänslan och exakt visuell riktning. Vid konflikt mellan denna arkitektur och `ux-decisions.md`: **prestanda- och a11y-NFR:erna (NFR-01–14) är icke förhandlingsbara**; den visuella riktningen anpassas inom dem.
