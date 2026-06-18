'use client';
import { ArrowDownUp } from 'lucide-react';

interface SortButtonProps {
  sortAsc: boolean;
  onToggle: () => void;
}

export function SortButton({ sortAsc, onToggle }: SortButtonProps) {
  const label = sortAsc ? 'Äldst först' : 'Nyast först';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Sortering: ${label}. Klicka för att byta.`}
      className="chip"
    >
      <ArrowDownUp size={13} aria-hidden="true" />
      {label}
    </button>
  );
}
