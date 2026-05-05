'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCHF } from '@/types';

type Order = {
  id: string; status: string; total: number;
  shipping_name: string; shipping_email: string;
  shipping_street: string; shipping_city: string; shipping_zip: string; shipping_country: string;
  created_at: string; stripe_payment_intent?: string;
};

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABEL: Record<string, string> = { pending: 'Ausstehend', paid: 'Bezahlt', shipped: 'Versendet', delivered: 'Geliefert', cancelled: 'Storniert' };
const STATUS_COLOR: Record<string, string> = { pending: '#B29E3C', paid: '#2E9E67', shipped: '#3D8BE8', delivered: '#4FB079', cancelled: '#B34A4A' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) setOrders(data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient();
      await supabase.from('orders').update({ status }).eq('id', id);
      setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
    } catch {}
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 4px' }}>Bestellungen</h1>
        <p style={{ fontSize: 13, color: 'var(--gray)', margin: 0 }}>{orders.length} Bestellungen total</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            padding: '6px 14px', borderRadius: 2, border: `1px solid ${filterStatus === s ? 'var(--black)' : 'var(--border)'}`,
            background: filterStatus === s ? 'var(--black)' : 'white',
            color: filterStatus === s ? 'white' : 'var(--gray)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
            fontWeight: filterStatus === s ? 600 : 400,
          }}>
            {s === 'all' ? 'Alle' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
        {/* Table */}
        <div style={{ border: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 100px 120px 80px', background: 'var(--cream)', borderBottom: '1px solid var(--border)', padding: '10px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray)' }}>
            <span>Kunde</span><span>Datum</span><span>Total</span><span>Status</span><span>Detail</span>
          </div>

          {loading && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray)', fontSize: 13 }}>Lädt…</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--gray)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 14 }}>Noch keine Bestellungen.</div>
            </div>
          )}

          {filtered.map((order, i) => (
            <div key={order.id} onClick={() => setSelected(selected?.id === order.id ? null : order)} style={{
              display: 'grid', gridTemplateColumns: '1fr 130px 100px 120px 80px',
              alignItems: 'center', padding: '14px 16px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : undefined,
              background: selected?.id === order.id ? 'var(--cream)' : 'white',
              cursor: 'pointer', transition: 'background 0.15s',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{order.shipping_name}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{order.shipping_email}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(order.created_at).toLocaleDateString('de-CH')}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{formatCHF(order.total)}</div>
              <span style={{ display: 'inline-block', fontSize: 10, padding: '3px 8px', borderRadius: 2, background: STATUS_COLOR[order.status] + '22', color: STATUS_COLOR[order.status], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
              <span style={{ color: 'var(--gray)', fontSize: 14 }}>→</span>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ border: '1px solid var(--border)', background: 'white', height: 'fit-content', position: 'sticky', top: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Bestellung</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--gray)' }}>✕</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: 10, color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Bestell-ID</div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--gray)', marginBottom: 16, wordBreak: 'break-all' }}>{selected.id}</div>

              <div style={{ fontSize: 10, color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Lieferadresse</div>
              <div style={{ fontSize: 13, marginBottom: 4, fontWeight: 500 }}>{selected.shipping_name}</div>
              <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6 }}>
                {selected.shipping_street}<br />
                {selected.shipping_zip} {selected.shipping_city}<br />
                {selected.shipping_country}
              </div>

              <div style={{ margin: '16px 0', borderTop: '1px solid var(--border)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--gray)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{formatCHF(selected.total)}</span>
              </div>

              <div style={{ fontSize: 10, color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Status ändern</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                    padding: '9px 14px', borderRadius: 2, border: `1px solid ${selected.status === s ? STATUS_COLOR[s] : 'var(--border)'}`,
                    background: selected.status === s ? STATUS_COLOR[s] + '15' : 'white',
                    color: selected.status === s ? STATUS_COLOR[s] : 'var(--gray)',
                    fontSize: 12, cursor: 'pointer', fontWeight: selected.status === s ? 700 : 400,
                    textAlign: 'left', fontFamily: 'var(--font-body)',
                  }}>
                    {selected.status === s ? '✓ ' : ''}{STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
