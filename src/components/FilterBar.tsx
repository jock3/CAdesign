'use client';

interface FilterBarProps {
  allTags: string[];
  currentTag: string;
  onTagChange: (tag: string) => void;
  allYears: string[];
  currentYear: string;
  onYearChange: (year: string) => void;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={active ? 'filter-chip-active' : undefined}
      style={{
        background: active ? 'var(--accent)' : 'var(--bg-3)',
        border: '1px solid',
        borderColor: active ? 'var(--accent)' : 'var(--stroke-1)',
        borderRadius: 999,
        padding: '4px 14px',
        fontSize: 12,
        fontWeight: 500,
        color: active ? '#F4F1EC' : 'var(--fg-2)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all var(--dur-fast) var(--ease-standard)',
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {label}
    </button>
  );
}

export function FilterBar({
  allTags,
  currentTag,
  onTagChange,
  allYears,
  currentYear,
  onYearChange,
}: FilterBarProps) {
  return (
    <>
      {/* Tag filters */}
      <div style={{
        borderBottom: '1px solid var(--stroke-1)',
        padding: '0.875rem 0',
        background: 'var(--bg-2)',
      }}>
        <div className="archive-container" style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--fg-3)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginRight: 4,
          }}>
            Filtrera:
          </span>
          <FilterChip
            label="Alla"
            active={currentTag === 'all'}
            onClick={() => onTagChange('all')}
          />
          {allTags.map(tag => (
            <FilterChip
              key={tag}
              label={tag}
              active={currentTag === tag}
              onClick={() => onTagChange(tag)}
            />
          ))}
        </div>
      </div>

      {/* Year filters */}
      <div style={{
        borderBottom: '1px solid var(--stroke-1)',
        padding: '0.875rem 0',
        background: 'var(--bg-2)',
      }}>
        <div className="archive-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--fg-3)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginRight: 4,
            }}>
              År:
            </span>
            <FilterChip
              label="Alla"
              active={currentYear === 'all'}
              onClick={() => onYearChange('all')}
            />
            {allYears.map(year => (
              <FilterChip
                key={year}
                label={year}
                active={currentYear === year}
                onClick={() => onYearChange(year)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
