'use client';

import { Icon } from '@/components/ui/Icon';
import { Element, ViewMode } from '@/types';

const ELEMENT_PILLS = [
  { k: 'all', label: 'Alle' },
  { k: 'feuer', label: 'Feuer' },
  { k: 'wasser', label: 'Wasser' },
  { k: 'pflanze', label: 'Pflanze' },
  { k: 'blitz', label: 'Blitz' },
  { k: 'psycho', label: 'Psycho' },
  { k: 'finster', label: 'Finster' },
  { k: 'metall', label: 'Metall' },
  { k: 'drache', label: 'Drache' },
];

interface ToolbarProps {
  filter: string;
  setFilter: (v: string) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  saleOnly: boolean;
  setSaleOnly: (v: boolean) => void;
  onNewCard: () => void;
}

export function Toolbar({ filter, setFilter, viewMode, setViewMode, saleOnly, setSaleOnly, onNewCard }: ToolbarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--cream-2)', borderRadius: 12, overflowX: 'auto' }}>
        {ELEMENT_PILLS.map(p => (
          <button key={p.k} onClick={() => setFilter(p.k)} style={{
            padding: '6px 12px', border: 'none', borderRadius: 8,
            background: filter === p.k ? '#fff' : 'transparent',
            boxShadow: filter === p.k ? 'var(--shadow-1)' : 'none',
            fontSize: 12.5, fontWeight: 600, color: filter === p.k ? 'var(--ink)' : 'var(--ink-4)',
            cursor: 'pointer', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap',
          }}>{p.label}</button>
        ))}
      </div>

      <label style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        background: saleOnly ? 'var(--coral)' : '#fff',
        color: saleOnly ? '#fff' : 'var(--ink-3)',
        border: `1px solid ${saleOnly ? 'var(--coral)' : 'var(--line-2)'}`,
        borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.2s',
      }}>
        <input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} style={{ display: 'none' }}/>
        <Icon name="tag" size={13}/> Nur zu verkaufen
      </label>

      <div style={{ flex: 1 }}/>

      <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--cream-2)', borderRadius: 10 }}>
        {(['grid', 'list'] as ViewMode[]).map(m => (
          <button key={m} onClick={() => setViewMode(m)} style={{
            padding: 6, border: 'none', borderRadius: 7, cursor: 'pointer',
            background: viewMode === m ? '#fff' : 'transparent',
            boxShadow: viewMode === m ? 'var(--shadow-1)' : 'none',
            color: viewMode === m ? 'var(--ink)' : 'var(--ink-4)',
            display: 'grid', placeItems: 'center',
          }}><Icon name={m} size={15}/></button>
        ))}
      </div>

      <button onClick={onNewCard} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
        background: 'var(--coral)', color: '#fff', border: 'none', borderRadius: 999,
        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(61,107,232,0.35), inset 0 -1.5px 0 rgba(0,0,0,0.15)',
      }}>
        <Icon name="plus" size={14}/> Karte hinzufügen
      </button>
    </div>
  );
}
