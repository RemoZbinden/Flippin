'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SEED_CARDS, formatCHF } from '@/types';

function Logo() {
  return (
    <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: 'var(--black)', textDecoration: 'none' }}>
      flip<span style={{ color: 'var(--accent)' }}>pin</span>
      <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--gray)', textTransform: 'uppercase' }}>Admin</span>
    </Link>
  );
}

const COND_COLOR: Record<string, string> = {
  Mint: '#2E9E67', 'Near Mint': '#5AB27F', Excellent: '#B29E3C', Good: '#C4813C', Played: '#B34A4A',
};

export default function AdminPage() {
  const [cards, setCards] = useState(SEED_CARDS);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = cards.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.set.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Karte wirklich löschen?')) return;
    setDeleting(id);
    try {
      const supabase = createClient();
      await supabase.from('cards').delete().eq('id', id);
    } catch {}
    setCards(cs => cs.filter(c => c.id !== id));
    setDeleting(null);
  };

  const toggleSale = async (id: string) => {
    setCards(cs => cs.map(c => c.id === id ? { ...c, forSale: !c.forSale } : c));
    try {
      const supabase = createClient();
      const card = cards.find(c => c.id === id);
      await supabase.from('cards').update({ for_sale: !card?.forSale }).eq('id', id);
    } catch {}
  };

  const forSaleCount = cards.filter(c => c.forSale).length;
  const totalValue = cards.filter(c => c.forSale).reduce((s, c) => s + c.price, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, background: 'var(--white)', zIndex: 50 }}>
        <Logo />
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/" style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 12, textDecoration: 'none', color: 'var(--gray)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>← Shop</Link>
          <Link href="/admin/add" style={{ padding: '8px 20px', background: 'var(--black)', color: 'var(--white)', borderRadius: 2, fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>+ Karte hinzufügen</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 32 }}>
          {[
            { label: 'Karten gesamt', value: String(cards.length) },
            { label: 'Im Verkauf', value: String(forSaleCount) },
            { label: 'Gesamtwert Shop', value: formatCHF(totalValue) },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--white)', padding: '24px 28px' }}>
              <div style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Header + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: 0 }}>Alle Karten</h1>
          <div style={{ flex: 1 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Suchen…"
            style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 13, outline: 'none', width: 220, fontFamily: 'var(--font-body)' }}
          />
        </div>

        {/* Table */}
        <div style={{ border: '1px solid var(--border)' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 100px 110px 120px', background: 'var(--cream)', borderBottom: '1px solid var(--border)', padding: '10px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gray)' }}>
            <span>Bild</span><span>Karte</span><span>Set</span><span>Zustand</span><span>Preis</span><span>Im Shop</span><span>Aktionen</span>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)', fontSize: 14 }}>Keine Karten gefunden.</div>
          )}

          {filtered.map((card, i) => (
            <div key={card.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 100px 110px 120px', alignItems: 'center', padding: '12px 16px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : undefined, background: 'var(--white)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--white)')}
            >
              {/* Image placeholder */}
              <div style={{ width: 52, height: 36, borderRadius: 2, background: 'var(--cream)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: 18, overflow: 'hidden' }}>
                {card.imageUrl ? <img src={card.imageUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🃏'}
              </div>

              {/* Name + rarity */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{card.name}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 2, background: card.rarity === 'holo' ? 'var(--accent)' : card.rarity === 'rare' ? 'var(--black)' : 'var(--cream)', color: card.rarity === 'holo' || card.rarity === 'rare' ? 'white' : 'var(--gray)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{card.rarity}</span>
                  {card.foil && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 2, background: 'linear-gradient(90deg, #ffd86e, #ff6ec7)', color: 'white', fontWeight: 600 }}>FOIL</span>}
                </div>
              </div>

              {/* Set */}
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{card.set}<br /><span style={{ fontSize: 11 }}>{card.setNumber}</span></div>

              {/* Condition */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: COND_COLOR[card.condition], flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: 12 }}>{card.condition}</span>
              </div>

              {/* Price */}
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{formatCHF(card.price)}</div>

              {/* Toggle sale */}
              <button onClick={() => toggleSale(card.id)} style={{
                padding: '5px 12px', borderRadius: 2, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                background: card.forSale ? '#e8f5e9' : 'var(--cream)',
                color: card.forSale ? '#2E9E67' : 'var(--gray)',
              }}>
                {card.forSale ? '✓ Im Shop' : 'Versteckt'}
              </button>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href={`/admin/add?edit=${card.id}`} style={{ padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 11, color: 'var(--gray)', textDecoration: 'none', fontWeight: 500 }}>Bearbeiten</Link>
                <button onClick={() => handleDelete(card.id)} disabled={deleting === card.id} style={{ padding: '5px 10px', border: '1px solid #fcc', borderRadius: 2, fontSize: 11, color: '#c0392b', background: 'transparent', cursor: 'pointer', fontWeight: 500 }}>
                  {deleting === card.id ? '…' : 'Löschen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
