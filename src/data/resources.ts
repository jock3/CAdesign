export type ResourceTag = 'SKILL' | 'MCP' | 'LIB' | 'DOCS' | 'INSPO' | 'TOOL';

export interface Resource {
  name: string;
  tag: ResourceTag;
  description: string;
  url: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  blurb: string;
  items: Resource[];
}

/** What each tag means (shown as a legend). */
export const tagLegend: Record<ResourceTag, string> = {
  SKILL: 'Claude Code-skill — ändrar hur Claude bygger',
  MCP: 'MCP-server — Claude anropar den direkt',
  LIB: 'Kodbibliotek — be Claude koda mot det',
  DOCS: 'Riktlinjer att mata in som regel',
  INSPO: 'Inspiration — för dig, inte för Claude',
  TOOL: 'GUI-verktyg du jobbar i',
};

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'components',
    title: 'Komponentbibliotek',
    blurb: 'React/Tailwind-komponenter att kopiera in eller installera via shadcn.',
    items: [
      { name: 'shadcn/ui', tag: 'LIB', url: 'https://ui.shadcn.com', description: 'Tillgängliga copy-paste-komponenter på Radix + Tailwind. Grunden för modern React-UI.' },
      { name: '21st.dev', tag: 'LIB', url: 'https://21st.dev/community/components', description: 'Tusentals community-block — hero, pricing, shaders, knappar (som den här sidans liquid-metal-knapp).' },
      { name: 'Magic UI', tag: 'LIB', url: 'https://magicui.design', description: '150+ animerade React/Tailwind-komponenter. shadcn-registry-kompatibelt.' },
      { name: 'Aceternity UI', tag: 'LIB', url: 'https://ui.aceternity.com', description: 'Påkostade animerade komponenter (Motion). Copy-paste eller via shadcn.' },
      { name: 'React Bits', tag: 'LIB', url: 'https://reactbits.dev', description: 'Animerade React-komponenter och bakgrunder, copy-paste.' },
      { name: 'Cult UI', tag: 'LIB', url: 'https://www.cult-ui.com', description: 'Animerade shadcn-baserade komponenter med karaktär.' },
    ],
  },
  {
    id: 'motion',
    title: 'Animation & shaders',
    blurb: 'Bibliotek för rörelse, 3D och GPU-effekter — det som får sidor att kännas levande.',
    items: [
      { name: 'Motion (Framer Motion)', tag: 'LIB', url: 'https://motion.dev', description: 'Deklarativa animationer för React. Driver övergångarna på den här sidan.' },
      { name: 'GSAP', tag: 'LIB', url: 'https://gsap.com', description: 'Kraftfullaste animationsbiblioteket, numera helt gratis. Avancerad scroll/timeline.' },
      { name: 'Anime.js', tag: 'LIB', url: 'https://animejs.com', description: 'Lätt JS-animationsbibliotek — perfekt för micro-animations.' },
      { name: 'Paper Shaders', tag: 'LIB', url: 'https://paper.design', description: 'Liquid-metal och andra GPU-shaders som React-komponenter. Driver knapparna här.' },
      { name: 'Three.js', tag: 'LIB', url: 'https://threejs.org', description: 'WebGL-3D i webbläsaren — bas för scener, partiklar och shaders.' },
      { name: 'Lottie', tag: 'LIB', url: 'https://lottiefiles.com', description: 'Lätta vektoranimationer (JSON) från After Effects, för webb och mobil.' },
      { name: 'ShaderGradient', tag: 'LIB', url: 'https://shadergradient.co', description: 'Animerade gradient-/shader-bakgrunder (three.js) med npm-paket + plugin.' },
    ],
  },
  {
    id: 'color',
    title: 'Färg',
    blurb: 'Generera, testa och tillgänglighetssäkra paletter.',
    items: [
      { name: 'Coolors', tag: 'TOOL', url: 'https://coolors.co', description: 'Snabb palettgenerator med kontrastkoll och förhandsvisning på riktig UI.' },
      { name: 'Realtime Colors', tag: 'TOOL', url: 'https://www.realtimecolors.com', description: 'Testa palett + typografi live på en färdig landningssida innan du bestämmer dig.' },
      { name: 'Huemint', tag: 'TOOL', url: 'https://huemint.com', description: 'AI-genererade paletter för brand, webb och illustration.' },
      { name: 'Colormind', tag: 'TOOL', url: 'http://colormind.io', description: 'AI-palettgenerator som lär sig färgharmoni från foton och konst.' },
    ],
  },
  {
    id: 'type',
    title: 'Typografi',
    blurb: 'Typsnitt, par och skalor.',
    items: [
      { name: 'Google Fonts', tag: 'TOOL', url: 'https://fonts.google.com', description: 'Öppna webbtypsnitt, optimerade för prestanda (self-hostas via next/font).' },
      { name: 'Fontshare', tag: 'TOOL', url: 'https://www.fontshare.com', description: 'Gratis kvalitetstypsnitt med generösa licenser, av Indian Type Foundry.' },
      { name: 'Fontpair', tag: 'INSPO', url: 'https://www.fontpair.co', description: 'Kurerade typsnittspar — bra startpunkt för rubrik/brödtext.' },
      { name: 'Typescale', tag: 'TOOL', url: 'https://typescale.com', description: 'Bygg en modulär typografisk skala visuellt och kopiera CSS:en.' },
    ],
  },
  {
    id: 'assets',
    title: 'Ikoner & assets',
    blurb: 'Ikoner, loggor och illustrationer.',
    items: [
      { name: 'Lucide', tag: 'LIB', url: 'https://lucide.dev', description: 'Rent, konsekvent ikonset — finns redan i den här stacken.' },
      { name: 'Tabler Icons', tag: 'LIB', url: 'https://tabler.io/icons', description: 'Stort gratis outline-ikonset (5 000+).' },
      { name: 'Phosphor Icons', tag: 'LIB', url: 'https://phosphoricons.com', description: 'Flexibelt ikonset i sex vikter — thin till fill.' },
      { name: 'svgl.app', tag: 'LIB', url: 'https://svgl.app', description: 'Brand-/logo-SVG:er via API. Bra för "trusted by"-loggor.' },
      { name: 'unDraw', tag: 'TOOL', url: 'https://undraw.co', description: 'Öppna illustrationer som auto-färgas till din palett.' },
    ],
  },
  {
    id: 'inspo',
    title: 'Inspiration',
    blurb: 'Kurerade gallerier och riktiga produktflöden att referera mot.',
    items: [
      { name: 'Awwwards', tag: 'INSPO', url: 'https://www.awwwards.com', description: 'Prisbelönt, jurybedömd webbdesign på den vassaste nivån.' },
      { name: 'Godly', tag: 'INSPO', url: 'https://godly.website', description: 'High-end webbdesign med exceptionell animation och scroll-effekter.' },
      { name: 'SiteInspire', tag: 'INSPO', url: 'https://www.siteinspire.com', description: 'Handplockat galleri sedan 2010 — konsekvent hög kvalitet.' },
      { name: 'Dark', tag: 'INSPO', url: 'https://www.dark.design', description: 'Galleri kurerat helt kring mörka gränssnitt.' },
      { name: 'Minimal Gallery', tag: 'INSPO', url: 'https://minimal.gallery', description: 'Minimalistisk, ren webbdesign.' },
      { name: 'Land-book', tag: 'INSPO', url: 'https://land-book.com', description: 'Landningssidor taggade per affärsmodell — jämför värdeerbjudanden.' },
      { name: 'Mobbin', tag: 'INSPO', url: 'https://mobbin.com', description: 'Riktiga app-/webbskärmar och flöden. Go-to för UX-mönster.' },
      { name: 'Refero', tag: 'INSPO', url: 'https://refero.design', description: 'Sökbart bibliotek med riktiga app-/webb-UI:er (Mobbin-likt).' },
      { name: 'Unsection', tag: 'INSPO', url: 'https://www.unsection.com', description: '4 000+ kurerade webb-sektioner (hero, CTA, footer), filtrerbara på stil.' },
      { name: 'Design Spells', tag: 'INSPO', url: 'https://designspells.com', description: 'Små förtjusande UI-detaljer — mikrointeraktionerna som känns dyra.' },
      { name: 'Httpster', tag: 'INSPO', url: 'https://httpster.net', description: 'Rå, trendig webbdesign-inspiration utan filter.' },
      { name: 'Screens Design', tag: 'INSPO', url: 'https://screensdesign.com/library', description: 'App-skärmar och flöden som video från riktiga appar.' },
      { name: 'Page Flows', tag: 'INSPO', url: 'https://pageflows.com', description: 'Inspelade UX-flöden från riktiga produkter (onboarding, checkout m.m.).' },
    ],
  },
  {
    id: 'tools',
    title: 'Verktyg — rörelse, 3D & mockups',
    blurb: 'GUI-verktyg du bygger i; flera har runtimes så Claude kan embedda resultatet.',
    items: [
      { name: 'Spline', tag: 'TOOL', url: 'https://spline.design', description: '3D-designverktyg för webb; embedda scenen med react-spline.' },
      { name: 'Unicorn Studio', tag: 'TOOL', url: 'https://www.unicorn.studio', description: 'No-code interaktiva/animerade WebGL-visuals att embedda.' },
      { name: 'Jitter', tag: 'TOOL', url: 'https://jitter.video', description: 'Webbaserat motion design-verktyg för animerad grafik och video.' },
      { name: 'Haikei', tag: 'TOOL', url: 'https://haikei.app', description: 'Generera SVG-bakgrunder — vågor, blobs, mesh-gradients.' },
      { name: 'Shots', tag: 'TOOL', url: 'https://shots.so', description: 'Snygga device-mockups och ramar för screenshots.' },
      { name: 'Figcomponents', tag: 'TOOL', url: 'https://www.figcomponents.com', description: 'Gratis Figma-komponenter och UI-kits.' },
    ],
  },
  {
    id: 'ai',
    title: 'AI-verktyg',
    blurb: 'Generativa verktyg för bild och UI.',
    items: [
      { name: 'Figma', tag: 'TOOL', url: 'https://www.figma.com', description: 'Standarden för UI-design, nu med AI-utkast, auto-layout-förslag och sök.' },
      { name: 'Midjourney', tag: 'TOOL', url: 'https://www.midjourney.com', description: 'Guldstandard för AI-bildgenerering — moodboards, texturer, koncept.' },
      { name: 'Google Stitch', tag: 'TOOL', url: 'https://stitch.withgoogle.com', description: 'Genererar produktionsduglig UI för mobil/webb från text (f.d. Galileo AI).' },
      { name: 'Adobe Firefly', tag: 'TOOL', url: 'https://www.adobe.com/products/firefly.html', description: 'Kommersiellt säker generativ AI, integrerad i Photoshop, Illustrator m.fl.' },
    ],
  },
  {
    id: 'skills',
    title: 'AI-skills för Claude Code',
    blurb: 'Installeras i Claude Code och ändrar hur Claude bygger.',
    items: [
      { name: 'Taste Skill', tag: 'SKILL', url: 'https://www.tasteskill.dev', description: 'Ger AI-agenter "smak" och stoppar generiska frontends. 13 varianter. npx skills add Leonxlnx/taste-skill' },
      { name: 'UI UX Pro Max', tag: 'SKILL', url: 'https://ui-ux-pro-max-skill.nextlevelbuilder.io', description: 'Sökbar databas över UI-stilar, paletter, typsnittspar och UX-regler. Användes för den här designen.' },
      { name: 'boraoztunc/skills', tag: 'SKILL', url: 'https://github.com/boraoztunc/skills', description: 'Copywriting (Ogilvy, stop-slop), SEO och design-skills som slash-kommandon.' },
      { name: 'Anthropic Skills', tag: 'SKILL', url: 'https://github.com/anthropics/skills', description: 'Anthropics officiella skills — docx, pptx, pdf, xlsx m.fl.' },
      { name: 'shadcn Skills', tag: 'SKILL', url: 'https://ui.shadcn.com/docs/skills', description: 'shadcns egna skills, komplement till deras MCP.' },
    ],
  },
  {
    id: 'mcp',
    title: 'MCP-servrar',
    blurb: 'Servrar Claude Code kan anropa direkt under arbetet.',
    items: [
      { name: '21st.dev Magic', tag: 'MCP', url: 'https://21st.dev/magic', description: 'Generera och hämta UI-komponenter direkt i Claude Code med naturligt språk.' },
      { name: 'shadcn MCP', tag: 'MCP', url: 'https://ui.shadcn.com/docs/mcp', description: 'Bläddra, sök och installera shadcn-komponenter. npx shadcn@latest mcp init --client claude' },
      { name: 'Supabase MCP', tag: 'MCP', url: 'https://supabase.com/docs/guides/getting-started/mcp', description: 'Databas, migrationer och Edge Functions direkt från Claude.' },
      { name: 'GitHub MCP', tag: 'MCP', url: 'https://github.com/github/github-mcp-server', description: 'PRs, issues, actions och kod via Claude — driver deployen av den här sidan.' },
    ],
  },
  {
    id: 'docs',
    title: 'Riktlinjer & discovery',
    blurb: 'Regelverk att mata in i Claude, och kataloger för att hitta mer.',
    items: [
      { name: 'Vercel Web Interface Guidelines', tag: 'DOCS', url: 'https://vercel.com/design/guidelines', description: 'Konkreta regler för interaktion, layout, innehåll och tillgänglighet.' },
      { name: 'toools.design', tag: 'TOOL', url: 'https://www.toools.design', description: 'Stor kurerad katalog över design-resurser, verktyg och inspiration.' },
      { name: 'Toolfolio', tag: 'TOOL', url: 'https://toolfolio.io', description: 'Kurerad katalog + nyhetsbrev över design-/dev-/marketing-verktyg och deals.' },
    ],
  },
];

export const resourceTags: ResourceTag[] = ['SKILL', 'MCP', 'LIB', 'DOCS', 'INSPO', 'TOOL'];
export const resourceTotal = resourceCategories.reduce((n, c) => n + c.items.length, 0);
