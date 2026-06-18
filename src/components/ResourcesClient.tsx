'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { resourceCategories, resourceTags, resourceTotal, ResourceTag } from '@/data/resources';
import { useReducedMotion } from '@/lib/useReducedMotion';

const DottedBackground = dynamic(() => import('./DottedBackground').then(mod => mod.DottedBackground), { ssr: false });
const LiquidBlobs = dynamic(() => import('./LiquidBlobs').then(mod => mod.LiquidBlobs), { ssr: false });

function host(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function ResourceCard({ name, tag, description, url }: { name: string; tag: ResourceTag; description: string; url: string }) {
  return (
    <a
      className="card"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} — öppnas i ny flik`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span className="tag">{tag}</span>
        <span className="grad-text" aria-hidden="true" style={{ display: 'inline-flex' }}><ArrowUpRight size={18} /></span>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg-1)', marginBottom: 8,
      }}>
        {name}
      </h3>
      <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 16 }}>{description}</p>
      <span className="eyebrow" style={{ marginTop: 'auto' }}>{host(url)}</span>
    </a>
  );
}

export function ResourcesClient() {
  const reduced = useReducedMotion();
  const [tag, setTag] = useState<'all' | ResourceTag>('all');

  const sections = useMemo(() => {
    if (tag === 'all') return resourceCategories;
    return resourceCategories
      .map(c => ({ ...c, items: c.items.filter(i => i.tag === tag) }))
      .filter(c => c.items.length > 0);
  }, [tag]);

  const shown = useMemo(() => sections.reduce((n, c) => n + c.items.length, 0), [sections]);

  return (
    <>
      <DottedBackground />
      <LiquidBlobs />
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          {/* HERO */}
          <header className="wrap" style={{ paddingTop: 'clamp(2rem, 6vh, 3.5rem)', paddingBottom: 'clamp(1.5rem, 4vh, 2.5rem)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 'clamp(2rem, 6vh, 3.5rem)' }}>
              <Link href="/" className="chip" style={{ textDecoration: 'none' }}>
                <ArrowLeft size={13} aria-hidden="true" /> Arkiv
              </Link>
              <span className="eyebrow">CA Design · Resurser</span>
            </div>

            <m.h1
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.001 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', fontWeight: 700,
                lineHeight: 1.0, letterSpacing: '-0.04em', color: 'var(--fg-1)',
              }}
            >
              <span className="grad-text">Resurser</span> för<br />AI-design
            </m.h1>

            <p style={{ marginTop: 22, maxWidth: 560, fontSize: 'clamp(1rem, 1.6vw, 1.1rem)', color: 'var(--fg-2)', lineHeight: 1.65 }}>
              En kurerad samling verktyg, bibliotek, skills och inspiration som communityt
              lutar sig mot — från komponenter och shaders till färg, typografi och AI.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 26, flexWrap: 'wrap' }}>
              <div className="glass" style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '11px 18px', borderRadius: 14 }}>
                <span className="grad-text" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                  {resourceTotal}
                </span>
                <span className="eyebrow">resurser</span>
              </div>
              <span className="eyebrow" style={{ color: 'var(--fg-3)', maxWidth: 360, lineHeight: 1.5, letterSpacing: '0.1em' }}>
                SKILL · MCP · LIB · DOCS = Claude kan använda &nbsp;·&nbsp; INSPO · TOOL = för dig
              </span>
            </div>
          </header>

          {/* FILTER */}
          <section className="wrap" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="eyebrow" style={{ marginRight: 4 }}>Filtrera</span>
              <button type="button" className={tag === 'all' ? 'chip chip-active' : 'chip'} aria-pressed={tag === 'all'} onClick={() => setTag('all')}>
                Alla
              </button>
              {resourceTags.map(t => (
                <button key={t} type="button" className={tag === t ? 'chip chip-active' : 'chip'} aria-pressed={tag === t} onClick={() => setTag(t)}>
                  {t}
                </button>
              ))}
              <span className="eyebrow" aria-live="polite" style={{ marginLeft: 4 }}>{shown} st</span>
            </div>
          </section>

          {/* CATEGORIES */}
          <main className="wrap" style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: 'clamp(2.5rem, 6vh, 4rem)' }}>
            {sections.map(cat => (
              <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
                <div style={{ marginBottom: 18, maxWidth: 640 }}>
                  <h2 id={`cat-${cat.id}`} style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 600,
                    letterSpacing: '-0.02em', color: 'var(--fg-1)',
                  }}>
                    {cat.title}
                  </h2>
                  <p style={{ marginTop: 6, fontSize: 14, color: 'var(--fg-3)', lineHeight: 1.55 }}>{cat.blurb}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {cat.items.map(item => (
                    <ResourceCard key={item.name} {...item} />
                  ))}
                </div>
              </section>
            ))}
          </main>

          {/* FOOTER */}
          <footer style={{ borderTop: '1px solid var(--glass-border)', marginTop: '1rem' }}>
            <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '2rem clamp(1rem,4vw,2rem)' }}>
              <Link href="/" className="eyebrow" style={{ textDecoration: 'none' }}>← Tillbaka till arkivet</Link>
              <span className="eyebrow">CA Design © 2026</span>
            </div>
          </footer>
        </MotionConfig>
      </LazyMotion>
    </>
  );
}
