'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SEED_CARDS, formatCHF } from '@/types';

const COND_COLOR: Record<string, string> = {
  Mint: '#2E9E67', 'Near Mint': '#5AB27F', Excellent: '#B29E3C', Good: '#C4813C', Played: '#B34A4A',
};

export default function AdminCardsPage() {
  const [cards, setCards] = useState(SEED_CARDS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('cards').select('*').order('created_at', { ascending: false });
        if (data?.length) setCards(data as typeof SEED_CARDS);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = cards.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.set.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSale = async (id: string) => {
    const card = cards.find(c => c.id === id);
    setCards(cs => cs.map(c => c.id === id ? { ...c, forSale: !c.forSale } : c));
    try {
      const supabase = createClient();
      await supabase.from('cards').update({ for_sale: !card?.forSale }).eq('id', id);
    } catch {}
  };

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

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 4px' }}>Karten</h1>
          <p style={{ fontSize: 13, color: 'var(--gray)', margin: 0 }}>{cards.length} Karten total · {cards.filter(c => c.forSale).length} im Shop</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suchen…"
            style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 13, outline: 'none', width: 200, fontFamily: 'var(--font-body)' }} />
          <Link href="/admin/add" style={{ padding: '8px 20px', background: 'var(--black)', color: 'var(--white)', borderRadius: 2, fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center' }}>+ Neue Karte</Link>
        </div>
      </div>

      <div style={{ border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr 130px 110px 100px 120px 140px', background: 'var(--cream)', borderBottom: '1px solid var(--border)', padding: '10px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray)' }}>
          <span>Bild</span><span>Karte</span><span>Set</span><span>Zustand</span><span>Preis</span><span>Status</span><span>Aktionen</span>
        </div>

        {loading && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray)', fontSize: 13 }}>Lädt…</div>}
        {!loading && filtered.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray)', fontSize: 13 }}>Keine Karten gefunden.</div>}

        {filtered.map((card, i) => (
          <div key={card.id} style={{
            display: 'grid', gridTemplateColumns: '72px 1fr 130px 110px 100px 120px 140px',
            alignItems: 'center', padding: '12px 16px',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : undefined,
            background: 'white', transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            <div style={{ width: 48, height: 66, background: 'var(--cream)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', overflow: 'hidden', borderRadius: 2 }}>
              {card.imageUrl ? <img src={card.imageUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 20 }}>🃏</span>}
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{card.name}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 2, background: card.rarity === 'holo' ? 'var(--accent)' : card.rarity === 'rare' ? 'var(--black)' : 'var(--cream)', color: card.rarity === 'holo' || card.rarity === 'rare' ? 'white' : 'var(--gray)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{card.rarity}</span>
                {card.foil && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 2, background: 'linear-gradient(90deg,#ffd86e,#ff6ec7)', color: 'white', fontWeight: 700 }}>FOIL</span>}
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--gray)' }}>{card.set}<br /><span style={{ fontSize: 11 }}>{card.setNumber}</span></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: COND_COLOR[card.condition] ?? '#ccc', display: 'inline-block' }} />
              <span style={{ fontSize: 12 }}>{card.condition}</span>
            </div>

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{formatCHF(card.price)}</div>

            <button onClick={() => toggleSale(card.id)} style={{
              padding: '5px 12px', borderRadius: 2, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
              background: card.forSale ? '#e8f5e9' : 'var(--cream)',
              color: card.forSale ? '#2E9E67' : 'var(--gray)',
            }}>
              {card.forSale ? '✓ Im Shop' : 'Versteckt'}
            </button>

            <div style={{ display: 'flex', gap: 6 }}>
              <Link href={`/admin/add?edit=${card.id}`} style={{ padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 11, color: 'var(--gray)', textDecoration: 'none', fontWeight: 500 }}>Bearbeiten</Link>
              <button onClick={() => handleDelete(card.id)} disabled={deleting === card.id} style={{ padding: '5px 10px', border: '1px solid #fcc', borderRadius: 2, fontSize: 11, color: '#c0392b', background: 'transparent', cursor: 'pointer' }}>
                {deleting === card.id ? '…' : 'Löschen'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
