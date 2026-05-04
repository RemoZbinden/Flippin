'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { CreatureCard } from '@/components/CreatureCard';
import { useCart } from '@/lib/cart';
import { SEED_CARDS, formatCHF, CONDITIONS } from '@/types';

const ELEMENT_LABELS: Record<string, string> = {
  feuer: 'Feuer', wasser: 'Wasser', pflanze: 'Pflanze',
  blitz: 'Blitz', psycho: 'Psycho', finster: 'Finster',
  metall: 'Metall', drache: 'Drache',
};
const COND_COLOR: Record<string, string> = {
  Mint: '#2E9E67', 'Near Mint': '#5AB27F', Excellent: '#B29E3C', Good: '#C4813C', Played: '#B34A4A',
};

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const card = SEED_CARDS.find(c => c.id === id);
  if (!card) notFound();

  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(card.id);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-ui)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '14px 40px', borderBottom: '1px solid var(--line)',
        background: 'rgba(247,249,252,0.9)', backdropFilter: 'blur(14px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Logo size={28} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: 'var(--ink)' }}>Flippin</span>
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/shop" style={{ color: 'var(--ink-3)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>← Zurück zum Shop</Link>
        <Link href="/cart" style={{
          padding: '8px 16px', background: 'var(--ink)', color: 'var(--cream)',
          borderRadius: 999, textDecoration: 'none', fontSize: 13, fontWeight: 600,
        }}>Warenkorb</Link>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Card visual */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <CreatureCard card={card} width={260} height={364} />
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span style={{
                padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                fontFamily: 'var(--font-mono)', background: 'var(--cream-2)', color: 'var(--ink-3)',
              }}>{card.rarity.toUpperCase()}</span>
              {card.foil && (
                <span style={{
                  padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: 'linear-gradient(90deg, #ffd86e, #ff6ec7)', color: '#fff',
                }}>FOIL</span>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, letterSpacing: -1, margin: '0 0 8px', color: 'var(--ink)' }}>
              {card.name}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ink-4)', margin: '0 0 28px' }}>
              {card.set} · {card.setNumber} · {card.year}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, letterSpacing: -1, color: 'var(--ink)' }}>
                {formatCHF(card.price)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-5)', marginTop: 2 }}>inkl. MwSt. · zzgl. Versand</div>
            </div>

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[
                { label: 'Element', value: ELEMENT_LABELS[card.element] },
                { label: 'HP', value: String(card.hp) },
                { label: 'Angriff', value: card.attack },
                { label: 'Schaden', value: card.dmg },
                { label: 'Zustand', value: card.condition },
                { label: 'Jahr', value: String(card.year) },
              ].map(row => (
                <div key={row.label} style={{
                  padding: '10px 14px', background: 'var(--cream-2)',
                  borderRadius: 8, border: '1px solid var(--line)',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-5)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {row.label === 'Zustand' && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: COND_COLOR[card.condition], flexShrink: 0, display: 'inline-block' }}/>
                    )}
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Condition scale */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Zustandsskala</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {CONDITIONS.map(c => (
                  <div key={c} style={{
                    flex: 1, height: 4, borderRadius: 999,
                    background: c === card.condition ? COND_COLOR[c] : 'var(--line)',
                  }}/>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--ink-5)' }}>Mint</span>
                <span style={{ fontSize: 10, color: 'var(--ink-5)' }}>Played</span>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => inCart ? removeItem(card.id) : addItem(card)}
                style={{
                  flex: 1, padding: '14px 24px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontSize: 15, fontWeight: 600,
                  background: inCart ? '#E8F5EE' : 'var(--ink)',
                  color: inCart ? '#2E9E67' : 'var(--cream)',
                }}
              >
                {inCart ? '✓ Im Warenkorb' : 'In den Warenkorb'}
              </button>
              {inCart && (
                <Link href="/cart" style={{
                  padding: '14px 24px', borderRadius: 10, background: 'var(--ink)',
                  color: 'var(--cream)', textDecoration: 'none', fontSize: 15, fontWeight: 600,
                  display: 'grid', placeItems: 'center',
                }}>Zur Kasse →</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
