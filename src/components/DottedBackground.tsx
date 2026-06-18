'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

/** Fine technical dot-grid + a neon spotlight that tracks the cursor. */
export function DottedBackground() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    function onMouseMove(e: MouseEvent) {
      el.style.setProperty('--mx', `${Number(e.clientX)}px`);
      el.style.setProperty('--my', `${Number(e.clientY)}px`);
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [reduced]);

  return (
    <>
      {/* dot grid */}
      <div
        className="ca-dots"
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, currentColor 1.4px, transparent 1.4px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 35%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 35%, transparent 78%)',
          animation: reduced ? 'none' : 'dotDrift 24s linear infinite',
        }}
      />
      {/* cursor spotlight — ref on the same element that reads --mx/--my */}
      <div
        ref={ref}
        className="ca-spot"
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none',
          background:
            'radial-gradient(360px circle at var(--mx, 50%) var(--my, 30%), var(--spot) 0%, transparent 68%)',
          transition: 'background 60ms linear',
        }}
      />
      <style>{`
        .ca-dots { color: rgba(255,255,255,0.14); }
        .ca-spot { --spot: rgba(255,255,255,0.10); }
      `}</style>
    </>
  );
}
