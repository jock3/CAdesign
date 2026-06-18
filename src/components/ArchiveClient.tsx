'use client';
import { useState, useMemo } from 'react';
import { LazyMotion, domAnimation, AnimatePresence, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import dynamic from 'next/dynamic';
import Fuse from 'fuse.js';
import { meetings, allTags, allYears, totalCount, Meeting } from '@/data/meetings';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { SortButton } from './SortButton';
import { MeetingItem } from './MeetingItem';
import { SchemaPanel } from './SchemaPanel';
import { ThemeToggle } from './ThemeToggle';
import { useReducedMotion } from '@/lib/useReducedMotion';

const DottedBackground = dynamic(
  () => import('./DottedBackground').then(mod => mod.DottedBackground),
  { ssr: false }
);

const LiquidBlobs = dynamic(
  () => import('./LiquidBlobs').then(mod => mod.LiquidBlobs),
  { ssr: false }
);

const PAGE_SIZE = 5;

const fuse = new Fuse(meetings, {
  keys: ['title', 'summary', 'tags', 'tools', 'takeaways'],
  threshold: 0.35,
  includeScore: true,
});

export function ArchiveClient() {
  const [search, setSearch] = useState('');
  const [currentTag, setCurrentTag] = useState('all');
  const [currentYear, setCurrentYear] = useState('all');
  const [sortAsc, setSortAsc] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    let results: Meeting[] = search.trim()
      ? fuse.search(search).map(r => r.item)
      : [...meetings];
    if (currentTag !== 'all') results = results.filter(meet => meet.tags.includes(currentTag));
    if (currentYear !== 'all') results = results.filter(meet => meet.date.startsWith(currentYear));
    results.sort((a, b) => {
      const diff = new Date(a.date + 'T12:00:00').getTime() - new Date(b.date + 'T12:00:00').getTime();
      return sortAsc ? diff : -diff;
    });
    return results;
  }, [search, currentTag, currentYear, sortAsc]);

  function handleTagChange(tag: string) { setCurrentTag(tag); setVisibleCount(PAGE_SIZE); }
  function handleYearChange(year: string) { setCurrentYear(year); setVisibleCount(PAGE_SIZE); }
  function handleSearchChange(val: string) { setSearch(val); setVisibleCount(PAGE_SIZE); }
  function handleSortToggle() { setSortAsc(v => !v); setVisibleCount(PAGE_SIZE); }
  function handleToggle(id: string) { setOpenId(prev => prev === id ? null : id); }

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  return (
    <>
      <DottedBackground />
      <LiquidBlobs />
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Header */}
        <header style={{ borderBottom: '1px solid var(--stroke-1)', padding: '3rem 0 2.25rem' }}>
          <div className="archive-container" style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              }}>
                [CA Design] —{' '}
                <button
                  onClick={() => setSchemaOpen(v => !v)}
                  aria-expanded={schemaOpen}
                  aria-controls="schema-panel"
                  style={{
                    fontFamily: 'var(--font-caveat, Caveat, cursive)',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '1.15em',
                    color: 'var(--accent)',
                    letterSpacing: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                    textDecorationColor: 'transparent',
                    textUnderlineOffset: '0.15em',
                    transition: 'text-decoration-color var(--dur-fast) var(--ease-standard)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.textDecorationColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
                  onFocus={e => (e.currentTarget.style.textDecorationColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
                >
                  AI in design
                </button>
              </h1>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--fg-3)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: '0.5rem',
              }}>
                Månadsträff för designers — arkiv
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
              <ThemeToggle />
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--fg-3)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}>
                  Antal träffar
                </span>
                <strong style={{
                  fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  display: 'block',
                  lineHeight: 1.05,
                  marginTop: 4,
                }}>
                  {totalCount}
                </strong>
              </div>
            </div>
          </div>
        </header>

        {/* Search bar */}
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          resultCount={filtered.length}
          totalCount={totalCount}
        />

        {/* Sticky control bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <FilterBar
            allTags={allTags}
            currentTag={currentTag}
            onTagChange={handleTagChange}
            allYears={allYears}
            currentYear={currentYear}
            onYearChange={handleYearChange}
          />
          <div style={{
            borderBottom: '1px solid var(--stroke-1)',
            padding: '0.875rem 0',
            background: 'var(--bg-2)',
          }}>
            <div className="archive-container" style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <SortButton sortAsc={sortAsc} onToggle={handleSortToggle} />
            </div>
          </div>
        </div>

        {/* Meeting list */}
        <main>
          <div className="archive-container">
            {filtered.length === 0 ? (
              <div
                style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--fg-3)', fontSize: 15 }}
                aria-live="polite"
                aria-atomic="true"
              >
                <p>Inga träffar hittades för din sökning.</p>
                <p style={{ marginTop: 8, fontSize: 13 }}>Prova ett annat ord eller rensa filtren.</p>
                <button
                  onClick={() => { setSearch(''); setCurrentTag('all'); setCurrentYear('all'); setVisibleCount(PAGE_SIZE); }}
                  style={{
                    marginTop: 16,
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  Rensa allt
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {visible.map((meeting, index) => (
                  <m.div
                    key={meeting.id}
                    layout
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{
                      duration: reduced ? 0.12 : 0.3,
                      delay: reduced ? 0 : Math.min(index, 4) * 0.05,
                      ease: [0.2, 0, 0, 1],
                    }}
                  >
                    <MeetingItem
                      meeting={meeting}
                      isOpen={openId === meeting.id}
                      onToggle={() => handleToggle(meeting.id)}
                    />
                  </m.div>
                ))}
              </AnimatePresence>
            )}

            {remaining > 0 && (
              <div style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--stroke-1)' }}>
                <button
                  onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                  style={{
                    background: 'var(--bg-3)',
                    border: '1px solid var(--stroke-1)',
                    borderRadius: 6,
                    padding: '10px 28px',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--fg-2)',
                    cursor: 'pointer',
                    transition: 'all var(--dur-fast) var(--ease-standard)',
                  }}
                >
                  Ladda fler
                </button>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>
                  {remaining} till
                </span>
              </div>
            )}
          </div>
        </main>

        {/* Schema panel */}
        <div id="schema-panel">
          <SchemaPanel isOpen={schemaOpen} />
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--stroke-1)',
          padding: '2rem 0',
          marginTop: '2rem',
          background: 'var(--bg-2)',
        }}>
          <div className="archive-container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
              CA Design © 2026
            </span>
            <span style={{
              fontFamily: 'var(--font-caveat, Caveat, cursive)',
              fontSize: 16,
              color: 'var(--fg-3)',
            }}>
              Månadsträff för designers
            </span>
          </div>
        </footer>
      </MotionConfig>
    </LazyMotion>
    </>
  );
}
