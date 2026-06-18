# Testrapport — CA Design Archive

**Agent:** tester (Sonnet)
**Datum:** 2026-06-17
**Metod:** Statisk kodanalys mot requirements.md

---

## Sammanfattning

38 av 41 funktionella krav: PASS. 2 PARTIAL. Kritiska och blockerande problem hittades i tillgänglighet, mobilresponsivitet och ARIA-semantik.

---

## Funktionella krav (FR)

| Krav | Status | Notering |
|------|--------|---------|
| FR-01–FR-04 Fuzzy-sökning (Fuse.js, threshold 0.35, 5 fält) | PASS | Korrekt implementerat i ArchiveClient |
| FR-05–FR-08 Tagg-filter (dynamiskt, kombinerbara) | PASS | FilterBar korrekt |
| FR-09–FR-12 År-filter | PASS | Korrekt |
| FR-13–FR-15 Sortering (nyast/äldst) | PASS | SortButton + logik korrekt |
| FR-16–FR-22 Accordion (ett öppet åt gången, summary/tools/takeaways/taggar/länkar) | PASS | MeetingItem korrekt |
| FR-23–FR-25 Load-more pagination (5+5) | PASS | Korrekt |
| FR-26–FR-28 Mötesräknare + resultaträknare | PASS | aria-live på räknare |
| FR-29–FR-30 Dolt JSON-schema-panel | PASS | SchemaPanel med toggle |
| FR-31–FR-33 Tema-toggle (ljust/mörkt, localStorage) | PASS | ThemeToggle + pre-paint script |
| FR-34–FR-36 Befintlig mötesdata (4 möten, alla fält) | PASS | meetings.ts komplett |
| FR-37 Glow-effekter | PARTIAL | Blob-glöd implementerat, men inga box-shadow glow-effekter på UI-element (cards, taggar) |
| FR-38–FR-39 Animerad dotted-bakgrund + liquid blobs | PASS | DottedBackground + LiquidBlobs |
| FR-40 Mobilresponsivitet | PARTIAL | Se M-01 nedan |
| FR-41 Svensk copy | PASS | |

---

## Icke-funktionella krav (NFR)

| Krav | Status | Notering |
|------|--------|---------|
| NFR-01 Lighthouse Performance ≥ 80 | UNTESTABLE | Kräver körning |
| NFR-07 WCAG 2.2 AA kontrast | FAIL | `--fg-3` (#8A8A86) på `--bg-2` (#FAF8F4) → ~3.5:1, under 4.5:1 för text 10–13px |
| NFR-08 Tangentbordsnavigation | FAIL | Se C-01 — inga `:focus-visible`-regler |
| NFR-09 prefers-reduced-motion | PASS | CSS-lager + MotionConfig reducedMotion="user" |
| NFR-10 ARIA-semantik | FAIL | Se M-02 — brutna aria-labelledby-referenser |
| NFR-13 Inga render-blockerande fonts | PASS | next/font används |
| NFR-21 Statisk export | PASS | output: 'export' + out/ genererad |

---

## Blockerande problem

### C-01 — Saknade focus-visible indikatorer (Critical)
- **WCAG:** 2.4.7 Focus Visible (AA)
- **Problem:** Inga `:focus-visible`-CSS-regler i globals.css eller komponenterna. Tangentbordsanvändare ser ingen visuell fokusindikator på knappar, accordion-rader eller inmatningsfält.
- **Fix:** Lägg till i globals.css:
  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 3px;
  }
  ```

### M-01 — Mobilresponsivitet trasig vid 360 px (Major)
- **Problem:** Container använder `maxWidth: '75vw'` med fast padding. På 360 px ger detta ~222 px nettbredd. Inga media queries finns för mobilanpassning av sticky control bar, filter-chips eller accordion-kolumner.
- **Fix:** Lägg till breakpoint-logik: `max-width: 100%` + minskad padding på mobil. Sticky bar ska staka vertikalt på mobil (per UX-spec).

### M-02 — Brutna aria-labelledby-referenser i accordion (Major)
- **WCAG:** 1.3.1 Info and Relationships (A)
- **Problem:** Accordion-detalj-div har `aria-labelledby` som pekar på ett `id` som inte existerar på knapp-elementet.
- **Fix:** Lägg till `id={`meeting-header-${meeting.id}`}` på accordion-knappen och `aria-labelledby={`meeting-header-${meeting.id}`}` på detalj-div.

### M-03 — Otillräcklig kontrast för liten text (Major)
- **WCAG:** 1.4.3 Contrast (AA)
- **Problem:** `--fg-3: #8A8A86` på `--bg-2: #FAF8F4` = ~3.5:1. Används för etiketter (11px, uppercase, 0.18em tracking) som kräver 4.5:1.
- **Fix:** Mörkna `--fg-3` till t.ex. `#6B6B67` (ger ~4.6:1) eller använd `--fg-2` för dessa etiketter.

---

## Minor

- **T-M01:** Inga box-shadow glow-effekter på UI-komponenter (FR-37 delvis uppfyllt)
- **T-M02:** `[data-theme="dark"] [aria-hidden="true"]` CSS-selector för bred — kan träffa oavsiktliga element

---

## GATE DECISION: FAIL

**Blockerare:** C-01 (Critical), M-01, M-02, M-03 (alla Major)

Returnera till implementor med denna rapport. Kör fas 5 igen efter åtgärder.
