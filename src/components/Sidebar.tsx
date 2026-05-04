'use client';

import { Icon } from '@/components/ui/Icon';
import { Collection } from '@/types';

interface SidebarProps {
  collections: Collection[];
  activeCollection: string;
  setActiveCollection: (id: string) => void;
  onNewCollection: () => void;
}

export function Sidebar({ collections, activeCollection, setActiveCollection, onNewCollection }: SidebarProps) {
  return (
    <div style={{
      width: 260, padding: '24px 16px', borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', gap: 22, minHeight: 'calc(100vh - 62px)',
      background: 'rgba(244,238,226,0.35)',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--ink-4)' }}>Sammlungen</span>
          <button onClick={onNewCollection} style={{ border: 'none', background: 'transparent', color: 'var(--ink-4)', cursor: 'pointer', padding: 4 }}>
            <Icon name="plus" size={14}/>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {collections.map(c => {
            const active = c.id === activeCollection;
            return (
              <button key={c.id} onClick={() => setActiveCollection(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                background: active ? '#fff' : 'transparent',
                border: active ? '1px solid var(--line-2)' : '1px solid transparent',
                borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                color: active ? 'var(--ink)' : 'var(--ink-3)',
                boxShadow: active ? 'var(--shadow-1)' : 'none',
                fontSize: 14, fontWeight: active ? 600 : 500,
              }}>
                <span style={{ color: active ? 'var(--coral-ink)' : 'var(--ink-4)' }}>
                  <Icon name={c.icon as Parameters<typeof Icon>[0]['name']} size={16}/>
                </span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-5)' }}>{c.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ padding: '0 8px 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--ink-4)' }}>Filter</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SideLink icon="tag" label="Zu verkaufen" count={8} accent="var(--coral)"/>
          <SideLink icon="star" label="Holos" count={7}/>
          <SideLink icon="verify" label="Verifiziert" count={3} badge="NEU"/>
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '14px 12px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 14, boxShadow: 'var(--shadow-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ color: 'var(--coral)' }}><Icon name="spark" size={14}/></span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Pro-Upgrade</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', lineHeight: 1.45, marginBottom: 8 }}>
          Unbegrenzte Karten, Statistiken &amp; Priority Verification.
        </div>
        <button style={{
          width: '100%', padding: '7px 10px', border: 'none', borderRadius: 8,
          background: 'var(--ink)', color: 'var(--cream)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>CHF 4.90/Monat →</button>
      </div>
    </div>
  );
}

function SideLink({ icon, label, count, accent, badge }: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  count?: number;
  accent?: string;
  badge?: string;
}) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
      background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer',
      textAlign: 'left', color: 'var(--ink-3)', fontSize: 14, fontWeight: 500,
    }}>
      <span style={{ color: accent || 'var(--ink-4)' }}><Icon name={icon} size={16}/></span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999, background: 'var(--coral)', color: '#fff' }}>{badge}</span>}
      {count != null && <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-5)' }}>{count}</span>}
    </button>
  );
}
