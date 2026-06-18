'use client';
import { useState } from 'react';
import { LiquidMetal } from '@paper-design/shaders-react';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface LiquidMetalButtonProps {
  label: string;
  onClick?: () => void;
}

/** A pill CTA whose face is a live liquid-metal shader, with a legible label on top. */
export function LiquidMetalButton({ label, onClick }: LiquidMetalButtonProps) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const speed = reduced ? 0 : hover ? 1.6 : 0.7;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        height: 54,
        padding: '0 30px',
        borderRadius: 999,
        overflow: 'hidden',
        isolation: 'isolate',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.22)',
        background: '#000',
        boxShadow: hover ? '0 14px 40px -12px rgba(255,255,255,0.3)' : '0 8px 26px -14px rgba(255,255,255,0.2)',
        transition: 'box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease)',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* metal face */}
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <LiquidMetal
          style={{ width: '100%', height: '100%' }}
          colorBack="#050505"
          colorTint="#E2E2E6"
          shape="metaballs"
          repetition={4}
          softness={0.5}
          shiftRed={0}
          shiftBlue={0}
          distortion={0.1}
          contour={0.2}
          angle={45}
          scale={1.7}
          speed={speed}
        />
      </span>
      {/* legibility scrim */}
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.28)' }} />
      {/* label */}
      <span style={{
        position: 'relative', zIndex: 2,
        fontFamily: 'var(--font-inter), sans-serif', fontSize: 15, fontWeight: 600, color: '#fff',
        letterSpacing: '0.01em', textShadow: '0 1px 3px rgba(0,0,0,0.7)', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </button>
  );
}
