'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useCart } from '@/lib/cart';
import { formatCHF } from '@/types';

const SHIPPING = 6.9;

interface FormData {
  name: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

const EMPTY: FormData = { name: '', email: '', street: '', city: '', zip: '', country: 'CH' };

function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 14px', border: '1.5px solid var(--line-2)',
          borderRadius: 8, fontSize: 14, color: 'var(--ink)', background: '#fff',
          fontFamily: 'var(--font-ui)', outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, count, clearCart } = useCart();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const grandTotal = total + SHIPPING;

  const set = (key: keyof FormData) => (v: string) => setForm(f => ({ ...f, [key]: v }));

  const valid = form.name && form.email && form.street && form.city && form.zip;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // TODO: Stripe Payment Intent erstellen → API Route → /api/checkout
    setSubmitted(true);
    clearCart();
  };

  if (count === 0 && !submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Dein Warenkorb ist leer</div>
          <Link href="/shop" style={{
            padding: '12px 28px', background: 'var(--ink)', color: 'var(--cream)',
            borderRadius: 999, textDecoration: 'none', fontSize: 14, fontWeight: 600,
          }}>Zum Shop</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 20px' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 12 }}>
            Bestellung eingegangen!
          </div>
          <p style={{ color: 'var(--ink-3)', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Danke für deine Bestellung, {form.name}! Du erhältst in Kürze eine Bestätigung an {form.email}.
          </p>
          <Link href="/shop" style={{
            padding: '12px 28px', background: 'var(--ink)', color: 'var(--cream)',
            borderRadius: 999, textDecoration: 'none', fontSize: 14, fontWeight: 600,
          }}>Weiter einkaufen</Link>
        </div>
      </div>
    );
  }

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
        <Link href="/cart" style={{ color: 'var(--ink-3)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>← Zurück zum Warenkorb</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: -0.5, margin: '0 0 32px' }}>Kasse</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Kontaktdaten</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Vollständiger Name" value={form.name} onChange={set('name')} placeholder="Max Mustermann" />
                  <Field label="E-Mail" value={form.email} onChange={set('email')} type="email" placeholder="max@example.ch" />
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Lieferadresse</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Strasse & Hausnummer" value={form.street} onChange={set('street')} placeholder="Bahnhofstrasse 1" />
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
                    <Field label="PLZ" value={form.zip} onChange={set('zip')} placeholder="8001" />
                    <Field label="Ort" value={form.city} onChange={set('city')} placeholder="Zürich" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Land
                    </label>
                    <select value={form.country} onChange={e => set('country')(e.target.value)} style={{
                      width: '100%', padding: '10px 14px', border: '1.5px solid var(--line-2)',
                      borderRadius: 8, fontSize: 14, color: 'var(--ink)', background: '#fff',
                    }}>
                      <option value="CH">Schweiz</option>
                      <option value="DE">Deutschland</option>
                      <option value="AT">Österreich</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Zahlung</div>
                {/* TODO: Stripe Elements hier einbinden */}
                <div style={{
                  padding: '20px', background: 'var(--cream-2)', borderRadius: 8,
                  border: '1.5px dashed var(--line-2)', textAlign: 'center', color: 'var(--ink-4)', fontSize: 14,
                }}>
                  🔒 Stripe-Zahlungsformular wird hier eingebunden
                  <br/><span style={{ fontSize: 12, color: 'var(--ink-5)', marginTop: 4, display: 'block' }}>Visa · Mastercard · TWINT · PostFinance</span>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div style={{
              background: '#fff', borderRadius: 14, border: '1px solid var(--line)',
              padding: '24px', position: 'sticky', top: 88,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Bestellung ({count})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {items.map(({ card }) => (
                  <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--ink-3)' }}>{card.name}</span>
                    <span style={{ fontWeight: 600 }}>{formatCHF(card.price)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-4)' }}>
                  <span>Versand</span><span>{formatCHF(SHIPPING)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{formatCHF(grandTotal)}</span>
                </div>
              </div>
              <button type="submit" disabled={!valid} style={{
                width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                cursor: valid ? 'pointer' : 'not-allowed',
                background: valid ? 'var(--ink)' : 'var(--cream-3)',
                color: valid ? 'var(--cream)' : 'var(--ink-5)',
                fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-ui)',
              }}>
                Jetzt kaufen
              </button>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--ink-5)' }}>
                🔒 SSL-verschlüsselt & sicher
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
