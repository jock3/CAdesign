# Brief — Redesign av [CA Design] AI in design-arkivet

## Problem

Arkivsidan för CA Designs månatliga AI-träffar lever som en enda statisk HTML-fil och bär inte den visuella ambitionsnivå som gemenskapen och ämnet förtjänar. Sidans nuvarande estetik är funktionell men platt — ingen rörelse, ingen känsla av energi — vilket skapar en dissonans mot ett community som utforskar cutting-edge AI-verktyg. Re-plattformering till Next.js/React är dessutom ett krav för att kunna addera animationer och effekter på det sätt stakeholdern beskriver.

## Mål

Höja upplevt värde och identitetsstyrka för CA Design-communityt: arkivet ska kännas som ett "levande" och professionellt skyltfönster för träffarnas samlade kunskap — inte ett dokument. Sidan är inte en konverteringssida; målet är stolthet, igenkänning och engagemang bland befintliga medlemmar.

## Målgrupp

Svenska UX/produkt-designers i CA Design-communityt. De besöker sidan för att hitta material från en specifik träff (sök/filter) eller för att bläddra historiken. De är vana vid moderna designverktyg och märker direkt om en sida ser generisk ut. Tillgänglighet är relevant — designers värderar korrekt implementerat a11y.

## Scope — vad som är inne

- **Re-plattformering:** Next.js + React, deploy till Vercel. Byggsteg är acceptabelt.
- **Animationer och "liquid"-estetik:** Framer Motion (eller likvärdig), animerad prickad/grid-bakgrund i stil med 21st.dev, glow-effekter, blob/liquid-rörelse. Stakeholdern är explicit: "LOTS of animation".
- **Befintlig funktionalitet porteras över:** fuzzy-sökning (Fuse.js eller motsvarighet), tagg-filter, år-filter, sortering (nyast/äldst), dragspelslista med sammanfattning/verktyg/insikter/taggar/länkar, load-more-paginering, träff-räknare, dolt JSON-schema-panel (triggas av klick på "AI in design" i rubriken), ljust/mörkt tema med toggle.
- **Befintlig data behålls:** Alla fyra nuvarande möten (2025-11, 2025-12, 2026-02, 2026-05) med deras kopior intakta.
- **Svenska kopior:** All text förblir på svenska.
- **Befintliga design tokens:** CA Design-palett (anthracite, gunmetal, forest-elf, cherry-tomato, bone, paper m.fl.) och typsnitt (Montserrat + Caveat) bör respekteras eller förfinas — exakt riktning beslutas av UX-designern.

## Constraints

- **Teknikstack:** React / Next.js (exakt version ej angiven), Tailwind CSS förmodligen (21st.dev-stilen nämns explicit), Framer Motion för animation. Inga andra ramverk är beordrade.
- **Deploy:** Vercel. Inget CI/CD-krav nämnt utöver detta.
- **Data:** Mötesobjekten lever hårdkodade i källkod (JSON-array) — inget backend/CMS specificerat.
- **Lingua:** Allt UI-copy på svenska.
- **Inga budget- eller tidsgränser** har angetts av stakeholdern.

## Framgångskriterier

1. Alla befintliga funktioner fungerar i den nya implementationen (sökning, filter, sortering, accordion, load-more, schema-panel, tema-toggle).
2. Sidan deployar utan fel till Vercel och är åtkomlig på en publik URL.
3. Animerad dotted/grid-bakgrund med glow och liquid/blob-rörelse är synlig och fungerar i både ljust och mörkt läge.
4. Sidans Lighthouse-poäng för Performance är ≥ 80 och Accessibility ≥ 90 på desktop.
5. Tema-toggle (ljust/mörkt) persisterar via localStorage, identiskt med nuvarande beteende.

## Öppna frågor

1. **Exakt Next.js-version och routing-modell?** App Router (Next 13+) eller Pages Router? Påverkar filstruktur och deploy-konfiguration.
2. **Tailwind version?** v3 eller v4? Skiljer sig i konfigurationssätt.
3. **Hur ska mötesobjekten lagras?** Hårdkodat i en `.ts`-fil, ett lokalt JSON-fil, eller planeras ett headless CMS / Supabase-backend längre fram?
4. **Domän/URL?** Ny Vercel-subdomän eller befintlig domän som ska pekas om?
5. **"Add a meeting"-flödet:** JSON-schema-panelen visar idag bara schemat som referens. Ska det i denna iteration fortfarande vara manuell kod-edit, eller ska ett formulär/gränssnitt byggas?
6. **Mobilresponsivitet-ambition:** Nuvarande sida har grundläggande mobilstöd. Ska den nya sidan prioritera mobilupplevelsen lika högt som desktop, eller är desktop primärt?
7. **Animationsintensitet vs. tillgänglighet:** `prefers-reduced-motion` ska respekteras — bekräfta att stakeholdern accepterar att animationer slås av/ned för användare som begärt det.
8. **Befintliga Miro-länkar:** Öppna välkomstlänkar med långa tokens — dessa är känsliga och synliga i källkod. Ska de hanteras annorlunda (lösenordsskyddat, server-side) eller är nuvarande exponering acceptabel?
