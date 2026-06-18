'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div style={{ width: 40, height: 22 }} />;

  const isDark = theme === 'dark';

  function toggle() {
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Byt till ljust tema' : 'Byt till mörkt tema'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--fg-3)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        userSelect: 'none',
      }}>
        {isDark ? 'Mörkt' : 'Ljust'}
      </span>
      <div style={{
        position: 'relative',
        width: 40,
        height: 22,
        background: isDark ? 'var(--accent)' : 'var(--stroke-2)',
        borderRadius: 999,
        transition: 'background var(--dur-fast) var(--ease-standard)',
        flexShrink: 0,
        border: '1px solid',
        borderColor: isDark ? 'var(--accent)' : 'var(--stroke-1)',
      }}>
        <div style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: 16,
          height: 16,
          background: 'var(--bg-3)',
          borderRadius: '50%',
          transition: 'transform var(--dur-base) var(--ease-standard)',
          transform: isDark ? 'translateX(18px)' : 'translateX(0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isDark
            ? <Moon size={9} style={{ color: '#66635C' }} aria-hidden="true" />
            : <Sun size={9} style={{ color: '#8A8A86' }} aria-hidden="true" />
          }
        </div>
      </div>
    </button>
  );
}
