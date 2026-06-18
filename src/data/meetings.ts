export interface Meeting {
  id: string;
  title: string;
  date: string;
  summary: string;
  tools: string[];
  takeaways: string[];
  tags: string[];
  link?: string;
  miro?: string;
}

export const meetings: Meeting[] = [
  {
    id: "2026-05",
    title: "Claude - Introduktions demo",
    date: "2026-05-08",
    summary: "En demo av Claude AI och dess funktioner som Artifacts, Design och Code.",
    tools: ["Claude"],
    takeaways: [
      "Stark LLM med bra funktioner",
      "Artifacts — Prompt till fungerande demo.",
      "Design — Konkurrent till Figma.",
      "Code — Möjligheten att kunna skapa live appar och hemsidor."
    ],
    tags: ["Workflow", "Demo"],
    link: "https://drive.google.com/file/d/1JUgvoLRo5REqx45mn9Ojklda4JipQLq9/view?usp=sharing",
    miro: ""
  },
  {
    id: "2026-02",
    title: "Nyheter i AI världen och Copyright",
    date: "2026-02-26",
    summary: "Vi pratade om nyheter inom AI världen med nya funktioner för framtidens UX design samt en fördjupning inom copyright för generativ AI.",
    tools: ["Google Stitch", "Figma", "Firefly"],
    takeaways: [
      "Predictive usability optimizer kommer kunna hjälp oss att förutse användarbeteende i design stadiet utan mänskliga intervjuer.",
      "Google köper upp Galileo och blir Google Stitch. Levererar produktionsduglig kod som kan köras direkt eller importeras till Figma.",
      "Figma make uppgraderas med en Skiss till Kod funktion och kan därmed hantera kodkomponenter. Blir som vibecoding för designers.",
      "Copyright för generativ AI är complext... för kreatörerna och inte promptarna. Maskinen ses inte som en upphovsman och kan därmed inte äga en copyright enligt lagens mening. Vi har därmed användanderätt och inte upphovsrätt på det som vi genererar.",
      "Det finns ingen lösning för copyright problematiken men tips är att modifiera innehåll och använda riktiga licenser. Även viktigt att se om plattformen har legal indemnification och tar smällen vil copyright twister."
    ],
    tags: ["Generativ AI", "UI/UX", "Copyright"],
    link: "",
    miro: "https://miro.com/welcomeonboard/WnlIT2VLaEJ0NTNWUGRXdDJhVXB6Z3VRbS80R1FyMFoyZ2l3aUp0N21Fa0Z4K0paMG8yUmo1MG9NcUVTSkVTMmw3RmtLWExIRXNWMEhVMXJrcDlMaHpxR2g1R09uTy9lV0pCZTJoMERZSlZ3UEFiTGRYYVAxUlJGSmxTQ3U3WGRyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=423362640827"
  },
  {
    id: "2025-12",
    title: "Sketch to... - Från penna till maskin!",
    date: "2025-12-18",
    summary: "En genomgång av Gemini och de funktioner som finns i verktyget. Vi hade fokus på Gems och hur det kan hjälpa oss i det dagliga arbetet.",
    tools: ["OpenArt", "Higgsfield", "Sora", "Gemini", "ElevenLabs"],
    takeaways: [
      "Sketch to segmentet av generativ AI börjar växa och ger en lekfullhet och tillgänglighet till AI modellerna.",
      "Sketch to image, och Sketch to video med hjälp av videoagenter som Sora",
      "Videogenerering generellt börjar bli stort men det är en väg kvar att gå!",
      "Vi börjar komma till en punkt där kreatörer kan bli en one-man-army med olika AI agenter.",
      "Problem med videogenerering: Dyrt, Korta videos,"
    ],
    tags: ["Generativ AI", "Videogenerering", "Sketch to..."],
    link: "",
    miro: "https://miro.com/welcomeonboard/RGhEaVBOY1REQWJOOHROamhIU0RyUEhKRElmUGpNdXB1REM1dTlYU1VVSUdZVXRTMUJqaDRJUWxDd1N6Qkg0NTFSdWsrUXlGdFQ5RjN5OGUrWFlHWWpxR2g1R09uTy9lV0pCZTJoMERZSldIdFdlRFRpWHRIQWJnMUVQNkxhTkx0R2lncW1vRmFBVnlLcVJzTmdFdlNRPT0hdjE=?share_link_id=131567311735"
  },
  {
    id: "2025-11",
    title: "Gemini - Ett gem i AI världen!",
    date: "2025-11-27",
    summary: "En genomgång av Gemini och de funktioner som finns i verktyget. Vi hade fokus på Gems och hur det kan hjälpa oss i det dagliga arbetet.",
    tools: ["Gemini"],
    takeaways: [
      "Gemini är Googles LLM. Kan användas för text, bilder och film.",
      "Google har fullt ansvar för säkerheten så det är säkert att ladda upp dokument.",
      "Gems är specificerade agenter som endast kan det vi säger till dem.",
      "Det finns många exempel på gems men det är viktigt att vi specificerar bredd, kunskap, förhållningssätt och att vi uppdaterar kontinuerligt.",
      "Utforska gems > Fyll i informationen > Testa och se om du behöver ändra någonting!"
    ],
    tags: ["Workflow", "Prompting", "Gemini"],
    link: "",
    miro: "https://miro.com/welcomeonboard/bUlpUXFBMTFINUVhbVE3WWtmSjB1MFhIbUJ3ZndndHU2QlArTkFEcWRGMmFqcit6TXJxQzVRZG12c0VoODBuY0VxNTJoT1BaWnNIeXBMUHRPWmxvZXpxR2g5R09uTy9lV0pCZTJoMERZSlc0Si9hcFRDS25sTnVlTzc0aFBCdlFBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=947349382104"
  }
];

export const allTags = [...new Set(meetings.flatMap(m => m.tags))].sort();
export const allYears = [...new Set(meetings.map(m => m.date.split('-')[0]))].sort((a, b) => Number(b) - Number(a));
export const totalCount = meetings.length;

export function hasLink(m: Meeting): boolean {
  return !!(m.miro && m.miro !== '') || !!(m.link && m.link !== '');
}

export function getDay(dateStr: string): string {
  return dateStr.split('-')[2];
}

export function getMonth(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('sv-SE', { month: 'short' }).replace('.', '');
}

export function getYear(dateStr: string): string {
  return dateStr.split('-')[0];
}
