'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { SEED_CARDS, ELEMENT_KEYS, formatCHF, Card } from '@/types';

function Logo() {
  return (
    <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: -0.5, color: 'var(--black)', textDecoration: 'none' }}>
      flip<span style={{ color: 'var(--accent)' }}>pin</span>
    </Link>
  );
}

const ELEMENT_LABELS: Record<string, string> = {
  feuer: 'Feuer', wasser: 'Wasser', pflanze: 'Pflanze',
  blitz: 'Blitz', psycho: 'Psycho', finster: 'Finster',
  metall: 'Metall', drache: 'Drache',
};

const CARD_BG: Record<string, string> = {
  feuer:   'linear-gradient(160deg, #fdf0e8 0%, #f5d8c0 100%)',
  wasser:  'linear-gradient(160deg, #e8f4fd 0%, #d0e8f5 100%)',
  pflanze: 'linear-gradient(160deg, #edf8ed 0%, #c8e6c9 100%)',
  blitz:   'linear-gradient(160deg, #fff8e1 0%, #ffe082 100%)',
  psycho:  'linear-gradient(160deg, #f8edf8 0%, #e1bee7 100%)',
  finster: 'linear-gradient(160deg, #e8eaf6 0%, #c5cae9 100%)',
  metall:  'linear-gradient(160deg, #eceff1 0%, #cfd8dc 100%)',
  drache:  'linear-gradient(160deg, #fce4ec 0%, #f8bbd0 100%)',
};

const ELEMENT_EMOJI: Record<string, string> = {
  feuer: '🔥', wasser: '🌊', pflanze: '🌿', blitz: '⚡',
  psycho: '🔮', finster: '🌑', metall: '⚙️', drache: '🐉',
};

const BADGE_STYLE: Record<string, React.CSSProperties> = {
  holo:   { background: 'var(--accent)', color: 'white' },
  rare:   { background: 'var(--black)', color: 'white' },
  common: { background: 'var(--cream)', color: 'var(--gray)', border: '1px solid var(--border)' },
};

const BADGE_LABEL: Record<string, string> = { holo: 'HOLO', rare: 'RARE', common: 'COMMON' };

function ShopCard({ card }: { card: Card }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(card.id);
  return (
    <div style={{
      background: 'var(--white)', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden', transition: 'background 0.2s', cursor: 'pointer',
    }}
      onMouseEnter={e => { (e.currentTarget.style.background = 'var(--cream)'); const btn = e.currentTarget.querySelector('.product-btn') as HTMLElement; if (btn) { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; } }}
      onMouseLeave={e => { (e.currentTarget.style.background = 'var(--white)'); const btn = e.currentTarget.querySelector('.product-btn') as HTMLElement; if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateY(4px)'; } }}
    >
      <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, background: CARD_BG[card.element], position: 'relative' }}>
        <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, ...BADGE_STYLE[card.rarity] }}>
          {BADGE_LABEL[card.rarity]}
        </span>
        {card.foil && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 2, background: 'linear-gradient(90deg, #ffd86e, #ff6ec7)', color: '#fff', letterSpacing: '0.06em' }}>FOIL</span>}
        {ELEMENT_EMOJI[card.element]}
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{card.set} · {card.setNumber}</div>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{card.name}</div>
        <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 12 }}>{ELEMENT_LABELS[card.element]} · {card.condition}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>{formatCHF(card.price)}</span>
          <button
            className="product-btn"
            onClick={() => addItem(card)}
            style={{
              background: inCart ? '#c8a96e33' : 'var(--black)', color: inCart ? 'var(--accent)' : 'white',
              border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 14px',
              borderRadius: 2, opacity: 0, transform: 'translateY(4px)',
              transition: 'opacity 0.2s, transform 0.2s', fontFamily: 'var(--font-body)',
            }}
          >
            {inCart ? '✓ Im Warenkorb' : '+ Warenkorb'}
          </button>
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { label: 'Alle', value: 'all' },
  { label: 'Pokémon', value: 'pokemon' },
  { label: 'Holo / Rare', value: 'holo' },
  { label: 'Near Mint', value: 'nm' },
  { label: 'Unter CHF 100', value: 'u100' },
  ...ELEMENT_KEYS.map(el => ({ label: ELEMENT_LABELS[el], value: el })),
];

export default function ShopPage() {
  const { count } = useCart();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sort, setSort] = useState<'price-desc' | 'price-asc' | 'name'>('price-desc');

  const forSale = SEED_CARDS.filter(c => c.forSale);

  const filtered = useMemo(() => {
    let list = forSale;
    if (activeFilter === 'holo') list = list.filter(c => c.rarity === 'holo');
    else if (activeFilter === 'nm') list = list.filter(c => c.condition === 'Near Mint' || c.condition === 'Mint');
    else if (activeFilter === 'u100') list = list.filter(c => c.price < 100);
    else if (activeFilter !== 'all' && activeFilter !== 'pokemon') list = list.filter(c => c.element === activeFilter);

    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [forSale, activeFilter, sort]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, background: 'var(--white)',
        borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 48px', height: 64,
      }}>
        <Logo />
        <ul style={{ listStyle: 'none', display: 'flex', gap: 36, fontSize: 14, margin: 0, padding: 0 }}>
          <li><Link href="/shop" style={{ textDecoration: 'none', color: 'var(--black)', fontWeight: 500 }}>Shop</Link></li>
          <li><Link href="/#ankauf" style={{ textDecoration: 'none', color: 'var(--gray)' }}>Ankauf</Link></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/cart" style={{ position: 'relative', color: 'var(--gray)', textDecoration: 'none' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {count > 0 && <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: 'var(--accent)', borderRadius: '50%', fontSize: 9, fontWeight: 700, color: '#fff', display: 'grid', placeItems: 'center' }}>{count}</span>}
          </Link>
          <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} style={{
            padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 2,
            fontSize: 12, background: 'white', color: 'var(--black)', cursor: 'pointer',
            fontFamily: 'var(--font-body)', letterSpacing: '0.02em',
          }}>
            <option value="price-desc">Preis ↓</option>
            <option value="price-asc">Preis ↑</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </nav>

      {/* Filter bar */}
      <div style={{ padding: '20px 48px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto' }}>
        <span style={{ fontSize: 12, color: 'var(--gray)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 8, whiteSpace: 'nowrap' }}>Filter:</span>
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setActiveFilter(f.value)} style={{
            padding: '6px 16px', border: `1px solid ${activeFilter === f.value ? 'var(--black)' : 'var(--border)'}`,
            borderRadius: 100, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer',
            background: activeFilter === f.value ? 'var(--black)' : 'white',
            color: activeFilter === f.value ? 'white' : 'var(--black)',
            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '0 48px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '32px 0 24px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>Shop</h1>
          <span style={{ fontSize: 13, color: 'var(--gray)' }}>{filtered.length} Karten verfügbar</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--gray)' }}>Keine Karten gefunden.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {filtered.map(card => <ShopCard key={card.id} card={card} />)}
          </div>
        )}
      </div>
    </div>
  );
}
