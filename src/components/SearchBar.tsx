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
    <div style={{
      borderBottom: '1px solid var(--stroke-1)',
      padding: '1.25rem 0',
      background: 'var(--bg-2)',
    }}>
      <div className="archive-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label htmlFor="search-input" className="sr-only">Sök träffar</label>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--fg-3)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="search-input"
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Sök träff, ämne, verktyg…"
            autoComplete="off"
            style={{
              width: '100%',
              background: 'var(--bg-3)',
              border: '1px solid var(--stroke-1)',
              borderRadius: 6,
              padding: '10px 14px 10px 40px',
              color: 'var(--fg-1)',
              fontFamily: 'inherit',
              fontSize: 15,
              transition: 'border-color var(--dur-fast) var(--ease-standard)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--fg-2)')}
            onBlur={e => (e.target.style.borderColor = 'var(--stroke-1)')}
          />
        </div>
        <span
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}
          aria-live="polite"
          aria-atomic="true"
        >
          <strong style={{ color: 'var(--accent)' }}>{resultCount}</strong> av {totalCount} träffar
        </span>
      </div>
    </div>
  );
}
