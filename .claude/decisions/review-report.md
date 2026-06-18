# Kodgranskningsrapport — CA Design Archive

**Agent:** code-reviewer (Haiku)
**Datum:** 2026-06-17
**Granskad kod:** `/home/user/CAdesign/src/`

---

## Sammanfattning

Generell kodkvalitet är hög: korrekt TypeScript-typning, god React hooks-användning, bra tillgänglighetsattribut, och korrekta animationsprestandamönster. Tre problem kräver åtgärd innan release.

---

## Critical

### CR-001 — `dangerouslySetInnerHTML` i SchemaPanel
- **Fil:** `src/components/SchemaPanel.tsx` (~rad 57)
- **Allvarlighet:** Critical
- **Problem:** Används för JSON-syntaxmarkering med hårdkodad HTML. Säkert just nu (statisk sträng), men skapar en underhållsskuld och ett potentiellt XSS-mönster om strängen senare parametriseras.
- **Åtgärd:** Ersätt med JSX-komponenter som renderar span-element med klasser för syntaxfärgning, eller använd en säker syntax-highlighter. Alternativt: behåll men kommentera tydligt att strängen är statisk och aldrig får ta dynamisk input.

---

## Major

### CR-002 — Direkt DOM-stilmutation i ArchiveClient och MeetingItem
- **Fil:** `src/components/ArchiveClient.tsx` (rader 112–115), `src/components/MeetingItem.tsx` (rader 40–41)
- **Allvarlighet:** Major
- **Problem:** `onMouseMove`-handlers sätter `element.style.setProperty()` direkt på DOM-noden för musspotlight-koordinaterna. Detta kringgår Reacts reconciliation. Om user input någonsin flödar in i stilvärdena uppstår XSS-risk.
- **Åtgärd:** Bekräfta att värdena är numeriska (Number-cast) innan de skrivs till CSS-egenskaper. Alternativt: exponera koordinaterna via en ref på container-elementet snarare än på ett godtyckligt barn.

### CR-003 — Saknad keyboard-fokusstyling i MeetingItem
- **Fil:** `src/components/MeetingItem.tsx` (rader 40–41)
- **Allvarlighet:** Major
- **Problem:** Hover-styling (bakgrundsskift) aktiveras bara vid mus-hover. Tangentbordsanvändare som navigerar till ett rad-element via Tab ser ingen visuell feedback vid fokus.
- **Åtgärd:** Lägg till `:focus-visible`-styling (eller Tailwind `focus-visible:`) som matchar hover-stilen, på accordion-rad-elementet.

---

## Minor

### CR-004 — Saknat `role` på schema-panelens wrapper
- **Fil:** `src/components/SchemaPanel.tsx`
- **Allvarlighet:** Minor
- **Problem:** Wrappern saknar `role="region"` och `aria-label` för att ge skärmläsare ett landmärke.

### CR-005 — Oanvänd export `hasLink` i meetings.ts
- **Fil:** `src/data/meetings.ts`
- **Allvarlighet:** Minor
- **Problem:** Exporteras men används inte i någon komponent.

### CR-006 — Hårdkodade färger i SchemaPanel
- **Fil:** `src/components/SchemaPanel.tsx`
- **Allvarlighet:** Minor
- **Problem:** Syntaxfärgerna (`#2C5282`, etc.) är hårdkodade och matchar inte design-tokens. Fungerar i ljust läge men kan ha dålig kontrast i mörkt läge.
- **Åtgärd:** Använd CSS-variabler eller Tailwind-klasser med dark-variant.

### CR-007 — Index-baserade nycklar i takeaways-listor
- **Fil:** `src/components/MeetingItem.tsx`
- **Allvarlighet:** Minor
- **Problem:** `takeaways.map((t, i) => <li key={i}>...)` — index som nyckel är OK för statisk data men okonventionellt.

### CR-008 — Extensiva inline-stilar
- **Allvarlighet:** Minor
- **Problem:** Många komponenter blandar Tailwind-klasser med inline `style={{}}`-objekt. Fungerar men försvårar underhåll.

---

## Positiva observationer

- Korrekt TypeScript-typning genomgående, minimal `any`-användning
- `aria-hidden="true"` på dekorativa lager (DottedBackground, LiquidBlobs) — korrekt
- `aria-pressed` på filterknappar — korrekt
- `aria-live="polite"` på resultaträknare — korrekt
- `AnimatePresence` med korrekt nyckelhantering på accordion
- `useReducedMotion` hook används konsekvent
- `next/dynamic` med `ssr: false` korrekt placerad i klientkomponent

---

## GATE DECISION: FAIL

**Blockerare:** CR-001 (Critical), CR-002 (Major), CR-003 (Major)

Åtgärda dessa tre innan deploy. Minors kan åtgärdas i samma pass eller i en uppföljning.
