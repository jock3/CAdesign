'use client';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface SchemaPanelProps {
  isOpen: boolean;
}

export function SchemaPanel({ isOpen }: SchemaPanelProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="schema-panel"
          initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.28, ease: [0.2, 0, 0, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div
            role="region"
            aria-label="JSON-schema för ny träff"
            style={{
              borderTop: '1px solid var(--stroke-1)',
              padding: '2.5rem 0 3rem',
              background: 'var(--bg-2)',
              marginTop: '2rem',
            }}
          >
            <div className="archive-container">
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--fg-3)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                JSON-schema — så här lägger du till en ny träff
              </p>
              <pre
                style={{
                  fontFamily: 'ui-monospace, SF Mono, Menlo, Consolas, monospace',
                  fontSize: 12,
                  color: 'var(--fg-2)',
                  background: 'var(--bg-3)',
                  border: '1px solid var(--stroke-1)',
                  borderRadius: 6,
                  padding: '1.5rem',
                  overflowX: 'auto',
                  lineHeight: 1.8,
                }}
              >
                {'{'}{'\n'}
                {'  '}<span className="syntax-key">&quot;id&quot;</span>{': '}<span className="syntax-str">&quot;2025-01&quot;</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;title&quot;</span>{': '}<span className="syntax-str">&quot;Titel på träffen&quot;</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;date&quot;</span>{': '}<span className="syntax-str">&quot;2025-01-14&quot;</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;summary&quot;</span>{': '}<span className="syntax-str">&quot;Kort beskrivning av vad som togs upp.&quot;</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;tools&quot;</span>{': '}<span className="syntax-arr">{'['}</span><span className="syntax-str">&quot;Midjourney&quot;</span>{', '}<span className="syntax-str">&quot;ChatGPT&quot;</span><span className="syntax-arr">{']'}</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;takeaways&quot;</span>{': '}<span className="syntax-arr">{'['}</span>{'\n'}
                {'    '}<span className="syntax-str">&quot;Insikt nummer ett&quot;</span>{',\n'}
                {'    '}<span className="syntax-str">&quot;Insikt nummer två&quot;</span>{'\n'}
                {'  '}<span className="syntax-arr">{']'}</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;tags&quot;</span>{': '}<span className="syntax-arr">{'['}</span><span className="syntax-str">&quot;bildgenerering&quot;</span>{', '}<span className="syntax-str">&quot;prompting&quot;</span><span className="syntax-arr">{']'}</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;link&quot;</span>{': '}<span className="syntax-str">&quot;https://länk-till-material.se&quot;</span>{',\n'}
                {'  '}<span className="syntax-key">&quot;miro&quot;</span>{': '}<span className="syntax-str">&quot;https://miro.com/app/board/ditt-board-id&quot;</span>{'\n'}
                {'}'}
              </pre>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
