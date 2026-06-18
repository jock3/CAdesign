# Tillgänglighetsrapport — CA Design Archive

**Agent:** accessibility-tester (Sonnet)
**Datum:** 2026-06-17
**Standard:** WCAG 2.2 AA
**Metod:** Statisk kodanalys

---

## Sammanfattning

7 kritiska tillgänglighetsbrister identifierade som blockerar WCAG 2.2 AA-efterlevnad — alla är kontrastproblem eller avsaknad av fokusindikatorer. Semantik, landmärken och ARIA-mönster är i övrigt välimplementerade.

---

## Critical

### A-C01 — År-text: katastrofalt låg kontrast (WCAG 1.4.3)
- **Fil:** `src/components/MeetingItem.tsx`, `src/app/globals.css`
- **Problem:** År-texten i datumkolumnen använder `--fg-mute`. Kontrastförhållande: **1.53:1 (ljust) / 1.91:1 (mörkt)**. Krav: 4.5:1 för normal text.
- **Fix:** Använd `--fg-3` (eller mörkare) för år-texten. `--fg-mute` / `--ca-mist` ska inte användas för läsbar text.

### A-C02 — `--fg-3`-etiketter i ljust tema (WCAG 1.4.3)
- **Fil:** `src/app/globals.css`, alla komponenter med eyebrow-labels och filter-labels
- **Problem:** `--fg-3: #8A8A86` på `--bg-1: #F4F1EC` och `--bg-2: #FAF8F4` ger **3.08–3.27:1**. Krav: 4.5:1.
- **Fix:** Mörkna `--fg-3` i ljust tema till minst `#696965` (ger 4.6:1 på --bg-1).

### A-C03 — `--fg-3`-etiketter i mörkt tema (WCAG 1.4.3)
- **Fil:** `src/app/globals.css`
- **Problem:** `--fg-3: #66635C` i mörkt tema på `--bg-1: #0F0F0D` och `--bg-2: #171714` ger **3.00–3.20:1**.
- **Fix:** Ljusna `--fg-3` i mörkt tema till minst `#8A8780` (ger ~4.5:1).

### A-C04 — Aktiv filterpill i mörkt tema (WCAG 1.4.3)
- **Fil:** `src/components/FilterBar.tsx`, `src/app/globals.css`
- **Problem:** Aktiv pill: bone `#F4F1EC` text på cherry-tomato `#EB3C27` bakgrund = **3.58:1**. Krav: 4.5:1.
- **Fix:** Använd vit `#FFFFFF` text på cherry-tomato (ger 4.1:1 — fortfarande otillräckligt) ELLER mörkna cherry-tomato till `#C42E1A` (ger 5.5:1 med bone). Alternativt: mörkare text + ljusare bakgrund.

### A-C05 — Tagtext i mörkt tema (WCAG 1.4.3)
- **Fil:** `src/app/globals.css` (`--tag-text` i dark)
- **Problem:** Cherry-tomato `#EB3C27` på beräknat `--tag-bg` (rgba(235,60,39,0.10) på #0F0F0D) = **4.39:1**. Krav: 4.5:1. Marginellt underbetyg.
- **Fix:** Öka `--tag-text` i dark till `#F04E35` eller liknande (ger 4.6:1), eller mörkna `--bg-1` i dark tag-bg-beräkningen.

### A-C06 — Sökfält utan synlig fokusindikator (WCAG 2.4.11)
- **Fil:** `src/components/SearchBar.tsx` / `src/app/globals.css`
- **Problem:** `outline: none` satt på `#search` (ärvt från original), ersatt enbart med border-color-ändring som inte uppfyller 2.4.11 (minst 2px solid med tillräcklig kontrast).
- **Fix:** Lägg till `input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`.

### A-C07 — Inga globala focus-visible-regler (WCAG 2.4.11)
- **Fil:** `src/app/globals.css`
- **Problem:** Ingen `button:focus-visible`, `a:focus-visible` eller `:focus-visible`-global-regel definieras. Alla knappar och acordion-rader saknar synliga fokusindikatorer för tangentbordsanvändare.
- **Fix:**
  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 3px;
  }
  /* Undantag för element med eget focus-mönster kan läggas till specifikt */
  ```

---

## Godkänt (PASS)

- `<html lang="sv">` satt i layout.tsx ✓
- Semantiska landmärken (`<header>`, `<main>`) ✓
- Accordion ARIA-mönster: `role="button"`, `aria-expanded` ✓
- Tema-toggle: `aria-label`, `role="button"`, `aria-pressed` ✓
- Sökfälts `<label>` (SR-only) ✓
- Dekorativa ikoner och atmosfärslager: `aria-hidden="true"` ✓
- Externa länkar annonserar ny flik (`target="_blank"` + visuell indikator) ✓
- `prefers-reduced-motion`: CSS-lager + `MotionConfig reducedMotion="user"` ✓
- Miro-länk: text, inte enbart ikon ✓
- Schema-syntaxfärger i mörkt tema: godkänd kontrast ✓

---

## GATE DECISION: FAIL

**7 Critical blockers** — alla kontrast- och fokusrelaterade.

Prioriterad åtgärdsordning:
1. Globalt `:focus-visible`-regel (A-C07) — en rad, löser mest
2. `--fg-mute` bort från läsbar text (A-C01) — en rad per komponent
3. Justera `--fg-3` i båda teman (A-C02, A-C03) — 2 token-ändringar
4. Aktiv pill i mörkt tema (A-C04) — 1 token-ändring
5. Tagtext i mörkt tema (A-C05) — 1 token-ändring
6. Sökfälts focus-styling (A-C06) — täcks av A-C07 om global regel sätts

Kör fas 5 igen efter åtgärder.
