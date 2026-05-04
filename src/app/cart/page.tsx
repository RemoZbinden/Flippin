'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useCart } from '@/lib/cart';
import { formatCHF } from '@/types';

const ELEMENT_COLORS: Record<string, string> = {
  feuer: '#E8553D', wasser: '#3D8BE8', pflanze: '#4FB079',
  blitz: '#F0C94A', psycho: '#B967D9', finster: '#2B2B3D',
  metall: '#8A95A8', drache: '#C4894F',
};

const SHIPPING = 6.9;

export default function CartPage() {
  const { items, total, count, removeItem, clearCart } = useCart();
  const grandTotal = total + (count > 0 ? SHIPPING : 0);

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
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: 'var(--ink)' }}>FlippIt</span>
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/shop" style={{ color: 'var(--ink-3)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>← Weiter einkaufen</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: -0.5, margin: '0 0 32px' }}>
          Warenkorb {count > 0 && <span style={{ fontSize: 16, color: 'var(--ink-4)', fontWeight: 400 }}>({count} {count === 1 ? 'Karte' : 'Karten'})</span>}
        </h1>

        {count === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Dein Warenkorb ist leer</div>
            <p style={{ color: 'var(--ink-4)', marginBottom: 24 }}>Entdecke seltene Pokémon-Karten in unserem Shop.</p>
            <Link href="/shop" style={{
              padding: '12px 28px', background: 'var(--ink)', color: 'var(--cream)',
              borderRadius: 999, textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}>Zum Shop</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(({ card }) => (
                <div key={card.id} style={{
                  background: '#fff', borderRadius: 12, border: '1px solid var(--line)',
                  padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${ELEMENT_COLORS[card.element]}22, ${ELEMENT_COLORS[card.element]}44)`,
                    display: 'grid', placeItems: 'center',
                  }}>
                    <span style={{ fontSize: 22 }}>✦</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{card.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>{card.set} · {card.condition} · {card.rarity}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--ink)', flexShrink: 0 }}>
                    {formatCHF(card.price)}
                  </div>
                  <button onClick={() => removeItem(card.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--ink-5)', fontSize: 18, padding: 4, flexShrink: 0,
                  }}>✕</button>
                </div>
              ))}
              <button onClick={clearCart} style={{
                alignSelf: 'flex-start', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--ink-5)', fontSize: 13, padding: 0, marginTop: 4,
              }}>Warenkorb leeren</button>
            </div>

            {/* Summary */}
            <div style={{
              background: '#fff', borderRadius: 14, border: '1px solid var(--line)',
              padding: '24px', position: 'sticky', top: 88,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Zusammenfassung</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-3)' }}>
                  <span>Zwischensumme ({count} Karten)</span>
                  <span>{formatCHF(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-3)' }}>
                  <span>Versand (CH)</span>
                  <span>{formatCHF(SHIPPING)}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{formatCHF(grandTotal)}</span>
                </div>
              </div>

              <Link href="/checkout" style={{
                display: 'block', textAlign: 'center', padding: '14px',
                background: 'var(--ink)', color: 'var(--cream)', borderRadius: 10,
                textDecoration: 'none', fontSize: 15, fontWeight: 600,
              }}>Zur Kasse →</Link>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {['Visa', 'Mastercard', 'TWINT', 'PostFinance'].map(m => (
                  <span key={m} style={{
                    padding: '3px 8px', border: '1px solid var(--line-2)', borderRadius: 4,
                    fontSize: 10, fontWeight: 600, color: 'var(--ink-4)',
                    fontFamily: 'var(--font-mono)',
                  }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
