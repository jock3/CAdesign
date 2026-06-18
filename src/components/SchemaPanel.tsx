'use client';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface SchemaPanelProps {
  isOpen: boolean;
}

const K = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: 'var(--a-indigo)' }}>{children}</span>
);
const S = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: 'var(--a-cyan)' }}>{children}</span>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: 'var(--fg-3)' }}>{children}</span>
);

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
          transition={{ duration: reduced ? 0.001 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div
            role="region"
            aria-label="JSON-schema för ny träff"
            className="glass"
            style={{ borderRadius: 18, padding: 'clamp(1.25rem, 3vw, 1.75rem)', marginTop: 20 }}
          >
            <p className="eyebrow" style={{ marginBottom: 14 }}>
              JSON-schema — så här lägger du till en ny träff
            </p>
            <pre style={{
              fontFamily: 'var(--font-jetbrains), ui-monospace, monospace',
              fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.85,
              overflowX: 'auto', whiteSpace: 'pre',
            }}>
{'{'}{'\n'}
{'  '}<K>&quot;id&quot;</K><P>: </P><S>&quot;2025-01&quot;</S><P>,</P>{'\n'}
{'  '}<K>&quot;title&quot;</K><P>: </P><S>&quot;Titel på träffen&quot;</S><P>,</P>{'\n'}
{'  '}<K>&quot;date&quot;</K><P>: </P><S>&quot;2025-01-14&quot;</S><P>,</P>{'\n'}
{'  '}<K>&quot;summary&quot;</K><P>: </P><S>&quot;Kort beskrivning…&quot;</S><P>,</P>{'\n'}
{'  '}<K>&quot;tools&quot;</K><P>: [</P><S>&quot;Midjourney&quot;</S><P>, </P><S>&quot;ChatGPT&quot;</S><P>],</P>{'\n'}
{'  '}<K>&quot;takeaways&quot;</K><P>: [</P><S>&quot;Insikt ett&quot;</S><P>, </P><S>&quot;Insikt två&quot;</S><P>],</P>{'\n'}
{'  '}<K>&quot;tags&quot;</K><P>: [</P><S>&quot;bildgenerering&quot;</S><P>],</P>{'\n'}
{'  '}<K>&quot;link&quot;</K><P>: </P><S>&quot;https://…&quot;</S><P>,</P>{'\n'}
{'  '}<K>&quot;miro&quot;</K><P>: </P><S>&quot;https://miro.com/…&quot;</S>{'\n'}
{'}'}
            </pre>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
