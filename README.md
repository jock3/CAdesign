# CA Design Archive

Månadsträff-arkiv för AI in design-communityt. En interaktiv webbplats byggd med Next.js 15 och React 19, med animerad bakgrund, fuzzy-sökning, tagg- och årfiltrering, och tema-toggle.

## Tech Stack

- **Next.js 15** — App Router med statisk export (`output: 'export'`)
- **React 19** — UI-runtime
- **TypeScript** — strikt typkontroll
- **Tailwind CSS v4** — CSS-först styling med custom tokens
- **Framer Motion** (motion v11) — animationer, variants, AnimatePresence
- **Fuse.js v7** — fuzzy-sökning
- **next-themes** — tema-toggle (ljust/mörkt) med localStorage-persistering
- **lucide-react** — tillgängliga SVG-ikoner

## Kom igång

### Installation
```bash
npm install
```

### Development server
```bash
npm run dev
```
Sajten körs på `http://localhost:3000`.

### Production build
```bash
npm run build
```
Genererar en statisk export i `out/` — redo för Vercel eller vilken CDN som helst.

## Lägg till ett möte

Möten lagras i `src/data/meetings.ts` som en typad array. Så här lägger du till:

1. Öppna `src/data/meetings.ts`.
2. Lägg till ett nytt objekt i `meetings`-arrayen följande denna struktur:

```typescript
{
  id: "ÅÅÅÅ-MM",           // unik ID (YYYY-MM format)
  title: "Mötes namn",      // visningstitel
  date: "ÅÅÅÅ-MM-DD",      // ISO-datum för sortering
  summary: "Kort beskrivning...",  // 1–2 meningar, visas i stängt läge
  tools: ["Tool1", "Tool2"],  // verktyg som testats/demats
  takeaways: [
    "Insikt 1",
    "Insikt 2"
  ],
  tags: ["Workflow", "Demo"],  // för filtrering
  link: "https://...",     // valfri URL till material (tom string = saknas)
  miro: ""                 // valfri Miro-länk (tom string = saknas)
}
```

3. Spara och committa. Vercel bygger om automatiskt vid push.

TypeScript tvingar fram alla obligatoriska fält — felaktig datainmatning blir ett build-fel.

## Projektstruktur

```
CAdesign/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # HTML-root, ThemeProvider, font-setup
│   │   ├── page.tsx            # Server Component: Header, Schema-panel, Archive
│   │   └── globals.css         # Tailwind v4 @import, @theme tokens, reduced-motion
│   │
│   ├── components/
│   │   ├── ArchiveClient.tsx   # "use client" — arkiv-gränssnitt, filter-state
│   │   ├── SearchBar.tsx       # sök-input + resultaträknare
│   │   ├── FilterBar.tsx       # tagg- och årfilter
│   │   ├── SortButton.tsx      # sortering (nyast/äldst)
│   │   ├── MeetingItem.tsx     # mötesrad (accordion)
│   │   ├── DottedBackground.tsx # animerad prickad bakgrund
│   │   ├── LiquidBlobs.tsx     # animerade blob/glow-effekter
│   │   ├── ThemeToggle.tsx     # ljust/mörkt-knapp
│   │   └── SchemaPanel.tsx     # JSON-schema-dokumentation
│   │
│   ├── data/
│   │   └── meetings.ts         # Möten (const meetings: Meeting[])
│   │
│   └── lib/
│       └── useReducedMotion.ts # Hook för respekt för prefers-reduced-motion
│
├── next.config.ts              # Statisk export + image-konfiguration
├── tsconfig.json               # TypeScript strict mode
├── package.json
├── postcss.config.mjs
└── README.md
```

## Design & Animationer

Sidan använder två designlager:

### Atmosfär
- **Prickad bakgrund:** animerad prickad/grid-yta (CSS/SVG) med glow-effekter
- **Liquid blobs:** svävande blob-former med färggradienter och rörelse

### Innehåll
- **Arkiv-UI:** möteslista med accordion-expansion (Framer Motion `AnimatePresence`)
- **Filter & sökning:** tagg-filter, årfilter, fuzzy-sökning via Fuse.js
- **Tema-toggle:** växla mellan ljus och mörkt läge — lagras i localStorage under `ca-theme`

### Tillgänglighet
- `prefers-reduced-motion` respekteras helt — loop-animationer stängs av för användare som begärt det
- Dubbellager: CSS-baserat fallback + JavaScript-hook för fullständig täckning
- Semantisk HTML med ARIA-attribut (`aria-expanded`, `aria-controls`)

## Deploy

### Vercel
```bash
npm run build
```
Skapar en statisk export i `out/`. Vercel detekterar Next.js automatiskt och serverar den statiska outputen. Ingen runtime-server krävs.

### Miljövariabler
Ingen setup krävs — projektet har inga hemligheter eller beroenden på backend.

## Performance

- **Lighthouse target:** Performance ≥ 80 (desktop), Accessibility ≥ 90
- **Dekorativaanimationer** lazy-laddas separat (`DottedBackground`, `LiquidBlobs`) för att inte påverka LCP
- **Framer Motion** använder `LazyMotion + domAnimation` för minimal bundle-påverkan
- **Server-rendering:** header, schema och skelett är RSC (React Server Components) — minskar klient-JS
- **Fonts:** Montserrat + Caveat laddas via `next/font` (self-hosted, SWAP-strategi)

## Utveckling

- **Sökning/filtrering:** logik i `ArchiveClient.tsx` med `useMemo` för härledd lista
- **State:** sentraliserat i `ArchiveClient` (`useState` för search, filter, sort, pagination, expanderat-möte)
- **Tema:** ägs av `next-themes` med `attribute="data-theme"` och nyckel `ca-theme`
- **Typning:** Meeting-interface definierat i `data/meetings.ts`; all data är typad och strikt

---

**CA Design AI in design-community** | Designarkiv | [Besök sidan](https://ca-design.vercel.app)
