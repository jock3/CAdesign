'use client';
import { useEffect, useRef } from 'react';
import * as m from 'motion/react-m';
import { X, ExternalLink } from 'lucide-react';
import { Meeting, getDay, getMonth, getYear } from '@/data/meetings';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface MeetingModalProps {
  meeting: Meeting;
  onClose: () => void;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 26 }}>
      <p className="eyebrow" style={{ marginBottom: 12 }}>{label}</p>
      {children}
    </div>
  );
}

export function MeetingModal({ meeting, onClose }: MeetingModalProps) {
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasMiro = !!(meeting.miro && meeting.miro !== '');
  const hasLink = !!(meeting.link && meeting.link !== '');
  const titleId = `modal-title-${meeting.id}`;

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (f.length === 0) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.001 : 0.2 }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(1rem, 5vh, 4rem) 1rem', overflowY: 'auto',
        background: 'rgba(4, 5, 12, 0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: reduced ? 0.001 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong"
        style={{ width: '100%', maxWidth: 680, borderRadius: 24, padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}
      >
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              {getDay(meeting.date)} {getMonth(meeting.date)} {getYear(meeting.date)}
            </p>
            <h2 id={titleId} style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700,
              lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--fg-1)',
            }}>
              {meeting.title}
            </h2>
          </div>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            aria-label="Stäng"
            className="chip"
            style={{ minHeight: 40, width: 40, padding: 0, justifyContent: 'center', flexShrink: 0 }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <Section label="Sammanfattning">
          <p style={{ fontSize: 15.5, color: 'var(--fg-2)', lineHeight: 1.7 }}>{meeting.summary}</p>
        </Section>

        <Section label="Verktyg & tekniker">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {meeting.tools.map(tool => (
              <span key={tool} className="glass" style={{
                padding: '6px 13px', borderRadius: 10, fontSize: 13.5, color: 'var(--fg-1)',
                fontFamily: 'var(--font-jetbrains), monospace',
              }}>
                {tool}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Viktiga insikter">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {meeting.takeaways.map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.6 }}>
                <span className="grad-text" aria-hidden="true" style={{
                  fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 600, flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Taggar">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {meeting.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </Section>

        {(hasMiro || hasLink) && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
            {hasMiro && (
              <a href={meeting.miro} target="_blank" rel="noopener noreferrer"
                 aria-label="Öppna Miro-board, öppnas i ny flik" className="btn">
                Öppna Miro-board <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
            {hasLink && (
              <a href={meeting.link} target="_blank" rel="noopener noreferrer"
                 aria-label="Material från träffen, öppnas i ny flik" className="btn btn-primary">
                Material från träffen <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </m.div>
    </m.div>
  );
}
