# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] — 2026-06-17

### Redesign & Re-platform
- Full re-platform from single-file HTML to Next.js 15 + React 19 + TypeScript + Tailwind v4
- Animated dotted-surface background (CSS radial-gradient, diagonal drift, pointer spotlight)
- Liquid blob ambient animation layer (Framer Motion, theme-aware glow)
- Sticky control bar on desktop with fuzzy search (Fuse.js), tag/year filters, sort toggle
- Accordion meeting list with AnimatePresence open/close transitions
- WCAG 2.2 AA compliant — global :focus-visible, corrected contrast tokens, reduced-motion support
- Self-hosted fonts via next/font (Montserrat + Caveat), eliminating render-blocking Google Fonts
- Static export (output: 'export') for Vercel CDN delivery
