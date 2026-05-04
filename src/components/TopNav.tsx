'use client';

import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';

interface TopNavProps {
  onOpenShare: () => void;
  search: string;
  onSearch: (v: string) => void;
}

export function TopNav({ onOpenShare, search, onSearch }: TopNavProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 20, padding: '14px 28px',
      borderBottom: '1px solid var(--line)', background: 'rgba(247,249,252,0.85)',
      backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={30}/>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: -0.5 }}>FlippIt</span>
        <span style={{
          marginLeft: 8, padding: '2px 8px', fontSize: 10, fontWeight: 600,
          fontFamily: 'var(--font-mono)', background: 'var(--ink)', color: 'var(--cream)',
          borderRadius: 999, letterSpacing: 0.5,
        }}>BETA</span>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px 6px 10px',
        background: '#fff', border: '1px solid var(--line-2)', borderRadius: 999,
        minWidth: 260, color: 'var(--ink-4)',
      }}>
        <Icon name="search" size={16}/>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Karte, Set oder Nummer suchen…"
          style={{
            border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 13,
            fontFamily: 'var(--font-ui)', color: 'var(--ink)',
          }}
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--cream-2)', padding: '2px 6px', borderRadius: 4 }}>⌘K</span>
      </div>
      <button onClick={onOpenShare} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
        background: 'var(--ink)', color: 'var(--cream)', border: 'none', borderRadius: 999,
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}>
        <Icon name="share" size={14}/> Profil teilen
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8 }}>
        <Icon name="bell" size={18}/>
        <Avatar size={32} name="Luca"/>
      </div>
    </div>
  );
}
