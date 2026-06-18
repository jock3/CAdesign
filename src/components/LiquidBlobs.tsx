'use client';

/** Subtle monochrome depth — two faint white radial glows. No colour. */
export function LiquidBlobs() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '90vw', height: '60vh', maxWidth: 1100,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 65%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-25%', left: '-10%',
        width: '55vw', height: '55vw', maxWidth: 700,
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.035) 0%, transparent 68%)',
      }} />
    </div>
  );
}
