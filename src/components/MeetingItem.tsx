'use client';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Meeting, getDay, getMonth, getYear } from '@/data/meetings';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface MeetingItemProps {
  meeting: Meeting;
  isOpen: boolean;
  onToggle: () => void;
}

export function MeetingItem({ meeting, isOpen, onToggle }: MeetingItemProps) {
  const reduced = useReducedMotion();
  const hasMiro = !!(meeting.miro && meeting.miro !== '');
  const hasLink = !!(meeting.link && meeting.link !== '');

  return (
    <div style={{ borderBottom: '1px solid var(--stroke-1)' }}>
      {/* Header row */}
      <button
        id={`meeting-header-${meeting.id}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`meeting-detail-${meeting.id}`}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '1.75rem 0',
          display: 'grid',
          gridTemplateColumns: '4rem 1fr auto',
          gap: '1.5rem',
          alignItems: 'start',
          textAlign: 'left',
          transition: 'background var(--dur-fast) var(--ease-standard)',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        onFocus={e => (e.currentTarget.style.background = 'var(--bg-2)')}
        onBlur={e => (e.currentTarget.style.background = 'none')}
      >
        {/* Date block */}
        <div style={{ textAlign: 'center', paddingTop: 2 }}>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)',
            fontSize: '2rem',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--fg-1)',
            letterSpacing: '-0.02em',
          }}>
            {getDay(meeting.date)}
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--fg-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            display: 'block',
            marginTop: 4,
          }}>
            {getMonth(meeting.date)}
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--fg-3)',
            display: 'block',
            marginTop: 2,
            letterSpacing: '0.02em',
          }}>
            {getYear(meeting.date)}
          </span>
        </div>

        {/* Info block */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)',
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--fg-1)',
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}>
            {meeting.title}
          </h2>
          {!isOpen && (
            <p style={{
              fontSize: 14,
              color: 'var(--fg-2)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {meeting.summary}
            </p>
          )}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
            {meeting.tags.map(tag => (
              <span key={tag} style={{
                background: 'var(--tag-bg)',
                color: 'var(--tag-text)',
                borderRadius: 999,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={20}
          aria-hidden="true"
          style={{
            color: isOpen ? 'var(--accent)' : 'var(--fg-3)',
            transition: 'transform var(--dur-base) var(--ease-standard), color var(--dur-fast) var(--ease-standard)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
            marginTop: 1,
          }}
        />
      </button>

      {/* Expandable detail */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            key={`detail-${meeting.id}`}
            id={`meeting-detail-${meeting.id}`}
            role="region"
            aria-labelledby={`meeting-header-${meeting.id}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{
              duration: reduced ? 0.12 : 0.28,
              ease: [0.2, 0, 0, 1],
            }}
            style={{ overflow: 'hidden' }}
          >
            <m.div
              initial={reduced ? {} : { y: 6 }}
              animate={reduced ? {} : { y: 0 }}
              exit={reduced ? {} : { y: 6 }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
              style={{ padding: '0 0 2rem 5.5rem' }}
            >
              {/* Summary */}
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Sammanfattning
              </p>
              <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                {meeting.summary}
              </p>

              <hr style={{ border: 0, borderTop: '1px solid var(--stroke-1)', margin: '1.25rem 0' }} />

              {/* Tools */}
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Verktyg &amp; tekniker
              </p>
              <ul style={{ listStyle: 'none' }}>
                {meeting.tools.map(tool => (
                  <li key={tool} style={{
                    fontSize: 15,
                    color: 'var(--fg-1)',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--stroke-1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                    <span style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      flexShrink: 0,
                      display: 'inline-block',
                    }} aria-hidden="true" />
                    {tool}
                  </li>
                ))}
              </ul>

              <hr style={{ border: 0, borderTop: '1px solid var(--stroke-1)', margin: '1.25rem 0' }} />

              {/* Takeaways */}
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Viktiga insikter
              </p>
              <ul style={{ listStyle: 'none' }}>
                {meeting.takeaways.map((t, i) => (
                  <li key={i} style={{
                    fontSize: 15,
                    color: 'var(--fg-2)',
                    padding: '6px 0 6px 20px',
                    position: 'relative',
                    lineHeight: 1.5,
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }} aria-hidden="true">—</span>
                    {t}
                  </li>
                ))}
              </ul>

              <hr style={{ border: 0, borderTop: '1px solid var(--stroke-1)', margin: '1.25rem 0' }} />

              {/* Tags */}
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Taggar
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {meeting.tags.map(tag => (
                  <span key={tag} style={{
                    background: 'var(--tag-bg)',
                    color: 'var(--tag-text)',
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              {(hasMiro || hasLink) && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                  {hasMiro && (
                    <a
                      href={meeting.miro}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Öppna Miro-board, öppnas i ny flik"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--fg-1)',
                        textDecoration: 'none',
                        border: '1px solid rgba(107, 94, 0, 0.35)',
                        borderRadius: 6,
                        padding: '7px 16px',
                        background: 'rgba(107, 94, 0, 0.05)',
                        transition: 'background var(--dur-fast) var(--ease-standard)',
                      }}
                    >
                      <span style={{
                        width: 15,
                        height: 15,
                        background: '#FFD02F',
                        borderRadius: 3,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#000',
                        flexShrink: 0,
                      }} aria-hidden="true">M</span>
                      Öppna Miro-board
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {hasLink && (
                    <a
                      href={meeting.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Material från träffen, öppnas i ny flik"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        border: '1px solid var(--accent)',
                        borderRadius: 6,
                        padding: '7px 16px',
                        transition: 'background var(--dur-fast) var(--ease-standard)',
                      }}
                    >
                      Material från träffen
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
