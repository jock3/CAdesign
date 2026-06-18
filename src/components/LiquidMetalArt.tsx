'use client';
import { LiquidMetal } from '@paper-design/shaders-react';
import { useReducedMotion } from '@/lib/useReducedMotion';

/** Liquid-metal hero centrepiece. Pure black background blends into the page,
 *  so the chrome shape appears to float. Monochrome (shiftRed/Blue = 0). */
export function LiquidMetalArt() {
  const reduced = useReducedMotion();
  return (
    <div className="hero-art" aria-hidden="true" style={{ position: 'relative' }}>
      <LiquidMetal
        style={{ width: '100%', height: '100%', borderRadius: 24 }}
        colorBack="#000000"
        colorTint="#D6D6DA"
        shape="metaballs"
        repetition={3}
        softness={0.45}
        shiftRed={0}
        shiftBlue={0}
        distortion={0.12}
        contour={0.35}
        angle={65}
        scale={0.72}
        speed={reduced ? 0 : 0.7}
      />
    </div>
  );
}
