'use client';

export function Avatar({ name = 'L', size = 32 }: { name?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--grape), var(--coral))',
      color: '#fff', display: 'grid', placeItems: 'center',
      fontWeight: 700, fontSize: size * 0.42, fontFamily: 'var(--font-display)',
      boxShadow: '0 2px 6px rgba(26,27,46,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)',
    }}>
      {name[0]?.toUpperCase()}
    </div>
  );
}
