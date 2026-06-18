'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LazyMotion, domAnimation, AnimatePresence, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import dynamic from 'next/dynamic';
import { Braces } from 'lucide-react';
import Fuse from 'fuse.js';
import { meetings, allTags, allYears, totalCount, Meeting } from '@/data/meetings';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { SortButton } from './SortButton';
import { MeetingCard } from './MeetingCard';
import { MeetingModal } from './MeetingModal';
import { SchemaPanel } from './SchemaPanel';
import { useReducedMotion } from '@/lib/useReducedMotion';

const DottedBackground = dynamic(() => import('./DottedBackground').then(mod => mod.DottedBackground), { ssr: false });
const LiquidBlobs = dynamic(() => import('./LiquidBlobs').then(mod => mod.LiquidBlobs), { ssr: false });
const LiquidMetalArt = dynamic(() => import('./LiquidMetalArt').then(mod => mod.LiquidMetalArt), {
  ssr: false,
  loading: () => <div className="hero-art glass" style={{ borderRadius: 24 }} aria-hidden="true" />,
});
const LiquidMetalButton = dynamic(() => import('./LiquidMetalButton').then(mod => mod.LiquidMetalButton), {
  ssr: false,
  loading: () => <div className="glass" style={{ height: 54, width: 190, borderRadius: 999 }} aria-hidden="true" />,
});

const PAGE_SIZE = 6;
const fuse = new Fuse(meetings, { keys: ['title', 'summary', 'tags', 'tools', 'takeaways'], threshold: 0.35 });

export function ArchiveClient() {
  const [search, setSearch] = useState('');
  const [currentTag, setCurrentTag] = useState('all');
  const [currentYear, setCurrentYear] = useState('all');
  const [sortAsc, setSortAsc] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const reduced = useReducedMotion();
  const router = useRouter();

  const filtered = useMemo(() => {
    let results: Meeting[] = search.trim() ? fuse.search(search).map(r => r.item) : [...meetings];
    if (currentTag !== 'all') results = results.filter(x => x.tags.includes(currentTag));
    if (currentYear !== 'all') results = results.filter(x => x.date.startsWith(currentYear));
    results.sort((a, b) => {
      const diff = new Date(a.date + 'T12:00:00').getTime() - new Date(b.date + 'T12:00:00').getTime();
      return sortAsc ? diff : -diff;
    });
    return results;
  }, [search, currentTag, currentYear, sortAsc]);

  const reset = (fn: () => void) => { fn(); setVisibleCount(PAGE_SIZE); };
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;
  const openMeeting = openId ? meetings.find(x => x.id === openId) ?? null : null;

  return (
    <>
      <DottedBackground />
      <LiquidBlobs />
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          {/* ---------- HERO ---------- */}
          <header className="wrap" style={{ paddingTop: 'clamp(2rem, 6vh, 4rem)', paddingBottom: 'clamp(2rem, 5vh, 3rem)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 'clamp(2rem, 6vh, 3.5rem)' }}>
              <span className="eyebrow">CA Design · Community</span>
              <button type="button" onClick={() => setSchemaOpen(v => !v)} aria-expanded={schemaOpen} aria-controls="schema-panel" className="chip">
                <Braces size={13} aria-hidden="true" /> JSON-schema
              </button>
            </div>

            <div className="hero-grid">
              <div>
                <m.h1
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0.001 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', fontWeight: 700,
                    lineHeight: 1.0, letterSpacing: '-0.04em', color: 'var(--fg-1)',
                  }}
                >
                  Månadsträff för<br /><span className="grad-text">AI in design</span>
                </m.h1>

                <m.p
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0.001 : 0.6, delay: reduced ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{ marginTop: 22, maxWidth: 520, fontSize: 'clamp(1rem, 1.6vw, 1.1rem)', color: 'var(--fg-2)', lineHeight: 1.65 }}
                >
                  Ett levande arkiv över våra träffar — verktygen vi testat, demos vi sett och
                  insikterna vi tagit med oss från communityt som utforskar AI i design.
                </m.p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
                  <LiquidMetalButton label="Resources" onClick={() => router.push('/resources')} animate={false} />
                  <div className="glass" style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '12px 20px', borderRadius: 14 }}>
                    <span className="grad-text" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
                      {String(totalCount).padStart(2, '0')}
                    </span>
                    <span className="eyebrow">träffar i arkivet</span>
                  </div>
                </div>
              </div>

              <LiquidMetalArt />
            </div>

            <div id="schema-panel"><SchemaPanel isOpen={schemaOpen} /></div>
          </header>

          {/* ---------- CONTROLS ---------- */}
          <section className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: '2.25rem' }}>
            <SearchBar value={search} onChange={v => reset(() => setSearch(v))} resultCount={filtered.length} totalCount={totalCount} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
              <FilterBar
                allTags={allTags} currentTag={currentTag} onTagChange={t => reset(() => setCurrentTag(t))}
                allYears={allYears} currentYear={currentYear} onYearChange={y => reset(() => setCurrentYear(y))}
              />
              <SortButton sortAsc={sortAsc} onToggle={() => reset(() => setSortAsc(v => !v))} />
            </div>
          </section>

          {/* ---------- GRID ---------- */}
          <main className="wrap" id="archive-grid" style={{ paddingBottom: '4rem', scrollMarginTop: 24 }}>
            {filtered.length === 0 ? (
              <div className="glass" role="status" aria-live="polite" style={{ borderRadius: 20, padding: '3.5rem 2rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--fg-1)' }}>
                  Inga träffar hittades
                </p>
                <p style={{ marginTop: 8, fontSize: 14, color: 'var(--fg-3)' }}>Prova ett annat ord eller rensa filtren.</p>
                <button type="button" onClick={() => reset(() => { setSearch(''); setCurrentTag('all'); setCurrentYear('all'); })} className="btn" style={{ marginTop: 22 }}>
                  Rensa allt
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
                <AnimatePresence mode="popLayout">
                  {visible.map((meeting, i) => (
                    <m.div
                      key={meeting.id}
                      layout
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                      transition={{ duration: reduced ? 0.001 : 0.4, delay: reduced ? 0 : Math.min(i, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%' }}
                    >
                      <MeetingCard meeting={meeting} onOpen={() => setOpenId(meeting.id)} />
                    </m.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {remaining > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 36 }}>
                <button type="button" onClick={() => setVisibleCount(v => v + PAGE_SIZE)} className="btn">Ladda fler träffar</button>
                <span className="eyebrow">{remaining} till</span>
              </div>
            )}
          </main>

          {/* ---------- FOOTER ---------- */}
          <footer style={{ borderTop: '1px solid var(--glass-border)', marginTop: '2rem' }}>
            <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '2rem clamp(1rem,4vw,2rem)' }}>
              <span className="eyebrow">CA Design © 2026</span>
              <span className="eyebrow">Månadsträff för designers</span>
            </div>
          </footer>

          {/* ---------- MODAL ---------- */}
          <AnimatePresence>
            {openMeeting && <MeetingModal meeting={openMeeting} onClose={() => setOpenId(null)} />}
          </AnimatePresence>
        </MotionConfig>
      </LazyMotion>
    </>
  );
}
