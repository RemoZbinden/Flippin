'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SEED_CARDS, formatCHF } from '@/types';

type Order = { id: string; status: string; total: number; shipping_name: string; created_at: string };

export default function AdminDashboard() {
  const [cards, setCards] = useState(SEED_CARDS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const [{ data: cardData }, { data: orderData }] = await Promise.all([
          supabase.from('cards').select('*'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        ]);
        if (cardData?.length) setCards(cardData as typeof SEED_CARDS);
        if (orderData) setOrders(orderData);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const cardsInShop = cards.filter(c => c.forSale).length;
  const shopValue = cards.filter(c => c.forSale).reduce((s, c) => s + c.price, 0);
  const soldOrders = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered');
  const revenue = soldOrders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Karten im Shop', value: cardsInShop, sub: `${cards.length} total`, href: '/admin/cards' },
    { label: 'Shopwert', value: formatCHF(shopValue), sub: 'aktive Listings', href: '/admin/cards' },
    { label: 'Bestellungen', value: orders.length, sub: `${soldOrders.length} bezahlt`, href: '/admin/orders' },
    { label: 'Umsatz', value: formatCHF(revenue), sub: 'bezahlte Bestellungen', href: '/admin/orders' },
  ];

  const STATUS_LABEL: Record<string, string> = { pending: 'Ausstehend', paid: 'Bezahlt', shipped: 'Versendet', delivered: 'Geliefert', cancelled: 'Storniert' };
  const STATUS_COLOR: Record<string, string> = { pending: '#B29E3C', paid: '#2E9E67', shipped: '#3D8BE8', delivered: '#4FB079', cancelled: '#B34A4A' };

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 4px' }}>Übersicht</h1>
        <p style={{ fontSize: 13, color: 'var(--gray)', margin: 0 }}>Willkommen in der Admin-Konsole.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none', border: '1px solid var(--border)', padding: '20px 24px', background: 'white', display: 'block' }}>
            <div style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>{loading ? '–' : stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--gray)' }}>{stat.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Recent orders */}
        <div style={{ border: '1px solid var(--border)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Letzte Bestellungen</span>
            <Link href="/admin/orders" style={{ fontSize: 11, color: 'var(--gray)', textDecoration: 'none' }}>Alle ansehen →</Link>
          </div>
          {loading && <div style={{ padding: 32, textAlign: 'center', color: 'var(--gray)', fontSize: 13 }}>Lädt…</div>}
          {!loading && orders.length === 0 && (
            <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--gray)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 14 }}>Noch keine Bestellungen.</div>
            </div>
          )}
          {orders.map((order, i) => (
            <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', alignItems: 'center', padding: '14px 20px', borderBottom: i < orders.length - 1 ? '1px solid var(--border)' : undefined }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{order.shipping_name}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{new Date(order.created_at).toLocaleDateString('de-CH')}</div>
              </div>
              <span style={{ display: 'inline-block', fontSize: 10, padding: '3px 8px', borderRadius: 2, background: (STATUS_COLOR[order.status] ?? '#ccc') + '22', color: STATUS_COLOR[order.status] ?? '#ccc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textAlign: 'right' }}>{formatCHF(order.total)}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ border: '1px solid var(--border)', height: 'fit-content' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Schnellzugriff</span>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/admin/add', label: '+ Neue Karte hinzufügen' },
              { href: '/admin/cards', label: '→ Karten verwalten' },
              { href: '/admin/orders', label: '→ Bestellungen' },
              { href: '/admin/settings', label: '→ Einstellungen' },
              { href: '/shop', label: '↗ Shop ansehen', external: true },
            ].map(link => (
              <Link key={link.href} href={link.href} target={link.external ? '_blank' : undefined} style={{
                display: 'block', padding: '10px 14px', border: '1px solid var(--border)',
                borderRadius: 2, fontSize: 12, color: 'var(--black)', textDecoration: 'none',
                fontWeight: 500, transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
