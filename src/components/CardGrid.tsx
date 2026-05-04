'use client';

import { useState } from 'react';
import { CreatureCard } from '@/components/CreatureCard';
import { Icon } from '@/components/ui/Icon';
import { Card, ViewMode, formatCHF, DENSITY, DensityMode } from '@/types';

interface CardGridProps {
  cards: Card[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleSale: (id: string) => void;
  viewMode: ViewMode;
  density: DensityMode;
}

function CardTile({ card, selected, onSelect, onToggleSale, cardW, cardH }: {
  card: Card; selected: boolean; onSelect: () => void; onToggleSale: () => void; cardW: number; cardH: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      style={{ position: 'relative', cursor: 'pointer', transform: hover ? 'translateY(-6px)' : 'translateY(0)', transition: 'transform 0.25s cubic-bezier(.2,.9,.3,1.3)' }}
    >
      <div style={{ position: 'absolute', inset: -4, borderRadius: 18, background: selected ? 'var(--coral)' : 'transparent', opacity: selected ? 0.18 : 0 }}/>
      <CreatureCard card={card} width={cardW} height={cardH}/>
      {card.forSale && (
        <div style={{
          position: 'absolute', top: -8, right: -8,
          background: 'var(--coral)', color: '#fff',
          padding: '4px 10px 4px 8px', borderRadius: 999,
          fontSize: 11, fontWeight: 700, letterSpacing: -0.2,
          display: 'flex', alignItems: 'center', gap: 4,
          boxShadow: '0 3px 10px rgba(61,107,232,0.45), inset 0 -1.5px 0 rgba(0,0,0,0.15)',
          animation: 'pricePop 0.4s cubic-bezier(.2,.9,.3,1.3)',
        }}>
          <Icon name="tag" size={10}/> {formatCHF(card.price)}
        </div>
      )}
      {card.foil && card.rarity === 'holo' && (
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          padding: '2px 7px', borderRadius: 999,
          background: 'linear-gradient(90deg, #ffd86e, #ff6ec7, #a0ffbd)',
          backgroundSize: '200% 200%', animation: 'holoSweep 4s linear infinite',
          fontSize: 9, fontWeight: 700, color: '#2b1400',
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>HOLO ✦</div>
      )}
      {hover && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSale(); }}
          style={{
            position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
            padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
            background: card.forSale ? 'var(--ink)' : 'var(--coral)',
            color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}>
          {card.forSale ? 'Vom Verkauf nehmen' : 'Zum Verkauf stellen'}
        </button>
      )}
    </div>
  );
}

function CardListRow({ card, selected, onSelect, onToggleSale }: {
  card: Card; selected: boolean; onSelect: () => void; onToggleSale: () => void;
}) {
  return (
    <div onClick={onSelect} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px',
      background: selected ? 'var(--coral-wash)' : '#fff',
      border: `1px solid ${selected ? 'var(--coral)' : 'var(--line-2)'}`,
      borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
    }}>
      <CreatureCard card={card} width={50} height={70}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{card.name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 1 }}>{card.set} · {card.setNumber} · {card.year}</div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{card.condition}</div>
      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>{formatCHF(card.price)}</div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSale(); }}
        style={{
          padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          background: card.forSale ? 'var(--coral)' : 'var(--cream-2)',
          color: card.forSale ? '#fff' : 'var(--ink-3)', border: 'none', cursor: 'pointer',
        }}>
        {card.forSale ? 'Im Angebot' : 'Anbieten'}
      </button>
    </div>
  );
}

export function CardGrid({ cards, selectedId, onSelect, onToggleSale, viewMode, density }: CardGridProps) {
  const d = DENSITY[density];

  if (cards.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-4)' }}>
        Keine Karten entsprechen dem Filter.
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards.map(card => (
          <CardListRow
            key={card.id} card={card} selected={selectedId === card.id}
            onSelect={() => onSelect(card.id)} onToggleSale={() => onToggleSale(card.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: d.gap }}>
      {cards.map(card => (
        <CardTile
          key={card.id} card={card} cardW={d.w} cardH={d.h}
          selected={selectedId === card.id}
          onSelect={() => onSelect(card.id)}
          onToggleSale={() => onToggleSale(card.id)}
        />
      ))}
    </div>
  );
}
