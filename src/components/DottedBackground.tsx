'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function DottedBackground() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !ref.current) return;

    const el = ref.current;

    function onMouseMove(e: MouseEvent) {
      const x = Number(e.clientX);
      const y = Number(e.clientY);
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [reduced]);

  return (
    <>
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          color: 'rgba(40,40,45,0.06)',
          animation: reduced ? 'none' : 'dotDrift 40s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          background: `radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), rgba(40,40,45,0.06) 0%, transparent 100%)`,
        }}
      />
      <style>{`
        [data-theme="dark"] [aria-hidden="true"] {
          color: rgba(244,241,236,0.05) !important;
        }
      `}</style>
    </>
  );
}
