# UX-beslut — Re-plattformering av [CA Design] AI in design-arkivet

**Version:** 1.0
**Datum:** 2026-06-17
**Fas:** 3a — UX-designer (parallellt med tech-arkitekt)
**Modell:** Opus (besluten propagerar genom implementor, tester, a11y-tester)
**Underlag:** brief.md, requirements.md, index.html (nuvarande produkt), ui-ux-pro-max-skillen

Det här dokumentet är **design-kontraktet** som implementor bygger mot och som tester/a11y-tester verifierar mot. Det specificerar upplevelse, layout, komponentbeteende, rörelsesystem och tillgänglighet — **inte** kod. Där ett värde anges (px, ms, opacitet, kontrast) är det ett krav, inte ett förslag.

Den bärande designidén: **"Tyst editorial yta, levande atmosfär."** Innehållslagret (sök, filter, lista) är ett lugnt, högläsbart svenskt redaktionellt arkiv. Atmosfärslagret bakom det (prickad yta, glow, blobbar) är där energin och AI-känslan bor. De två lagren rör aldrig varandra: rörelse är *ambient och bakom*, aldrig *på texten du läser*. Det är så vi får "LOTS of animation" utan att offra läsbarhet och a11y.

---

## 1. Designprinciper (styr alla beslut nedan)

1. **Två lager, aldrig blandade.** Lager A = atmosfär (z bakom innehåll, pointer-events: none, aria-hidden). Lager B = innehåll (text, kontroller, läsbart, interaktivt). All loop-animation lever i Lager A. Lager B animerar bara som svar på en användarhandling (öppna, filtrera, hovra) och bara med korta övergångar (<= 320 ms).
2. **Rörelse är aldrig ett hinder.** Ingen animation blockerar inmatning, ingen scroll-jacking, ingen parallax som flyttar text. Skillen flaggar parallax/scroll-jacking som hög risk för illamående — vi använder därför **pekar-/sensorbaserad parallax på atmosfärslagret**, inte scroll-driven parallax på innehåll.
3. **Reduced-motion är en förstklassig variant, inte en avstängning.** Designen ritas i två rörelsetillstånd från början (full / reduced). Reduced är fortfarande vacker — den behåller glow och statiska prickar, den tappar bara *rörelsen*.
4. **Varumärket bevaras och förfinas, inte ersätts.** ui-ux-pro-max föreslog en generisk "community-lila" palett (#7C3AED). **Avvisad** — CA Design har en egen, mer distinkt identitet (anthracite/forest-elf/cherry-tomato/bone). Att byta till stock-lila skulle göra sidan generisk, vilket är precis det problem briefen beskriver. Vi behåller paletten och adderar ett rörelse-/glow-lager ovanpå den.
5. **Desktop primärt, mobil fullt funktionell** (A-09). Maxbredd på innehåll <= 75 vw (FR-41), minsta stödbredd 360 px (FR-40).

---

## 2. Användarflöden

### 2.1 Primärflöde — "Hitta material från en specifik träff"
Det vanligaste skälet att besöka sidan (per brief: målgruppen söker material från en känd träff).

1. **Ankomst** -> sidan laddar. Atmosfären tonar in (Lager A fade 600 ms). Innehållet (header -> sök -> filter -> lista) staggrar in uppifrån och ned, 60 ms förskjutning per block, translateY 8 px + opacity. Listan visar de 5 nyaste träffarna (FR-23), nyast överst (FR-20).
2. **Söker** -> användaren skriver i sökfältet. Resultaten filtreras löpande (FR-08), paginering nollställs till sida 1 (FR-09), räknaren "X av 4 träffar" uppdateras synkront (FR-06, AC-01.4). Listan korsfadar mellan resultatuppsättningar (se 5.4).
3. **Hittar / öppnar** -> klick på en träffrad expanderar dragspelet (FR-02). Eventuell tidigare öppen rad stängs (FR-04). Detaljen veckas ut med höjd+opacitet (se 5.3).
4. **Navigerar ut** -> klick på "Öppna Miro-board" eller "Material från träffen" öppnar i ny flik (FR-33, FR-34).

### 2.2 Bläddringsflöde — "Utforska historiken"
1. Ankomst (som ovan).
2. **Filtrerar** på tagg och/eller år (FR-11–FR-19). Filterknappar är enkelval per grupp; tagg + år kan kombineras (FR-18). Varje filterbyte nollställer paginering (FR-14, FR-19).
3. **Sorterar** om till "Äldst först" för att läsa arkivet kronologiskt framifrån (US-04). Knappen speglar aktivt läge (FR-21).
4. **Laddar fler** -> "Ladda fler" lägger till 5 åt gången (FR-23), med "X till"-räknare bredvid (FR-24). Knappen försvinner när allt visas (FR-25).

### 2.3 Innehållsansvarig-flöde — "Se datastrukturen"
1. Klick på "AI in design" i rubriken (FR-31, AC-08.2) -> schema-panelen veckas ut (default dold, FR-30).
2. Panelen visar JSON med syntaxfärgning (FR-32). Klick igen döljer (AC-08.3).

### 2.4 Tillstånd: tom / fel / laddning
- **Tomt sökresultat** (AC-01.2): listan ersätts av tomtillstånd. Copy exakt: **"Inga träffar hittades för din sökning."** Plus en mjukare hjälprad under: **"Prova ett annat ord eller rensa filtren."** En sekundär textknapp **"Rensa allt"** återställer sök + tagg + år till standardläge. Tomtillståndet tonar in (opacity 200 ms); en liten, lugn version av en blob ligger bakom som dekoration (aria-hidden) så ytan inte känns död.
- **Tomt p.g.a. filter** (inte sök): samma mönster, men copy: **"Inga träffar matchar de valda filtren."**
- **Laddning:** detta är en statiskt genererad sida (NFR-21) med hårdkodad data — ingen runtime-datahämtning. Det finns alltså **ingen spinner och inga skeletons för listan**; data finns vid första render. Den enda "laddningen" är font + första paint. För att undvika FOUT/layouthopp (NFR-04 CLS < 0,1): typsnitt laddas med font-display: swap och systemfont-fallback med matchande metrik; tema sätts före first paint (se 7.3) för att undvika tema-flash.
- **Fel:** ingen nätverksväg kan fela i kärnflödet. Externa länkar (Miro/material) kan vara döda — det ligger utanför vår kontroll och kräver ingen felhantering i UI utöver target="_blank" + rel="noopener noreferrer".

---

## 3. Nyckelskärmar (layout + informationshierarki)

Sidan är **en enda vertikal vy** (single route). "Skärmar" nedan = sektioner i läsordning. Innehållet ligger i en centrerad kolumn (max 75 vw, men med en praktisk inre maxbredd ~1100 px så radlängden inte spränger 65–75 tecken på stora skärmar — ui-ux-pro-max line-length-regel). Atmosfärslagret täcker hela viewporten bakom.

### 3.1 Header (sidhuvud)
Hierarki, vänster->höger:
- **Logotyp/titel** [CA Design] — AI in design. "AI in design" är satt i Caveat (offset-font), forest-elf/cherry-tomato beroende på tema, och är **den klickbara schema-triggern** (FR-31). Den får en synlig affordans: understruken-vid-hover idag -> vi förstärker till en **liten "{ }"-glyph + understrykning vid hover/fokus** så att den dolda funktionen blir upptäckbar utan att skrika. Detta måste vara fokuserbart (se 6).
- **Eyebrow** under titeln: "Månadsträff för designers — arkiv" (versal-eyebrow-stil, fg-3).
- **Höger kluster:** tema-toggle överst, "Antal träffar" + total siffra (FR-05) under. Totalsiffran är stor (display-skala) och är ett identitetselement, inte bara metadata.

Bakom rubriken sitter den starkaste glow-noden (se 5.2) — header är sidans "hero-moment".

### 3.2 Kontrollfält (sök + filter + sortering)
Tre staplade band direkt under header, alla med bg-2 (lätt upphöjd yta mot bg-1):
1. **Sökband:** sökfält (med ikon) till vänster, resultaträknare till höger (FR-06).
2. **Tagg-filterband:** label "Filtrera:" + "Alla"-chip + dynamiska taggchips (FR-11).
3. **År + sorteringsband:** label "År:" + "Alla"-chip + årschips till vänster; sorteringsknapp till höger (FR-15, FR-20).

På desktop **sticky:ar detta kontrollfält** under header efter scroll (sticky top, med subtil bakgrundsblur/backdrop-filter så atmosfären skiner igenom men texten förblir läsbar). Det gör sök/filter alltid nåbart i ett långt arkiv. På mobil är det icke-sticky (sparar höjd). Sticky-elementet får inte orsaka CLS: dess höjd reserveras.

### 3.3 Träfflista (kärnan)
Vertikal lista av dragspelsrader (FR-02). Varje **stängd** rad, tre kolumner:
- **Datumblock** (vänster, fast bredd ~4 rem): dag stort (display), månad förkortad versal, år litet (FR-03). Tre separata visuella element.
- **Infoblock** (mitten, flexar): titel (h-nivå), 2-radig klippt sammanfattning, taggchips.
- **Chevron** (höger): roterar 180 grader vid öppning.

**Öppen** rad: chevron roterad, kort sammanfattning döljs, detaljpanel veckas ut indragen under titeln (vänsterindrag i linje med infoblocket, ~5,5 rem på desktop / 4,5 rem mobil). Detaljens hierarki, uppifrån:
1. Sammanfattning (full)
2. — avdelare —
3. Verktyg & tekniker (lista, punkt-prick i accent)
4. — avdelare —
5. Viktiga insikter (lista, em-streck i accent)
6. — avdelare —
7. Taggar (chips)
8. Länkavsnitt (Miro / material) — visas bara om länk finns (FR-35)

### 3.4 Schema-panel (dold dokumentation)
Default dold (FR-30). När den öppnas: ett band med bg-2 under listan, label + syntaxfärgad JSON i monospace (FR-32). Veckas ut/in som ett dragspel (samma rörelsespråk som träffraderna). Syntaxfärger måste klara kontrast i båda teman (se 6.3).

### 3.5 Footer (ny, liten)
Nuvarande sida saknar footer. Vi adderar en minimal: en tunn rad med CA-wordmark, året, och en återkommande Caveat-detalj (text bestäms av innehållsägare, men platsen finns). Detta ramar in den långa sidan och ger atmosfärslagret en naturlig nedre kant. Litet beslut, men hindrar att sidan "rinner ut".

---

## 4. Komponentinventarium (beteende + tillstånd, ej ramverk)

| Komponent | Tillstånd | Beteende |
|---|---|---|
| **AtmosphereBackground** | full / reduced / light / dark | Fixed, helskärm, z bakom allt, aria-hidden, pointer-events:none. Innehåller prickyta + grid-glow + blobbar. Se 5.1–5.2. I reduced: prickar statiska, blobbar frusna, glow kvar. |
| **ThemeToggle** | ljust / mörkt, hover, fokus | Knapp (track+thumb). Thumb glider 18 px vid byte (FR-26). Ikon: sol (ljust) / måne (mörkt) (AC-07.5). aria-label beskriver *åtgärden*: "Byt till mörkt tema" / "Byt till ljust tema" (NFR-11). Tangentbord: Enter/Mellanslag (AC-07.1). Persisterar ca-theme (FR-27). |
| **SchemaTrigger** ("AI in design") | vila, hover, fokus, aktiv | Inline-text i rubriken, Caveat. Affordans: "{ }"-glyph + understrykning vid hover/fokus. Måste vara ett riktigt fokuserbart kontrollelement (button-semantik), inte bara klickbar text — annars osynlig för tangentbord (NFR-08/09). aria-expanded speglar panelens tillstånd. |
| **SearchField** | tom, ifylld, fokus | Textfält, ikon till vänster, löpande filtrering (FR-08). Synligt label eller aria-label utöver placeholder (NFR-12). Fokus: synlig ring. Placeholder: "Sök träff, ämne, verktyg...". |
| **ResultCount** | — | Text "X av N träffar" (FR-06). Vid 0: "0 träffar". Talet i accentfärg. Uppdateras synkront. aria-live="polite" så skärmläsare hör resultatändringen. |
| **FilterChip** (tagg & år) | vila, hover, aktiv, fokus | Pill-knapp, enkelval per grupp (FR-12, FR-16). Aktiv = fylld i accent, hög kontrast text. Använd aria-pressed för aktivt tillstånd (inte bara färg — färg får inte vara enda indikator). Touch-yta >= 44x44 px (ui-ux-pro-max touch-target). |
| **SortButton** | nyast / äldst, hover, fokus | Knapp med etikett + pil. Etikett byter "Nyast först" <-> "Äldst först" (FR-21, AC-04.2). Pil roterar 180 grader för att spegla riktning. aria-label t.ex. "Sortering: nyast först. Klicka för äldst först." |
| **MeetingAccordion** | stängd, öppen, hover, fokus | Rad-header är en button med aria-expanded + aria-controls pekande på detaljpanelen (NFR-10). Enkel-öppen-modell (FR-04). Öppning animeras (5.3). Hover: subtil bakgrundston (inte opacity-dimning som idag — opacity på hover gör texten svårläst; vi byter till mjuk bg-höjning). |
| **MeetingDetail** | dold, synlig | Innehållssektioner per 3.3. Tar emot höjdanimation. Länkavsnitt villkorat (FR-35). role="region" med aria-labelledby mot rad-titeln. |
| **ExternalLinkButton** | Miro / material, hover, fokus | Outline-knapp, ikon + text + pil. target="_blank" rel="noopener noreferrer". Tillgängligt namn inkluderar "(öppnas i ny flik)". Miro behåller sin gula märkesfärg men i en variant som klarar kontrast i mörkt tema (se 6.3). |
| **LoadMoreButton** | synlig, dold | Visas när fler finns (FR-25). Sub-räknare "X till" (FR-24). Vid klick: nya rader staggrar in (5.4), scrollposition bevaras (AC-06.2). |
| **EmptyState** | sök-tom / filter-tom | Meddelande + hjälprad + "Rensa allt". aria-live så det annonseras. |
| **SchemaPanel** | dold, synlig | Dragspel med JSON. Syntaxfärgning kontrast-säker. |
| **TagChip** (icke-interaktiv) | — | Visuell etikett i lista/detalj. Liten pill, accent-tonad. Ej knapp (skiljs från FilterChip). |

---

## 5. Interaktionsmönster & rörelsesystem (det signaturbeslut briefen kräver)

Rörelsesystemet är konkret specificerat här. Alla värden är krav. Allt nedan har en reduced-motion-motsvarighet i 5.6.

### 5.1 Atmosfärslager A — prickad yta (signatur, "à la 21st.dev")

**Bas: prick-grid (dot matrix).**
- **Prickstorlek:** 1,5 px diameter (desktop), 1 px (mobil).
- **Avstånd (grid pitch):** 28 px mellan prickcentrum, kvadratiskt rutnät. Tät nog att kännas som en yta, gles nog att inte bli brus.
- **Prickfärg ljust tema:** anthracite vid 6 % opacitet (rgba(40,40,45,0.06)). Synlig men underordnad texten.
- **Prickfärg mörkt tema:** bone vid 5 % opacitet (rgba(244,241,236,0.05)).
- **Teknik:** renderas som en kaklad radial-gradient-bakgrund (en målad yta, inte tusentals DOM-noder) — kritiskt för NFR-01/05 (prestanda, ingen FPS-dropp). Detta är ett uttryckligt krav till implementor: **prickytan får inte vara enskilda element.**

**Rörelse 1 — långsam drift.** Hela prickytan driver diagonalt mycket långsamt: ~40 px förflyttning över **40 sekunder**, fram och tillbaka (ease-in-out, oändlig). Knappt medveten — ger ytan liv utan att dra blicken. Animeras via background-position eller transform: translate på ett dubbelt-tiled lager (transform föredras för GPU, ui-ux-pro-max transform-performance).

**Rörelse 2 — pekar-parallax (depth).** Prickytan ligger i ett lager, glow-noderna (5.2) i ett annat, blobbarna (5.2) i ett tredje. Vid muspekarrörelse förskjuts lagren olika mycket (prickar 4 px, glow 12 px, blob 20 px max) mot pekaren -> känsla av djup. **Detta är pekardrivet, inte scrolldrivet** (medvetet val, se 5.5). På touch: ersätts av mycket subtil device-orientation-tilt om tillgängligt, annars bara drift (Rörelse 1). Pekar-parallax stängs HELT av i reduced-motion.

**"Aktiveringspuls" runt pekaren (mask-glow):** en mjuk radiell ljusning av prickytan följer muspekaren (radie ~180 px) så prickarna närmast pekaren lyser starkare (opacitet upp till 12 % från bas-6 %). Detta är den 21st.dev-aktiga "spotlight på grid"-effekten. Endast desktop/pekare. Inaktiv i reduced-motion.

### 5.2 Atmosfärslager A — glow + blobbar (liquid-elementet)

**Glow-noder:** 2–3 stora, mjuka radiella ljuskällor placerade kompositionellt (en bakom header-höger, en lågt till vänster, en valfri mitt-höger).
- **Ljust tema:** forest-elf-glow, mycket låg opacitet (radial-gradient från rgba(57,82,40,0.10) -> transparent), stor radie (~480 px), mix-blend-mode: multiply så den fördjupar snarare än bleker bone-bakgrunden. En sekundär varm cherry-tomato-glow vid ~0,06 opacitet som accent.
- **Mörkt tema:** här bär glow:en mest av identiteten. Cherry-tomato-glow (rgba(235,60,39,0.18)) + forest-elf-glow (rgba(57,82,40,0.16)), mix-blend-mode: screen så de lyser *upp* mot den nära-svarta bg-1 (#0F0F0D). Detta uppfyller AC-09.5 (glow syns i mörkt, försvinner inte i ljust).

**Blobbar (liquid/organisk rörelse) — minst en, vi specar två (FR-38, AC-09.2):**
- **Form:** stora mjuka former (filter: blur(60–90px)), färgade i accent (forest-elf i ljust, cherry-tomato + forest-elf i mörkt), opacitet 0,12–0,20.
- **Liquid-rörelse:** varje blob animeras med en organisk bana — kombinera (a) långsam translate längs en oregelbunden slinga (~24–32 s loop, olika per blob så de aldrig synkar) och (b) en *border-radius-morph* (animerade asymmetriska border-radius-värden) så formen "andas" och böljar som vätska. Detta är liquid-effekten konkret: blur + radius-morph + drift.
- **Lager:** ligger i parallax-lagret längst bak, rör sig mest vid pekar-parallax (20 px).
- **Prestanda:** max 2 blobbar samtidigt, will-change: transform endast under aktiv animation, blur-radien är fast (animera inte blur — dyrt). Mål: >= 45 FPS (NFR-05).

**Textläsbarhet-garanti:** där text ligger ovanpå atmosfären finns ett tunt bg-1-tonat skikt (88–92 % opak) eller lokal kontrastsäkring bakom textblocken, så att kontrastkraven (NFR-07, 4,5:1) alltid mäts mot en stabil yta — aldrig mot en blob-topp. Implementor måste verifiera kontrast i blob-värsta-läget, inte bara mot bas-bakgrunden.

### 5.3 Accordion-öppning (FR-39, AC-09.3)

- **Öppning:** detaljpanelen animerar från höjd 0 -> auto (mätt höjd) + opacity 0 -> 1, 280 ms, ease-out (cubic-bezier(0.2,0,0,1)). Innehållet inuti translateY 6 px -> 0 parallellt. Chevron roterar 0->180 grader samma duration.
- **Stängning:** omvänt, 220 ms, ease-in (snabbare ut än in — ui-ux-pro-max easing-regel: ease-out in, ease-in ut).
- **Enkel-öppen:** att öppna rad B medan A är öppen -> A stänger (220 ms) medan B öppnar (280 ms), överlappande. Layouten får inte hoppa abrupt; höjdanimationen håller flödet mjukt.
- **Krav:** animera höjd via faktisk uppmätt höjd eller grid-rows-trick, inte via max-height-gissning (annars ojämn timing). Detaljen ska inte orsaka CLS vid stängd vila (NFR-04) — den tar 0 höjd när stängd.

### 5.4 Filter/sök/sortering-övergångar

- **Listbyte:** när filtreringsresultatet ändras (sök/tagg/år/sort) korsfadar listan: utgående rader opacity->0 + translateY -4 px (140 ms), inkommande rader staggrar in opacity 0->1 + translateY 8 px->0, 40 ms förskjutning per rad, ease-out. Ger känslan att listan "ordnar om sig" levande.
- **Stagger-tak:** max 5 synliga rader staggrar (= initial page size), så det aldrig blir en lång väntan.
- **Load-more:** endast de **nya** raderna staggrar in (de befintliga rör sig inte -> scrollposition stabil, AC-06.2).
- **FilterChip-aktivering:** vald chip fyller med accent via en snabb "fill"-övergång (bg 160 ms), och en kort scale-puls (1->1,04->1, 180 ms) som taktil bekräftelse. Pulsen är opacity/transform (säker), och stängs av i reduced-motion (blir ren färgövergång).

### 5.5 Affordans, feedback, validering

- **Hover (pekare):** kontroller får mjuk bg-/border-höjning, 150–200 ms, transform-fri (inga layout-skiftande scale på rader). ui-ux-pro-max: hover får inte orsaka layouthopp.
- **Klick-feedback:** chips/knappar får kort scale-puls (transform, säker). Tema-toggle: thumb-glid är bekräftelsen.
- **Fokus:** se 6.2 — alltid synlig ring.
- **Validering:** sökfältet har ingen validering (fritext); enda "felväg" är 0 resultat -> tomtillstånd (5.4 / 2.4). Inga formulär i scope (ute ur scope per krav), så ingen inline-validering behövs.
- **Varför pekar-parallax och inte scroll-parallax:** ui-ux-pro-max flaggar scroll-driven parallax/scroll-jacking som **hög** risk (illamående, tvingad scroll). Pekar-parallax rör inget i innehållets läsflöde och stoppas trivialt i reduced-motion. Vi får djupkänslan utan a11y-skulden.

### 5.6 Reduced-motion-tillståndet (NFR-13, AC-09.4) — designat, inte bortklippt

Vid prefers-reduced-motion: reduce:
- **Prickyta:** statisk. Drift (Rörelse 1), pekar-parallax (Rörelse 2) och aktiveringspuls AV.
- **Blobbar:** frusna i sin viloposition. Ingen drift, ingen radius-morph. De **finns kvar** som statisk färgyta -> kompositionen ser fortfarande avsiktlig ut.
- **Glow:** kvar (statisk). Glow är inte rörelse; den bär identiteten i mörkt tema och behålls.
- **Accordion:** öppnas/stängs utan höjd-/rörelseanimation -> ren visning eller kort opacity-fade (<= 120 ms). Chevron byter tillstånd utan rotation-tween (direkt).
- **Lista/filter:** ingen stagger, ingen translateY. Byte sker som omedelbar opacity-fade (<= 120 ms) eller direkt.
- **Tema-byte:** sker utan övergångsanimation (direkt).
- **Hover:** endast färg-/border-byte, inga transforms, ingen puls.
- **Sidladdning:** ingen stagger-intro; innehållet är direkt synligt.

Detta är AC-09.4 ordagrant: alla loop-animationer (bakgrund, blob) stoppade, accordion utan rörelse, tema utan övergång, hover begränsad till färg. Implementor: bygg detta som en parallell tillståndsuppsättning bakom en enda media-query-grind, inte som efterhandskorrigering på varje element.

---

## 6. Tillgänglighetsintention (mål: WCAG 2.2 AA, Lighthouse a11y >= 90)

A11y-testern verifierar mot punkterna nedan.

### 6.1 Fokusordning & tangentbordsvägar (NFR-08)
Logisk tab-ordning som följer visuell ordning:
1. Schema-trigger ("AI in design") -> 2. Tema-toggle -> 3. Sökfält -> 4. Tagg-chips (vänster->höger) -> 5. År-chips -> 6. Sorteringsknapp -> 7. Träffrad-headers (top->ned); en öppen rads interna länkar (Miro/material) kommer i tab-ordning direkt efter sin header -> 8. Ladda-fler -> 9. Footer.
- **Allt nåbart med tangentbord** (NFR-08). Accordion öppnas med Enter/Mellanslag. Toggle med Enter/Mellanslag (AC-07.1).
- **Inga tangentbordsfällor.** Atmosfärslagret är aria-hidden + pointer-events:none och tar ingen fokus.
- **Öppnar man en rad** ska fokus stanna på rad-headern (aria-expanded blir true); detaljen exponeras i tab-flödet men fokus hoppar inte oväntat.

### 6.2 Synlig fokusindikator (NFR-08)
- Alla interaktiva element får en **synlig fokusring**: 2 px solid i accentfärg + 2 px offset, ELLER en motsvarande hög-kontrast outline. Får aldrig tas bort (outline: none utan ersättning är förbjudet).
- Fokusringen måste själv klara 3:1 mot sin bakgrund i båda teman. I mörkt tema där accent = cherry-tomato fungerar det; i ljust där accent = forest-elf likaså — men på aktiva (fyllda) chips används en ljus/bone-ring istället så ringen inte smälter in i fyllnadsfärgen.
- :focus-visible används så att pekarklick inte visar ring i onödan, men tangentbord alltid gör det.

### 6.3 Kontrast (NFR-07) — båda teman
- All brödtext >= 4,5:1, stor text/grafik >= 3:1, i **både** ljust och mörkt (NFR-07). Mäts mot den kontrastsäkrade ytan bakom text (5.2), aldrig mot en blob-topp.
- **Att verifiera särskilt:**
  - fg-3/fg-mute (de ljusaste gråtonerna) mot bg-2 — dessa är riskzonen. Eyebrow-text i fg-3 måste klara 4,5:1; om inte, mörka fg-3 ett steg. (ui-ux-pro-max varnar uttryckligen mot för ljus muted-text.)
  - Aktiv FilterChip: text mot accent-fyllnad. forest-elf + bone-text och cherry-tomato + bone-text ska båda klara 4,5:1.
  - **Miro-knapp:** den nuvarande #6B5E00 på ljus gul-tonad bakgrund är gränsfall i ljust och troligen underkänd i mörkt. Beslut: behåll Miro-gult som *ikon-/märkesaccent* men sätt knappens **text** i temats vanliga fg-färg med accent-border, så kontrasten alltid håller. Märkeskänslan finns kvar i ikonen, läsbarheten i texten.
  - Schema-panelens syntaxfärger (key/str/arr): den nuvarande #2C5282 (key) är för mörk mot mörk bg -> byt till en ljusare blå i mörkt tema. Varje syntaxfärg specas per tema med >= 4,5:1.
- **Färg aldrig enda indikator** (NFR + ui-ux-pro-max): aktiv chip har aria-pressed + form/fyllnadsskillnad; sortering har textetikett + pil, inte bara färg; öppen rad har chevron-rotation + aria-expanded, inte bara färg.

### 6.4 Namn & semantik (NFR-09, 10, 11, 12, 14)
- Accordion-headers: riktiga button med aria-expanded + aria-controls -> detaljpanelen (NFR-10).
- Tema-toggle: aria-label som beskriver åtgärden (NFR-11), uppdateras vid byte.
- Sökfält: synligt label eller aria-label utöver placeholder (NFR-12).
- Ikon-knappar (chevron, toggle-ikon, sök-ikon): dekorativa ikoner aria-hidden="true" (NFR-14); knappens namn bärs av text/aria-label.
- Atmosfär-SVG/canvas: aria-hidden="true", role="presentation" (NFR-14).
- Externa länkar: tillgängligt namn anger ny flik ("Öppna Miro-board, öppnas i ny flik").
- ResultCount och EmptyState: aria-live="polite" så filtrering annonseras.
- Dokument: lang="sv" (NFR-18), datum via sv-SE (NFR-19).

### 6.5 Touch & mål
- Alla interaktiva ytor >= 44x44 px effektiv touch-yta (ui-ux-pro-max touch-target), även de visuellt små chip-arna (padding/hit-area).
- Primärinteraktioner är klick/tap, aldrig enbart hover (ui-ux-pro-max hover-vs-tap): schema-triggern och alla kontroller fungerar på tap.

---

## 7. Visuellt system — palett, typografi, tema

### 7.1 Palett (förfinad, inte ersatt)
Behåll CA-tokens. Förfining:
- **Ljust tema:** bg bone/paper, text anthracite, accent **forest-elf**. Cherry-tomato reserveras för selektion + sekundär glow + sällsynt betoning (inte primär accent i ljust — för skrikig som yta).
- **Mörkt tema:** bg nära-svart (#0F0F0D / #171714 / #1F1F1C, befintliga), text bone-vit, accent **cherry-tomato** (befintligt val — det ger mörkt tema sin energi och gör glow:en levande). Forest-elf blir sekundär glow.
- **Beslut:** den befintliga tema-uppdelningen (forest-elf-accent i ljust, cherry-tomato i mörkt) **behålls** — den är redan ett medvetet, distinkt val. Vi adderar bara glow- och blob-färgerna ovanpå samma tokens.

### 7.2 Typografi
- **Montserrat** (display + body) behålls — geometrisk, samtida, passar designer-publik. Display i 700–900 för titlar/datum/totalsiffra, body 400–500.
- **Caveat** (offset) behålls för **exakt ett ändamål:** "AI in design"-märket i rubriken (och valfri footer-detalj). Sparsam användning är poängen — det är den mänskliga, handskrivna gnistan mot Montserrats stränghet. **Avvisat alternativ:** att byta till skillens förslag Newsreader/Roboto — det är en generisk redaktionell parning utan CA:s personlighet, och skulle slänga den distinkta Montserrat+Caveat-signaturen. Behåll det som finns; det är redan bra.
- Radlängd 65–75 tecken (inre maxbredd ~1100 px), radhöjd 1,5–1,7 för brödtext (befintliga leading-tokens passar).

### 7.3 Tema-mekanik (FR-26–29)
- Toggle växlar data-theme, persisterar ca-theme i localStorage (FR-27), faller tillbaka på prefers-color-scheme utan sparat val (FR-28, AC-07.4).
- **Tema sätts före first paint** (inline-script i head som läser localStorage) -> ingen tema-flash, ingen CLS. Detta är ett krav till tech-arkitekt/implementor för statisk export (NFR-21).
- Tema-byte utan reload (FR-29). Övergång: bakgrund/färg toner mjukt (~220 ms) i full-motion; **direkt** i reduced-motion (NFR-13).

---

## 8. Designrationale (de viktigaste valen + det avvisade alternativet)

1. **Två-lagers-modell (atmosfär bakom, innehåll framför) i stället för animerade innehållskort.**
   *Avvisat:* att lägga glow/liquid direkt på korten och rörelse på texten (det "uppenbara" sättet att leverera "LOTS of animation"). *Varför avvisat:* det dödar läsbarhet och a11y (kontrast mot rörlig yta, distraktion, reduced-motion blir svårt). Två-lagers-modellen ger lika mycket synlig rörelse men isolerar all risk till ett aria-hidden-lager som kan frysas helt utan att innehållet ändras.

2. **Pekar-parallax, inte scroll-parallax.**
   *Avvisat:* scroll-driven djupparallax (vanligast i "21st.dev-aktiga" sidor). *Varför:* ui-ux-pro-max graderar scroll-jacking/parallax som hög risk för rörelsekänslighet, och det stör den långa arkiv-scrollens läsflöde. Pekar-parallax ger djup utan att kapa scroll och stängs av rent i reduced-motion.

3. **Prickyta som målad gradient, inte tusen DOM-prickar.**
   *Avvisat:* individuella prick-element/SVG-noder (lätt att animera per-prick). *Varför:* skalar uselt (NFR-05 FPS, NFR-01 perf). En kaklad radial-gradient som driver via transform ger samma uttryck för en bråkdel av kostnaden.

4. **Behåll CA-paletten + Montserrat/Caveat; addera glow ovanpå.**
   *Avvisat:* ui-ux-pro-max:s stockförslag (community-lila #7C3AED + Newsreader/Roboto). *Varför:* briefens kärnproblem är att sidan inte får kännas generisk. Att byta till stock-lila och en stock-fontparning vore att gå rakt mot målet. CA:s anthracite/forest/cherry/bone + Montserrat/Caveat är redan distinkt; rätt drag är att förstärka den, inte ersätta den.

5. **Cherry-tomato som mörk-tema-accent, forest-elf som ljus-tema-accent (behållet).**
   *Avvisat:* en enda accent över båda teman (enklare). *Varför:* cherry-tomato i mörkt får glow:en att verkligen lysa (AC-09.5) och ger mörkt läge egen karaktär; forest-elf i ljust är lugnare och läsbarare mot bone. Den befintliga uppdelningen är redan rätt instinkt — vi cementerar den.

6. **Sticky kontrollfält på desktop, icke-sticky på mobil.**
   *Avvisat:* alltid sticky, eller aldrig sticky. *Varför:* i ett växande arkiv vill desktop-användaren nå sök/filter när som helst; på mobil äter en sticky-stack för mycket av en liten viewport. Differentierat per breakpoint.

7. **Hover byter bakgrund i stället för att dimma opacity (ändring från nuvarande).**
   *Avvisat:* nuvarande opacity: 0.7 på rad-hover. *Varför:* opacity-dimning sänker textkontrast vid hover (kan bryta 4,5:1) och känns som att raden "tonar bort". En mjuk bg-höjning signalerar interaktivitet utan att röra textkontrasten.

8. **Reduced-motion ritad som egen variant från start.**
   *Avvisat:* att klippa animationer i efterhand med en global media-query. *Varför:* det ger ofta trasiga mellantillstånd (frysta halv-animationer, försvunna element). Genom att designa det reducerade tillståndet explicit (statiska prickar + frysta blobbar + kvarvarande glow) förblir kompositionen avsiktlig och vacker även utan rörelse — vilket A-04 förutsätter att stakeholdern accepterar.

9. **Miro-knapp: märkesfärg i ikon, läsbar text i fg-färg.**
   *Avvisat:* behålla nuvarande gul-på-gult-text. *Varför:* den faller på kontrast (särskilt mörkt tema). Ikonen bär märket, texten bär läsbarheten — båda kraven uppfyllda.

---

## 9. Överlämning till nästa faser

- **Tech-arkitekt (parallellt):** prickytan = en målad, transform-animerad gradient (inte DOM-noder); tema måste sättas före first paint (inline head-script) för statisk export; parallax är pekar-/sensorbaserad; allt rörelse-loop ska gå att grinda via en enda prefers-reduced-motion-väg. Animationsbibliotek (Framer Motion enligt brief) ska kunna respektera reduced-motion centralt.
- **Implementor:** alla värden i kap 5 är krav (storlek, pitch, opacitet, duration, easing). Kontrast måste verifieras i blob-värsta-läget, inte mot bas-bg. Bygg reduced-motion som parallell tillståndsuppsättning.
- **A11y-tester:** checklistan i kap 6 är din verifieringslista. Särskild risk: fg-3/fg-mute-kontrast, aktiv-chip-kontrast, Miro-knapp, syntaxfärger i mörkt tema, fokusring mot accent-fyllnad, aria-live på räknare/tomtillstånd, reduced-motion faktiskt fryser allt loop.

*Detta dokument är design-kontrakt för fas 4–6. Ändringar kräver ny version.*
