'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function LiquidBlobs() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" role="presentation" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Blob 1 - top right */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: 500,
        height: 500,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        background: 'var(--blob-1-color, rgba(57,82,40,0.12))',
        filter: 'blur(90px)',
        animation: reduced ? 'none' : 'blobDrift1 24s ease-in-out infinite',
        willChange: reduced ? 'auto' : 'transform',
      }} />
      {/* Blob 2 - bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        left: '-10%',
        width: 450,
        height: 450,
        borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%',
        background: 'var(--blob-2-color, rgba(57,82,40,0.10))',
        filter: 'blur(90px)',
        animation: reduced ? 'none' : 'blobDrift2 32s ease-in-out infinite',
        willChange: reduced ? 'auto' : 'transform',
      }} />
      <style>{`
        :root {
          --blob-1-color: rgba(57,82,40,0.12);
          --blob-2-color: rgba(57,82,40,0.10);
        }
        [data-theme="dark"] {
          --blob-1-color: rgba(235,60,39,0.15);
          --blob-2-color: rgba(57,82,40,0.10);
        }
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
          33% { transform: translate(30px, -20px) scale(1.05); border-radius: 50% 50% 60% 40% / 40% 60% 50% 50%; }
          66% { transform: translate(-20px, 30px) scale(0.95); border-radius: 70% 30% 50% 50% / 60% 40% 60% 40%; }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
          33% { transform: translate(-30px, 20px) scale(1.04); border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; }
          66% { transform: translate(25px, -25px) scale(0.96); border-radius: 30% 70% 60% 40% / 40% 50% 60% 50%; }
        }
      `}</style>
    </div>
  );
}
