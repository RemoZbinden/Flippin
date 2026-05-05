'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';
import { formatCHF } from '@/types';

type ShopCard = {
  id: string; name: string; category: string; set_name: string; set_number: string;
  rarity: string; condition: string; price: number; for_sale: boolean; foil: boolean;
  image_url?: string; back_image_url?: string;
};

function Logo() {
  return (
    <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: -0.5, color: 'var(--black)', textDecoration: 'none' }}>
      flip<span style={{ color: 'var(--accent)' }}>pin</span>
    </Link>
  );
}

function CardTile({ card }: { card: ShopCard }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(card.id);

  const cartCard = {
    id: card.id, name: card.name, element: 'feuer' as const, hp: 0, set: card.set_name,
    setNumber: card.set_number, rarity: 'rare' as const, year: 0, emblemSeed: 0,
    foil: card.foil, condition: card.condition as 'Near Mint', price: card.price,
    forSale: true, attack: '', dmg: '', collection: '',
    imageUrl: card.image_url,
  };

  return (
    <div style={{ background: 'var(--white)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'background 0.2s' }}
      onMouseEnter={e => { (e.currentTarget.style.background = 'var(--cream)'); const btn = e.currentTarget.querySelector('.add-btn') as HTMLElement; if (btn) { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; } }}
      onMouseLeave={e => { (e.currentTarget.style.background = 'var(--white)'); const btn = e.currentTarget.querySelector('.add-btn') as HTMLElement; if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateY(4px)'; } }}
    >
      <Link href={`/shop/${card.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ aspectRatio: '3/4', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {card.image_url ? (
            <img src={card.image_url} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 48, opacity: 0.2 }}>🃏</span>
          )}
          {card.rarity.includes('holo') || card.rarity.includes('rare') ? (
            <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, background: card.rarity.includes('holo') ? 'var(--accent)' : 'var(--black)', color: 'white' }}>
              {card.rarity.includes('holo') ? 'HOLO' : 'RARE'}
            </span>
          ) : null}
          {card.foil && <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 2, background: 'linear-gradient(90deg, #ffd86e, #ff6ec7)', color: '#fff', letterSpacing: '0.06em' }}>FOIL</span>}
        </div>
      </Link>
      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{card.set_name}{card.set_number ? ` · ${card.set_number}` : ''}</div>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 3 }}>{card.name}</div>
        <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 12 }}>{card.category} · {card.condition}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{formatCHF(card.price)}</span>
          <button
            className="add-btn"
            onClick={() => addItem(cartCard)}
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

const CATEGORIES = ['Alle', 'Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Dragon Ball'];

export default function ShopPage() {
  const { count } = useCart();
  const [cards, setCards] = useState<ShopCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Alle');
  const [sort, setSort] = useState<'price-desc' | 'price-asc' | 'name'>('price-desc');

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('cards').select('*').eq('for_sale', true).order('created_at', { ascending: false });
        if (data) setCards(data as ShopCard[]);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = cards;
    if (activeFilter !== 'Alle') list = list.filter(c => c.category === activeFilter);
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [cards, activeFilter, sort]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', fontFamily: 'var(--font-body)' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64 }}>
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
          <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 12, background: 'white', color: 'var(--black)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <option value="price-desc">Preis ↓</option>
            <option value="price-asc">Preis ↑</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </nav>

      <div style={{ padding: '20px 48px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto' }}>
        <span style={{ fontSize: 12, color: 'var(--gray)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 8, whiteSpace: 'nowrap' }}>Filter:</span>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)} style={{
            padding: '6px 16px', border: `1px solid ${activeFilter === cat ? 'var(--black)' : 'var(--border)'}`,
            borderRadius: 100, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer',
            background: activeFilter === cat ? 'var(--black)' : 'white',
            color: activeFilter === cat ? 'white' : 'var(--black)',
            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ padding: '0 48px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '32px 0 24px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>Shop</h1>
          <span style={{ fontSize: 13, color: 'var(--gray)' }}>{loading ? '…' : `${filtered.length} Karten verfügbar`}</span>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--gray)', fontSize: 14 }}>Lädt…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--gray)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Noch keine Karten im Shop</div>
            <div style={{ fontSize: 14 }}>Schau bald wieder vorbei.</div>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {filtered.map(card => <CardTile key={card.id} card={card} />)}
          </div>
        )}
      </div>
    </div>
  );
}
