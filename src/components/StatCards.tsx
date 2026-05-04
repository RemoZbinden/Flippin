'use client';

import { Card, formatCHF } from '@/types';

export function StatCards({ cards }: { cards: Card[] }) {
  const total = cards.length;
  const forSale = cards.filter(c => c.forSale).length;
  const saleValue = cards.filter(c => c.forSale).reduce((s, c) => s + (c.price || 0), 0);
  const sold = cards.filter(c => c.sold);
  const soldRevenue = sold.reduce((s, c) => s + (c.soldPrice || 0), 0);

  const stats = [
    { label: 'Karten gesamt', value: total, accent: 'var(--ink)', sub: `in ${new Set(cards.map(c => c.set)).size} Sets` },
    { label: 'Zu verkaufen', value: forSale, accent: 'var(--coral-ink)', sub: `${total ? Math.round(forSale/total*100) : 0}% deiner Sammlung`, dot: 'var(--coral)' },
    { label: 'Verkauft', value: sold.length, accent: 'var(--cond-mint)', sub: `${formatCHF(soldRevenue)} Umsatz`, dot: 'var(--cond-mint)', wide: true },
    { label: 'Im Angebot', value: formatCHF(saleValue), accent: 'var(--coral-ink)', sub: 'Shareable via /dein-link', wide: true },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1.3fr 1.3fr',
      gap: 14, marginBottom: 22,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid var(--line-2)', borderRadius: 16,
          padding: '16px 18px', boxShadow: 'var(--shadow-1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            {s.dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, boxShadow: `0 0 0 3px ${s.dot}22`, display: 'inline-block' }}/>}
            {s.label}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: s.accent, letterSpacing: -0.8, lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-5)', marginTop: 6 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
