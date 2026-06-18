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
      {/* Dot grid surface — color set via stylesheet (not inline) so the
          dark-theme override isn't beaten by inline-style specificity */}
      <div
        className="ca-dots"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, currentColor 1.6px, transparent 1.6px)',
          backgroundSize: '26px 26px',
          animation: reduced ? 'none' : 'dotDrift 40s ease-in-out infinite',
        }}
      />
      {/* Pointer spotlight — ref lives on the SAME element that reads --mx/--my
          (CSS custom properties don't cross between sibling elements) */}
      <div
        ref={ref}
        className="ca-spotlight"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle 240px at var(--mx, 50%) var(--my, 50%), var(--spot, rgba(57,82,40,0.12)) 0%, transparent 70%)',
        }}
      />
      <style>{`
        .ca-dots { color: rgba(40,40,45,0.16); }
        [data-theme="dark"] .ca-dots { color: rgba(244,241,236,0.19); }
        .ca-spotlight { --spot: rgba(57,82,40,0.12); }
        [data-theme="dark"] .ca-spotlight { --spot: rgba(235,60,39,0.18); }
      `}</style>
    </>
  );
}
