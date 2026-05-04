'use client';

export function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: value ? 'var(--coral)' : 'var(--ink-5)', position: 'relative',
        transition: 'background 0.2s', padding: 0, flexShrink: 0,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.22s cubic-bezier(.2,.9,.3,1.3)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
        display: 'block',
      }}/>
    </button>
  );
}
