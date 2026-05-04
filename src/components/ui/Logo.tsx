'use client';

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, position: 'relative',
      background: 'linear-gradient(140deg, var(--coral) 0%, #3D6BE8 100%)',
      boxShadow: '0 2px 6px rgba(61,107,232,0.35), inset 0 -2px 0 rgba(0,0,0,0.08)',
      display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)',
      flexShrink: 0,
    }}>
      <div style={{
        width: size * 0.58, height: size * 0.78, borderRadius: size * 0.1,
        background: 'linear-gradient(160deg, #fff, var(--cream))',
        boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.15)',
        transform: 'rotate(12deg)',
      }}/>
    </div>
  );
}
