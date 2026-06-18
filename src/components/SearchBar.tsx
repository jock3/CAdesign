'use client';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount: number;
  totalCount: number;
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <label htmlFor="search-input" className="sr-only">Sök träffar</label>
      <div
        className="glass"
        style={{
          position: 'relative', flex: 1, minWidth: 240,
          borderRadius: 14, display: 'flex', alignItems: 'center',
        }}
      >
        <Search
          size={17}
          aria-hidden="true"
          style={{ position: 'absolute', left: 16, color: 'var(--fg-3)', pointerEvents: 'none' }}
        />
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Sök träff, ämne, verktyg…"
          autoComplete="off"
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            padding: '14px 16px 14px 44px', color: 'var(--fg-1)',
            fontFamily: 'inherit', fontSize: 15,
          }}
        />
      </div>
      <span
        className="eyebrow"
        style={{ whiteSpace: 'nowrap' }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="grad-text" style={{ fontWeight: 600 }}>{resultCount}</span> / {totalCount} träffar
      </span>
    </div>
  );
}
