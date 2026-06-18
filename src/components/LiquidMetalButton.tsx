'use client';
import { useState } from 'react';
import { LiquidMetal } from '@paper-design/shaders-react';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface LiquidMetalButtonProps {
  label: string;
  onClick?: () => void;
  /** When false, the metal rim is frozen (no shader animation). */
  animate?: boolean;
}

/** Black pill with a thin liquid-metal chrome rim + dim label.
 *  Matches the 21st.dev liquid-metal-button look. */
export function LiquidMetalButton({ label, onClick, animate = true }: LiquidMetalButtonProps) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const moving = animate && !reduced;
  const speed = moving ? (pressed ? 2.4 : hover ? 1 : 0.6) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: 48, padding: '0 28px', minWidth: 96,
        borderRadius: 100, border: 'none', background: 'transparent',
        cursor: 'pointer', isolation: 'isolate',
        transform: pressed ? 'translateY(1px) scale(0.99)' : 'none',
        transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1), box-shadow 0.15s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: pressed
          ? '0 0 0 1px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)'
          : hover
            ? '0 0 0 1px rgba(0,0,0,0.45), 0 12px 18px -6px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3)'
            : '0 0 0 1px rgba(0,0,0,0.4), 0 18px 28px -10px rgba(0,0,0,0.55), 0 6px 10px rgba(0,0,0,0.3)',
      }}
    >
      {/* liquid-metal rim (full pill, behind the dark face) */}
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 100, overflow: 'hidden', zIndex: 0 }}>
        <LiquidMetal
          style={{ width: '100%', height: '100%' }}
          colorBack="#000000"
          colorTint="#ffffff"
          shape="circle"
          repetition={4}
          softness={0.5}
          shiftRed={0}
          shiftBlue={0}
          distortion={0}
          contour={0}
          angle={45}
          scale={8}
          offsetX={0.1}
          offsetY={-0.1}
          speed={speed}
          frame={moving ? 0 : 4200}
        />
      </span>
      {/* dark inner face — covers the centre, leaving a 2px metal rim */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 2, borderRadius: 100, zIndex: 1,
        background: 'linear-gradient(180deg, #242424 0%, #000000 100%)',
        boxShadow: pressed
          ? 'inset 0 2px 4px rgba(0,0,0,0.5)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }} />
      {/* label */}
      <span style={{
        position: 'relative', zIndex: 2,
        color: hover ? '#d9d9dd' : '#9a9aa0',
        fontFamily: 'var(--font-inter), sans-serif', fontSize: 14, fontWeight: 500,
        letterSpacing: '0.01em', whiteSpace: 'nowrap',
        textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        transition: 'color 0.2s ease',
      }}>
        {label}
      </span>
    </button>
  );
}
