# Kravspecifikation — Re-plattformering av [CA Design] AI in design-arkivet

**Version:** 1.0  
**Datum:** 2026-06-17  
**Fas:** 2 – Requirements Writer  
**Nästa fas:** UX-designer + Tech-arkitekt (parallellt)

---

## 1. Produktöversikt

Arkivsidan för CA Design-communityts månatliga AI-designträffar re-plattformeras från en enskild statisk HTML-fil till en modern Next.js/React-applikation med animationsrik, "levande" estetik. Alla befintliga funktioner porteras oförändrade. Produkten är ett publikt arkiv utan autentisering eller CMS — mötesdata underhålls manuellt i källkoden.

---

## 2. Funktionella krav

### 2.1 Mötesinsamling och datavisning

**FR-01** Applikationen ska visa samtliga fyra befintliga möten (2025-11, 2025-12, 2026-02, 2026-05) med deras nuvarande data intakta: titel, datum, sammanfattning, verktyg, insikter, taggar, Miro-länk och materiallänk.

**FR-02** Varje möte ska visas som ett hopfällbart element (accordion) i en lista. I stängt läge visas datum, titel, kortare sammanfattning (max 2 rader) och taggar. I öppet läge visas full sammanfattning, verktygslista, insikter, tagguppsättning och externt länk-avsnitt.

**FR-03** Datumvisning per möte ska presentera dag, månadsnamn (förkortat, svenska) och år som separata visuella element.

**FR-04** Exakt ett möte i taget kan vara öppet. Att klicka på ett redan öppet mötes rubrik stänger det.

**FR-05** Antal träffar (totalt, ej filtrerat) ska visas permanent i sidhuvudet.

**FR-06** Antalet synliga träffar i den aktiva filtreringen (t.ex. "3 av 4 träffar") ska visas i anslutning till sökfältet.

### 2.2 Fuzzy-sökning

**FR-07** Användaren ska kunna söka fritext. Sökningen ska använda fuzzy-matchning mot fälten: titel, sammanfattning, taggar, verktyg och insikter.

**FR-08** Sökning sker löpande vid inmatning (ingen separat sök-knapp krävs).

**FR-09** Aktiverar sökning återställs paginering till sin startsida (sida 1).

**FR-10** Inga träffar för sökning ska visa ett "inga resultat"-meddelande på svenska.

### 2.3 Tagg-filter

**FR-11** Alla unika taggar från mötesdatan ska genereras dynamiskt och presenteras som filterknappar.

**FR-12** Standardläget är "Alla" (inga taggar filtrerade). Exakt ett tagg-alternativ är aktivt åt gången.

**FR-13** Att välja ett tagg-filter visar enbart möten som innehåller den aktuella taggen.

**FR-14** Aktiverar tagg-filter återställs paginering till sin startsida.

### 2.4 År-filter

**FR-15** Alla unika år ur mötesdatan ska genereras dynamiskt och presenteras som filterknappar.

**FR-16** Standardläget är "Alla år". Exakt ett år-alternativ är aktivt åt gången.

**FR-17** Att välja ett år-filter visar enbart möten från det valda kalenderåret.

**FR-18** Tagg-filter och år-filter kan kombineras (båda aktiva samtidigt).

**FR-19** Aktiverar år-filter återställs paginering till sin startsida.

### 2.5 Sortering

**FR-20** Användaren ska kunna växla sorteringsordning mellan "Nyast först" (standard) och "Äldst först" med en knapp.

**FR-21** Knappens etikett och visuell indikator ska spegla aktivt sorteringsläge.

**FR-22** Aktiverar sortering återställs paginering till sin startsida.

### 2.6 Load-more-paginering

**FR-23** Listan visar initialt 5 möten. Knappen "Ladda fler" laddar ytterligare 5 möten.

**FR-24** I anslutning till knappen visas antalet kvarvarande möten (t.ex. "2 till").

**FR-25** Knappen visas inte när alla matchade möten redan är synliga.

### 2.7 Tema (ljust/mörkt)

**FR-26** En synlig tema-toggle växlar mellan ljust och mörkt tema.

**FR-27** Valt tema persisteras i localStorage under nyckeln `ca-theme`.

**FR-28** Vid första besök utan persistent preferens används `prefers-color-scheme` för att initialisera temat.

**FR-29** Temat ska träda i kraft utan helsides-reload.

### 2.8 Dolt JSON-schema-panel

**FR-30** En JSON-schema-panel visas som standard dold. Panelen beskriver datastrukturen för ett mötesobjekt (som dokumentation för den som lägger till träffar).

**FR-31** Panelen visas/döljs genom att klicka på texten "AI in design" i sidhuvudet.

**FR-32** Panelen presenterar ett JSON-kodexempel med syntaxfärgning.

### 2.9 Extern länkning

**FR-33** Om ett möte har en Miro-länk ska en "Öppna Miro-board"-länk visas i mötesets detaljvy. Länken öppnar i ny flik.

**FR-34** Om ett möte har en materiallänk ska en "Material från träffen"-länk visas i detaljvy. Länken öppnar i ny flik.

**FR-35** Möten utan Miro-länk och utan materiallänk visar inget länk-avsnitt.

### 2.10 Animerad bakgrund och visuella effekter

**FR-36** Sidan ska ha en animerad prickad (dotted) eller grid-bakgrund, synlig i både ljust och mörkt tema. Bakgrunden ska vara i rörelse (ej statisk bild).

**FR-37** Glow-effekter (ljussken) ska användas på utvalda interaktiva och dekorativa element.

**FR-38** Blob/liquid-rörelseelement ska finnas på sidan — minst ett ambient animationsElement med organisk, flytande rörelse.

**FR-39** Animationer vid accordion-öppning/stängning, sidladdning och filter-interaktioner ska vara märkbara och polerade.

### 2.11 Responsivitet

**FR-40** Layouten ska anpassas för mobila skärmar (minsta stödda bredd: 360 px). Alla funktioner ska vara tillgängliga och användbara på mobil.

**FR-41** Sidan ska vara fullt funktionell på desktop (≥ 1280 px bredd) med en maxbredd på innehållet som inte överstiger 75 vw.

---

## 3. User stories med acceptanskriterier

### 3.1 Bläddra och hitta en träff

**US-01 — Söka fritext**  
Som communitymedlem vill jag söka på ett ämne, verktyg eller nyckelord, för att snabbt hitta relevanta träffar utan att bläddra igenom hela listan.

*Acceptanskriterier:*
- **AC-01.1:** Givet att användaren skriver "Gemini" i sökfältet, när listan renderas, ska enbart möten vars titel, sammanfattning, taggar, verktyg eller insikter matchar "Gemini" (med viss tolerans för stavfel) visas.
- **AC-01.2:** Givet att söktermen inte matchar något möte, när listan renderas, ska ett meddelande på svenska visas: "Inga träffar hittades för din sökning."
- **AC-01.3:** Givet att användaren rensar sökfältet, när fältet är tomt, ska hela den ofiltrerade listan (med aktiva tagg/år-filter applicerade) visas igen.
- **AC-01.4:** Sök-resultaträknaren uppdateras synkront med sökinmatningen.

**US-02 — Filtrera på tagg**  
Som communitymedlem vill jag filtrera träffar på en specifik tagg (t.ex. "Workflow"), för att enbart se möten som behandlar det ämnet.

*Acceptanskriterier:*
- **AC-02.1:** Givet att tagg-filtret "Workflow" är aktivt, när listan renderas, ska enbart möten som innehåller taggen "Workflow" visas.
- **AC-02.2:** Givet att "Alla" är aktivt, ska alla möten visas (med övriga aktiva filter applicerade).
- **AC-02.3:** Exakt en tagg-knapp är visuellt markerad som aktiv åt gången.
- **AC-02.4:** Att aktivera ett tagg-filter återställer listan till sida 1.

**US-03 — Filtrera på år**  
Som communitymedlem vill jag filtrera träffar på ett visst år för att snabbt hitta material från den perioden.

*Acceptanskriterier:*
- **AC-03.1:** Givet att år-filtret "2025" är aktivt, ska enbart möten från 2025 visas.
- **AC-03.2:** Tagg-filter och år-filter kan vara aktiva samtidigt — listan visar enbart möten som uppfyller båda villkoren.
- **AC-03.3:** Att aktivera ett år-filter återställer listan till sida 1.

**US-04 — Sortera träfflistan**  
Som communitymedlem vill jag kunna se träffarna i kronologisk ordning (äldst till nyast), för att följa arkivets historia från start.

*Acceptanskriterier:*
- **AC-04.1:** Standardsortering är nyast träff överst.
- **AC-04.2:** Att klicka på sorteringsknappen växlar till äldst träff överst. Knappetiketten byter till "Äldst först".
- **AC-04.3:** Att klicka igen växlar tillbaka till "Nyast först".
- **AC-04.4:** Att byta sortering återställer listan till sida 1.

**US-05 — Läs detaljer om en träff**  
Som communitymedlem vill jag expandera ett möte för att läsa full sammanfattning, verktyg, insikter och komma åt Miro-board och material.

*Acceptanskriterier:*
- **AC-05.1:** Givet att ett möte är stängt, när användaren klickar på mötesobjektet, ska detaljvyn expanderas och visa: full sammanfattning, verktygslista, insikter (bullet-lista), tagg-chips och länk-avsnitt (om Miro/material finns).
- **AC-05.2:** Givet att ett möte är öppet, när användaren klickar på det igen, ska detaljvyn fällas ihop.
- **AC-05.3:** Enbart ett möte är öppet åt gången. Att öppna ett nytt möte stänger det föregående öppna mötet.
- **AC-05.4:** Om mötet saknar Miro-länk visas ingen Miro-knapp. Om mötet saknar materiallänk visas ingen material-knapp.

**US-06 — Ladda fler träffar**  
Som communitymedlem vill jag kunna ladda fler träffar utan att lämna sidan, för att se mer arkivmaterial utan helsides-reload.

*Acceptanskriterier:*
- **AC-06.1:** Initialt visas max 5 möten. Knappen "Ladda fler" är synlig om fler möten finns.
- **AC-06.2:** Att klicka "Ladda fler" lägger till 5 ytterligare möten i listan (utan att befintliga scroll-position ändras drastiskt).
- **AC-06.3:** Bredvid "Ladda fler"-knappen visas antalet kvarvarande möten som ännu inte visas.
- **AC-06.4:** Knappen "Ladda fler" döljs när alla matchade möten visas.

### 3.2 Tema

**US-07 — Byta och bevara tema**  
Som communitymedlem vill jag kunna välja mörkt eller ljust tema, och att mitt val bevaras mellan sessioner.

*Acceptanskriterier:*
- **AC-07.1:** En synlig tema-toggle finns i sidhuvudet och är åtkomlig med tangentbord (Tab + Enter/Mellanslag).
- **AC-07.2:** Att aktivera toggeln ändrar temat direkt utan sidladdning.
- **AC-07.3:** Valt tema (ljust/mörkt) sparas i localStorage (`ca-theme`). Nästa sidladdning startar i samma tema.
- **AC-07.4:** Utan sparad preferens initialiseras temat från `prefers-color-scheme`.
- **AC-07.5:** Toggelns etikett och ikon reflekterar aktivt tema (sol-ikon för ljust, måne-ikon för mörkt).

### 3.3 JSON-schema-panel (dold hjälpdokumentation)

**US-08 — Visa mötesdatastrukturen**  
Som innehållsansvarig (som lägger till träffar via kod) vill jag snabbt se JSON-schemat för ett mötesobjekt, utan att öppna källkoden.

*Acceptanskriterier:*
- **AC-08.1:** Vid sidladdning är JSON-schema-panelen dold.
- **AC-08.2:** Att klicka på texten "AI in design" i sidhuvudet visar panelen.
- **AC-08.3:** Att klicka igen döljer panelen.
- **AC-08.4:** Panelen visar ett JSON-kodexempel med samtliga fält (id, title, date, summary, tools, takeaways, tags, link, miro) och syntaxfärgning.

### 3.4 Animerat och visuellt

**US-09 — Uppleva en levande och energifull sida**  
Som communitymedlem vill jag att sidan känns dynamisk och modern, så att den speglar communityt och ämnet AI.

*Acceptanskriterier:*
- **AC-09.1:** En animerad prickad/grid-bakgrundsyta är synlig bakom innehållet i både ljust och mörkt tema.
- **AC-09.2:** Minst ett blob/liquid-element med organisk rörelse finns på sidan.
- **AC-09.3:** Accordion-expansion och -kollaps är animerad (ej abrupt).
- **AC-09.4:** Givet att `prefers-reduced-motion: reduce` är aktivt i OS/webbläsare, ska alla rörelsedrivna animationer vara avstängda eller reducerade till fade/opacity-övergångar. Inga loop-animationer (bakgrund, blob) ska spelas upp.
- **AC-09.5:** Glow-effekter återges korrekt i mörkt tema utan att försvinna i ljust tema.

---

## 4. Icke-funktionella krav

### 4.1 Prestanda

**NFR-01** Lighthouse Performance-poäng ska vara ≥ 80 på desktop (simulerad 4G-anslutning, ingen CPU-begränsning).

**NFR-02** Lighthouse Performance-poäng ska vara ≥ 70 på mobil (Lighthouse mobilprofil).

**NFR-03** Largest Contentful Paint (LCP) ska vara ≤ 2,5 sekunder på desktop.

**NFR-04** Cumulative Layout Shift (CLS) ska vara < 0,1.

**NFR-05** Animationsintensiva element (bakgrund, blob) ska inte orsaka Frame Drop under 45 FPS vid normal interaktion på en modern dator (Chrome DevTools Performance-panel).

### 4.2 Tillgänglighet

**NFR-06** Sidan ska uppfylla WCAG 2.2 nivå AA. Lighthouse Accessibility-poäng ska vara ≥ 90 (desktop).

**NFR-07** Kontrastvärden: all text mot bakgrund ska uppfylla WCAG 2.2 AA-kravet (≥ 4,5:1 för normal text, ≥ 3:1 för stor text/grafik). Detta gäller i både ljust och mörkt tema.

**NFR-08** Sidan ska kunna navigeras helt med tangentbord. Fokusordning ska vara logisk och synlig fokusindikator ska alltid visas.

**NFR-09** Alla interaktiva element (knappar, toggle, accordion-rader, externa länkar) ska ha tillgängliga namn (aria-label eller synlig text).

**NFR-10** Accordion-element ska ha korrekt ARIA-semantik: `role="button"` eller `<button>` med `aria-expanded` och `aria-controls`.

**NFR-11** Tema-toggle ska ha aria-label som beskriver aktuell och tillgänglig åtgärd (t.ex. "Byt till mörkt tema").

**NFR-12** Sökfältets `placeholder`-text ersätter inte ett synligt label-element (`<label>` eller `aria-label`).

**NFR-13** `prefers-reduced-motion: reduce` ska respekteras. Vid reducerad rörelse-preferens:
- Alla loop-animationer (bakgrund, blob) stoppas.
- Accordion-expansion sker utan rörelseanimation (t.ex. direkt visning eller fade).
- Tema-byte sker utan animationsövergång.
- Knapp-hover-effekter begränsas till färgbyte, inga transforms eller rörelser.

**NFR-14** Bilder och dekorativa SVG-element som enbart är dekorativa ska ha `aria-hidden="true"`.

### 4.3 Webbläsarstöd

**NFR-15** Sidan ska fungera korrekt i:
- Chrome (senaste stabila version)
- Firefox (senaste stabila version)
- Safari (senaste stabila version på macOS)
- Edge (Chromium, senaste stabila version)
- Chrome på Android (senaste stabila version)
- Safari på iOS/iPadOS 16+

**NFR-16** Stöd för Internet Explorer krävs inte.

### 4.4 Språk och lokalisering

**NFR-17** Allt UI-copy, alla etiketter, platshållare, felmeddelanden och systemmeddelanden ska vara på svenska.

**NFR-18** Dokumentets `lang`-attribut ska sättas till `"sv"`.

**NFR-19** Datum formateras enligt svenska konventioner med `sv-SE`-lokal.

### 4.5 Deploy och bygge

**NFR-20** Applikationen ska bygga utan fel och deploya till Vercel. Den deployade sidan ska vara åtkomlig på en publik URL.

**NFR-21** Bygget ska producera statisk output (SSG eller export) — ingen server-side-rendering vid runtime krävs för denna version.

---

## 5. Scope

### 5.1 Inne i scope

- Re-plattformering av befintlig HTML-sida till Next.js/React-applikation
- Portering av alla befintliga funktioner (se FR-01 till FR-41)
- Bevara samtliga fyra befintliga möten med all deras data
- Animerad dotted/grid-bakgrund, glow-effekter och liquid/blob-animation
- Ljust och mörkt tema med persistens via localStorage
- Responsiv layout (mobil + desktop)
- WCAG 2.2 AA-efterlevnad inklusive `prefers-reduced-motion`
- Deploy till Vercel
- Befintliga CA Design-designtokens (färger, typsnitt) bibehålls som utgångspunkt

### 5.2 Ute ur scope

- Backend, databas eller CMS — mötesdata lever i källkoden
- Autentisering eller åtkomstkontroll
- Formulär för att lägga till träffar — manuell kodredigering av JSON-arrayen kvarstår
- Administrationsgränssnitt
- Serverfunktioner (API-routes, serverless functions) för kärnfunktionalitet
- Internationalisering (i18n) — svenska är enda språk
- E-postutskick, notifieringar eller integreringar mot externa tjänster
- Anpassning av domännamn eller DNS-konfiguration — Vercel-subdomän eller befintlig domän är ett deploy-beslut, ej ett applikationskrav
- Hantering av Miro-länkars exponering i källkod — nuvarande exponering accepteras som-är
- CI/CD-pipeline utöver Vercels inbyggda deploy-automation
- Cookiebanner eller GDPR-åtgärder (ingen tracking, ingen cookie-hantering utöver localStorage-tema)
- SEO-optimering (strukturerade data, sitemap) — sidan är inte en konverteringssida

---

## 6. Beroenden och antaganden

### 6.1 Antaganden

**A-01** Mötesdatan lagras hårdkodad i en TypeScript/JavaScript-fil i källkoden (t.ex. en array av mötesobjekt). Exakt filformat och lokation beslutas av tech-arkitekten.

**A-02** Next.js App Router och React används, med Tailwind CSS för stilsättning och en animationsbibliotek (t.ex. Framer Motion) för animationer. Exakta versioner och biblioteksval beslutas av tech-arkitekten.

**A-03** Fuzzy-sökning implementeras med ett bibliotek (t.ex. Fuse.js) mot samma fält som i nuvarande implementation: titel, sammanfattning, taggar, verktyg, insikter.

**A-04** Stakeholdern accepterar att användare med `prefers-reduced-motion` får en meningsfull men rörelsefrihad upplevelse. Grundfunktionalitet påverkas inte.

**A-05** Miro-länkarna (välkomstlänkar med tokens i query-strängen) exponeras i källkoden i likhet med nuvarandelösning. Ingen förändring i hantering av dessa.

**A-06** Deploy sker till Vercel med dess standardkonfiguration för Next.js. Ingen separat CI/CD-pipeline krävs.

**A-07** CA Design-designtokens (färgpaletten med anthracite, gunmetal, forest-elf, cherry-tomato, bone, paper m.fl. samt typsnitten Montserrat + Caveat) är en startpunkt. UX-designern kan förfina eller utöka paletterna.

**A-08** Sidan är publikt tillgänglig utan inloggning.

**A-09** Mobilresponsivitet är ett krav men desktop är primärt (samma Lighthouse-tröskel gäller ej mobilprestanda, se NFR-01 vs NFR-02).

### 6.2 Öppna frågor (vidarebefordras till tech-arkitekt)

**OQ-01** Vilken Next.js-version och routing-modell? App Router (Next 13+) rekommenderas, men exakt version fastslås av tech-arkitekten.

**OQ-02** Tailwind CSS v3 eller v4? Konfigurationssättet skiljer sig; beslutas av tech-arkitekten.

**OQ-03** Domän/URL för den deployade sidan (Vercel-subdomän eller ompekning av befintlig domän)?

**OQ-04** Exakt animationsbibliotek (Framer Motion nämns i brief som förstahandsval)?

---

## 7. Datakatalog — befintliga mötesobjekt

Dessa fyra möten ingår i leveransen och ska bevaras intakta:

| ID      | Datum      | Titel                                           |
|---------|------------|-------------------------------------------------|
| 2025-11 | 2025-11-27 | Gemini - Ett gem i AI världen!                  |
| 2025-12 | 2025-12-18 | Sketch to... - Från penna till maskin!          |
| 2026-02 | 2026-02-26 | Nyheter i AI världen och Copyright              |
| 2026-05 | 2026-05-08 | Claude - Introduktions demo                     |

Datastrukturen (JSON-schema) som ska dokumenteras i den dolda schema-panelen:

```json
{
  "id": "YYYY-MM",
  "title": "Titel på träffen",
  "date": "YYYY-MM-DD",
  "summary": "Kort beskrivning av vad som togs upp.",
  "tools": ["Verktyg 1", "Verktyg 2"],
  "takeaways": ["Insikt nummer ett", "Insikt nummer två"],
  "tags": ["tagg1", "tagg2"],
  "link": "https://länk-till-material.se (valfritt)",
  "miro": "https://miro.com/... (valfritt)"
}
```

---

*Denna kravspecifikation gäller som kontrakt för fas 3 (UX-designer + Tech-arkitekt), fas 4 (Implementor) och fas 5 (Tester + Accessibility-tester). Uppdateringar kräver ny version och överenskommelse med samtliga berörda parter.*
