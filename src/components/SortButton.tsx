'use client';
import { ArrowDown } from 'lucide-react';

interface SortButtonProps {
  sortAsc: boolean;
  onToggle: () => void;
}

export function SortButton({ sortAsc, onToggle }: SortButtonProps) {
  const label = sortAsc ? 'Äldst först' : 'Nyast först';
  return (
    <button
      onClick={onToggle}
      aria-label={`Sortering: ${label}. Klicka för att byta.`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--bg-3)',
        border: '1px solid var(--stroke-1)',
        borderRadius: 6,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--fg-2)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        transition: 'all var(--dur-fast) var(--ease-standard)',
        minHeight: 44,
      }}
    >
      {label}
      <ArrowDown
        size={14}
        aria-hidden="true"
        style={{
          transition: 'transform var(--dur-base) var(--ease-standard)',
          transform: sortAsc ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </button>
  );
}
