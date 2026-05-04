'use client';

import { useState } from 'react';
import { CreatureCard } from '@/components/CreatureCard';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { Card, Collection, DensityMode, formatCHF } from '@/types';

const FILTER_CHIPS = ['Alle', 'Zu verkaufen', 'Holos', 'Feuer', 'Wasser', 'Pflanze', 'Blitz'];

interface MobileAppProps {
  cards: Card[];
  onToggleSale: (id: string) => void;
  onSelectCard: (id: string) => void;
  density: DensityMode;
  onOpenShare: () => void;
  onNewCard: () => void;
  filter: string;
  setFilter: (v: string) => void;
  saleOnly: boolean;
  setSaleOnly: (v: boolean) => void;
  collections: Collection[];
  activeCollection: string;
  setActiveCollection: (v: string) => void;
}

export function MobileApp({
  cards, onToggleSale, onSelectCard, density, onOpenShare, onNewCard,
  filter, setFilter, saleOnly, setSaleOnly, collections, activeCollection, setActiveCollection,
}: MobileAppProps) {
  const [tab, setTab] = useState<'home'|'search'|'share'|'me'>('home');

  const forSale = cards.filter(c => c.forSale);
  const saleValue = forSale.reduce((s, c) => s + c.price, 0);
  const sold = cards.filter(c => c.sold);
  const soldRevenue = sold.reduce((s, c) => s + (c.soldPrice || 0), 0);

  const filtered = cards.filter(c => {
    if (activeCollection !== 'all' && c.collection !== activeCollection) return false;
    if (filter !== 'all' && c.element !== filter) return false;
    if (saleOnly && !c.forSale) return false;
    return true;
  });

  const cardW = density === 'compact' ? 138 : 155;
  const cardH = density === 'compact' ? 194 : 218;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', background: 'linear-gradient(180deg, #DCE7FA, var(--cream))', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Logo size={28}/>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: -0.4, flex: 1 }}>Flippin</div>
          <Avatar size={30} name="L"/>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>Deine Sammlung</div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '10px 12px', boxShadow: 'var(--shadow-1)' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Karten</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: -0.5 }}>{cards.length}</div>
          </div>
          <div style={{ flex: 1, background: 'var(--cond-mint)', color: '#fff', borderRadius: 14, padding: '10px 12px', boxShadow: '0 4px 12px rgba(46,158,103,0.3)' }}>
            <div style={{ fontSize: 10, opacity: 0.85, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Verkauft</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>{sold.length} · CHF {soldRevenue.toLocaleString('de-CH')}</div>
          </div>
          <div style={{ flex: 1.3, background: 'var(--coral)', color: '#fff', borderRadius: 14, padding: '10px 12px', boxShadow: '0 4px 12px rgba(61,107,232,0.3)' }}>
            <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Im Angebot</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>CHF {saleValue.toLocaleString('de-CH')}</div>
          </div>
        </div>
      </div>

      {/* Share banner */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{ padding: '10px 12px', background: '#fff', borderRadius: 14, border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-1)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center' }}>
            <Icon name="share" size={15}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>flippin.app/c/dein-link</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{forSale.length} Karten sichtbar</div>
          </div>
          <button onClick={onOpenShare} style={{ padding: '6px 10px', border: 'none', borderRadius: 999, background: 'var(--coral-wash)', color: 'var(--coral-ink)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Teilen</button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="scroller" style={{ display: 'flex', gap: 6, padding: '4px 20px 10px', overflowX: 'auto' }}>
        {FILTER_CHIPS.map((c, i) => (
          <button key={c} style={{
            whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: 999,
            border: i === 0 ? 'none' : '1px solid var(--line-2)',
            background: i === 0 ? 'var(--ink)' : '#fff',
            color: i === 0 ? 'var(--cream)' : 'var(--ink-3)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{c}</button>
        ))}
      </div>

      {/* Card grid */}
      <div className="scroller" style={{ flex: 1, overflow: 'auto', padding: '6px 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: density === 'compact' ? 10 : 14 }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => onSelectCard(c.id)} style={{ position: 'relative', cursor: 'pointer' }}>
              <CreatureCard card={c} width={cardW} height={cardH}/>
              {c.forSale && (
                <div style={{
                  position: 'absolute', top: -6, right: -6,
                  background: 'var(--coral)', color: '#fff',
                  padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(61,107,232,0.4)',
                }}>CHF {c.price}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button onClick={onNewCard} style={{
        position: 'fixed', bottom: 100, right: 20,
        width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'var(--coral)', color: '#fff', display: 'grid', placeItems: 'center',
        boxShadow: '0 8px 20px rgba(61,107,232,0.5), inset 0 -2px 0 rgba(0,0,0,0.18)',
        zIndex: 30,
      }}><Icon name="plus" size={22}/></button>

      {/* Tab bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, padding: '10px 20px 28px',
        background: 'rgba(247,249,252,0.92)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-around', zIndex: 40,
      }}>
        {([
          {k:'home',i:'stack',l:'Sammlung'},
          {k:'search',i:'search',l:'Suchen'},
          {k:'share',i:'share',l:'Teilen'},
          {k:'me',i:'settings',l:'Profil'},
        ] as const).map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '4px 10px', background: 'transparent', border: 'none', cursor: 'pointer',
            color: tab === t.k ? 'var(--coral-ink)' : 'var(--ink-5)',
          }}>
            <Icon name={t.i} size={20}/>
            <span style={{ fontSize: 9.5, fontWeight: 600 }}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
