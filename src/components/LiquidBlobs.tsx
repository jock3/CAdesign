'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

/** Aurora mesh — three large blurred neon blobs that slowly drift. */
export function LiquidBlobs() {
  const reduced = useReducedMotion();
  const anim = (name: string, dur: string) =>
    reduced ? 'none' : `${name} ${dur} ease-in-out infinite`;

  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* indigo — top left, behind the hero */}
      <div style={{
        position: 'absolute', top: '-14%', left: '-8%',
        width: '54vw', height: '54vw', maxWidth: 800, maxHeight: 800,
        borderRadius: '50%', background: 'var(--a-indigo)',
        opacity: 0.7, filter: 'blur(100px)',
        mixBlendMode: 'screen', animation: anim('auroraDrift1', '26s'),
        willChange: reduced ? 'auto' : 'transform',
      }} />
      {/* cyan — right */}
      <div style={{
        position: 'absolute', top: '2%', right: '-14%',
        width: '48vw', height: '48vw', maxWidth: 720, maxHeight: 720,
        borderRadius: '50%', background: 'var(--a-cyan)',
        opacity: 0.58, filter: 'blur(110px)',
        mixBlendMode: 'screen', animation: anim('auroraDrift2', '32s'),
        willChange: reduced ? 'auto' : 'transform',
      }} />
      {/* pink — center / bottom */}
      <div style={{
        position: 'absolute', bottom: '-18%', left: '24%',
        width: '52vw', height: '52vw', maxWidth: 760, maxHeight: 760,
        borderRadius: '50%', background: 'var(--a-pink)',
        opacity: 0.55, filter: 'blur(115px)',
        mixBlendMode: 'screen', animation: anim('auroraDrift3', '38s'),
        willChange: reduced ? 'auto' : 'transform',
      }} />
      {/* light-theme softening veil */}
      <style>{`
        [data-theme="light"] [role="presentation"] > div { mix-blend-mode: multiply; opacity: 0.22; }
      `}</style>
    </div>
  );
}
