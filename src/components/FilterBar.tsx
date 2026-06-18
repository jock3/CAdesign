'use client';

interface FilterBarProps {
  allTags: string[];
  currentTag: string;
  onTagChange: (tag: string) => void;
  allYears: string[];
  currentYear: string;
  onYearChange: (year: string) => void;
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={active ? 'chip chip-active' : 'chip'}
    >
      {label}
    </button>
  );
}

export function FilterBar({
  allTags, currentTag, onTagChange,
  allYears, currentYear, onYearChange,
}: FilterBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="eyebrow" style={{ marginRight: 4 }}>Ämne</span>
        <FilterChip label="Alla" active={currentTag === 'all'} onClick={() => onTagChange('all')} />
        {allTags.map(tag => (
          <FilterChip key={tag} label={tag} active={currentTag === tag} onClick={() => onTagChange(tag)} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="eyebrow" style={{ marginRight: 4 }}>År</span>
        <FilterChip label="Alla" active={currentYear === 'all'} onClick={() => onYearChange('all')} />
        {allYears.map(year => (
          <FilterChip key={year} label={year} active={currentYear === year} onClick={() => onYearChange(year)} />
        ))}
      </div>
    </div>
  );
}
