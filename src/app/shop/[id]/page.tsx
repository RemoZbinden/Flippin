'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/lib/cart';
import { formatCHF } from '@/types';

type ShopCard = {
  id: string; name: string; category: string; set_name: string; set_number: string;
  rarity: string; condition: string; language: string; year: number;
  price: number; for_sale: boolean; foil: boolean; description?: string;
  image_url?: string; back_image_url?: string;
};

const COND_COLOR: Record<string, string> = {
  Mint: '#2E9E67', 'Near Mint': '#5AB27F', Excellent: '#B29E3C', Good: '#C4813C', Played: '#B34A4A',
};
const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Played'];

function ImageZoom({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out',
      }}
    >
      <img
        src={src} alt={alt}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 4, cursor: 'default', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      />
      <button onClick={onClose} style={{
        position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.1)',
        border: 'none', color: 'white', width: 40, height: 40, borderRadius: '50%',
        fontSize: 20, cursor: 'pointer', display: 'grid', placeItems: 'center',
      }}>✕</button>
    </div>
  );
}

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [card, setCard] = useState<ShopCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState<'front' | 'back'>('front');
  const { addItem, removeItem, isInCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('cards').select('*').eq('id', id).single();
        if (data) setCard(data as ShopCard);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)', fontFamily: 'var(--font-body)', color: 'var(--gray)' }}>
        Lädt…
      </div>
    );
  }

  if (!card) notFound();

  const inCart = isInCart(card.id);
  const cartCard = {
    id: card.id, name: card.name, element: 'feuer' as const, hp: 0, set: card.set_name,
    setNumber: card.set_number, rarity: 'rare' as const, year: card.year, emblemSeed: 0,
    foil: card.foil, condition: card.condition as 'Near Mint', price: card.price,
    forSale: true, attack: '', dmg: '', collection: '',
    imageUrl: card.image_url,
  };

  const currentImg = activeImg === 'front' ? card.image_url : card.back_image_url;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', fontFamily: 'var(--font-body)' }}>
      {zoom && <ImageZoom src={zoom} alt={card.name} onClose={() => setZoom(null)} />}

      {/* Nav */}
      <nav style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', position: 'sticky', top: 0, background: 'var(--white)', zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: -0.5, color: 'var(--black)', textDecoration: 'none' }}>
          flip<span style={{ color: 'var(--accent)' }}>pin</span>
        </Link>
        <Link href="/shop" style={{ fontSize: 13, color: 'var(--gray)', textDecoration: 'none' }}>← Zurück zum Shop</Link>
        <Link href="/cart" style={{ fontSize: 13, color: 'var(--gray)', textDecoration: 'none' }}>Warenkorb</Link>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 60, alignItems: 'start' }}>

          {/* Left: Image */}
          <div>
            {/* Main image */}
            <div
              onClick={() => currentImg && setZoom(currentImg)}
              style={{
                aspectRatio: '3/4', background: 'var(--cream)', border: '1px solid var(--border)',
                borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: currentImg ? 'zoom-in' : 'default', position: 'relative',
              }}
            >
              {currentImg ? (
                <>
                  <img src={currentImg} alt={activeImg === 'front' ? card.name : 'Rückseite'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.4)', color: 'white', borderRadius: 2, fontSize: 11, padding: '4px 8px', pointerEvents: 'none' }}>
                    🔍 Klicken zum Vergrössern
                  </div>
                </>
              ) : (
                <span style={{ fontSize: 64, opacity: 0.15 }}>🃏</span>
              )}
            </div>

            {/* Front / Back toggle */}
            {card.back_image_url && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                {(['front', 'back'] as const).map(side => {
                  const src = side === 'front' ? card.image_url : card.back_image_url;
                  return (
                    <div
                      key={side}
                      onClick={() => setActiveImg(side)}
                      style={{
                        aspectRatio: '3/4', background: 'var(--cream)', border: `2px solid ${activeImg === side ? 'var(--black)' : 'var(--border)'}`,
                        borderRadius: 4, overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      {src ? (
                        <img src={src} alt={side} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: 24, opacity: 0.2 }}>🃏</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Without back: just show front thumbnail clickable */}
            {!card.back_image_url && card.image_url && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--gray)', textAlign: 'center' }}>Nur Vorderseite verfügbar</div>
            )}
          </div>

          {/* Right: Details */}
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {card.category && (
                <span style={{ padding: '4px 10px', borderRadius: 2, fontSize: 11, fontWeight: 700, background: 'var(--cream)', color: 'var(--gray)', border: '1px solid var(--border)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{card.category}</span>
              )}
              {(card.rarity.includes('holo') || card.rarity.includes('rare')) && (
                <span style={{ padding: '4px 10px', borderRadius: 2, fontSize: 11, fontWeight: 700, background: card.rarity.includes('holo') ? 'var(--accent)' : 'var(--black)', color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{card.rarity.toUpperCase()}</span>
              )}
              {card.foil && (
                <span style={{ padding: '4px 10px', borderRadius: 2, fontSize: 11, fontWeight: 700, background: 'linear-gradient(90deg, #ffd86e, #ff6ec7)', color: 'white' }}>FOIL</span>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 8px', color: 'var(--black)' }}>{card.name}</h1>
            <p style={{ fontSize: 14, color: 'var(--gray)', margin: '0 0 24px' }}>
              {card.set_name}{card.set_number ? ` · ${card.set_number}` : ''}{card.year ? ` · ${card.year}` : ''}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 24, padding: '20px 24px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 2 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 800, letterSpacing: -1, color: 'var(--black)' }}>{formatCHF(card.price)}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 4 }}>inkl. MwSt. · zzgl. Versand CHF 6.90</div>
            </div>

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Zustand', value: card.condition },
                { label: 'Sprache', value: card.language },
                { label: 'Seltenheit', value: card.rarity },
                { label: 'Jahr', value: String(card.year) },
              ].filter(r => r.value).map(row => (
                <div key={row.label} style={{ padding: '10px 14px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 2 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{row.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--black)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {row.label === 'Zustand' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: COND_COLOR[row.value] ?? '#ccc', flexShrink: 0, display: 'inline-block' }} />}
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Condition bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Zustand</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {CONDITIONS.map(c => (
                  <div key={c} style={{ flex: 1, height: 4, borderRadius: 999, background: c === card.condition ? (COND_COLOR[c] ?? 'var(--accent)') : 'var(--border)' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--gray)' }}>Mint</span>
                <span style={{ fontSize: 10, color: 'var(--gray)' }}>Played</span>
              </div>
            </div>

            {/* Description */}
            {card.description && (
              <div style={{ marginBottom: 24, fontSize: 14, color: 'var(--gray)', lineHeight: 1.7, padding: '14px 18px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 2 }}>
                {card.description}
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => inCart ? removeItem(card.id) : addItem(cartCard)}
                style={{
                  flex: 1, padding: '14px 24px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  background: inCart ? '#e8f5e9' : 'var(--black)', color: inCart ? '#2E9E67' : 'white',
                  borderRadius: 2, fontFamily: 'var(--font-body)', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'background 0.2s',
                }}
              >
                {inCart ? '✓ Im Warenkorb' : 'In den Warenkorb'}
              </button>
              {inCart && (
                <Link href="/cart" style={{
                  padding: '14px 24px', background: 'var(--accent)', color: 'white',
                  textDecoration: 'none', fontSize: 14, fontWeight: 600, borderRadius: 2,
                  display: 'grid', placeItems: 'center', letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>Zur Kasse →</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
