'use client';
import { ArrowUpRight } from 'lucide-react';
import { Meeting, getDay, getMonth, getYear } from '@/data/meetings';

interface MeetingCardProps {
  meeting: Meeting;
  onOpen: () => void;
}

export function MeetingCard({ meeting, onOpen }: MeetingCardProps) {
  const toolCount = meeting.tools.length;
  return (
    <button type="button" onClick={onOpen} className="card" aria-haspopup="dialog" style={{ textAlign: 'left' }}>
      {/* date + arrow row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: 34, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--fg-1)',
          }}>
            {getDay(meeting.date)}
          </span>
          <span className="eyebrow" style={{ color: 'var(--fg-2)' }}>
            {getMonth(meeting.date)} {getYear(meeting.date)}
          </span>
        </div>
        <span className="grad-text" aria-hidden="true" style={{ display: 'inline-flex' }}>
          <ArrowUpRight size={20} />
        </span>
      </div>

      {/* title */}
      <h3 style={{
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        fontSize: 20, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em',
        color: 'var(--fg-1)', marginBottom: 10,
      }}>
        {meeting.title}
      </h3>

      {/* summary */}
      <p style={{
        fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 18,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {meeting.summary}
      </p>

      {/* tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto', marginBottom: 14 }}>
        {meeting.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>

      {/* footer meta */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 14, borderTop: '1px solid var(--glass-border)',
      }}>
        <span className="eyebrow">{toolCount} verktyg</span>
        <span className="eyebrow" style={{ color: 'var(--accent)' }}>Visa mer →</span>
      </div>
    </button>
  );
}
