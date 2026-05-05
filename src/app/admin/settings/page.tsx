'use client';

import { useState } from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--border)', marginBottom: 24 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '24px 20px' }}>{children}</div>
    </div>
  );
}

function Field({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center', paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--gray)' }}>{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
  borderRadius: 2, fontSize: 13, fontFamily: 'var(--font-body)',
  color: 'var(--black)', outline: 'none', boxSizing: 'border-box',
};

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [shopName, setShopName] = useState('Flippin');
  const [shopEmail, setShopEmail] = useState('');
  const [shipping, setShipping] = useState('6.90');
  const [freeShipping, setFreeShipping] = useState('150');
  const [currency, setCurrency] = useState('CHF');

  const handleSave = () => {
    // TODO: In Supabase settings-Tabelle speichern
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 4px' }}>Einstellungen</h1>
        <p style={{ fontSize: 13, color: 'var(--gray)', margin: 0 }}>Shop-Konfiguration und Konto-Einstellungen.</p>
      </div>

      <Section title="Shop">
        <Field label="Shop-Name" sub="Wird im Browser-Tab angezeigt">
          <input style={inputStyle} value={shopName} onChange={e => setShopName(e.target.value)} />
        </Field>
        <Field label="Kontakt-E-Mail" sub="Für Bestellbestätigungen">
          <input style={inputStyle} type="email" value={shopEmail} onChange={e => setShopEmail(e.target.value)} placeholder="deine@email.ch" />
        </Field>
        <Field label="Währung" sub="Standardwährung im Shop">
          <select style={inputStyle} value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="CHF">CHF – Schweizer Franken</option>
            <option value="EUR">EUR – Euro</option>
          </select>
        </Field>
      </Section>

      <Section title="Versand">
        <Field label="Versandkosten" sub="Standardpreis pro Bestellung">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--gray)' }}>{currency}</span>
            <input style={{ ...inputStyle, paddingLeft: 40 }} type="number" step="0.01" value={shipping} onChange={e => setShipping(e.target.value)} />
          </div>
        </Field>
        <Field label="Gratis Versand ab" sub="0 = immer kostenpflichtig">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--gray)' }}>{currency}</span>
            <input style={{ ...inputStyle, paddingLeft: 40 }} type="number" step="1" value={freeShipping} onChange={e => setFreeShipping(e.target.value)} />
          </div>
        </Field>
      </Section>

      <Section title="Supabase & Datenbank">
        <div style={{ padding: '14px 16px', background: 'var(--cream)', borderRadius: 2, border: '1px solid var(--border)', fontSize: 12, color: 'var(--gray)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--black)', display: 'block', marginBottom: 4 }}>Verbunden mit Supabase</strong>
          Projekt-ID: <code style={{ fontFamily: 'monospace', background: 'white', padding: '1px 6px', borderRadius: 2 }}>nytyiyeftpsoujgpyydl</code><br />
          URL: <code style={{ fontFamily: 'monospace', background: 'white', padding: '1px 6px', borderRadius: 2 }}>https://nytyiyeftpsoujgpyydl.supabase.co</code>
        </div>
        <div style={{ marginTop: 12 }}>
          <a href="https://supabase.com/dashboard/project/nytyiyeftpsoujgpyydl" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'var(--black)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: 1 }}>
            ↗ Supabase Dashboard öffnen
          </a>
        </div>
      </Section>

      <Section title="Stripe Zahlungen">
        <div style={{ padding: '14px 16px', background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 2, fontSize: 12, color: '#7a6000', marginBottom: 16 }}>
          ⚠ Stripe ist noch nicht eingerichtet. Füge deine Keys in <code>.env.local</code> ein, um Zahlungen zu aktivieren.
        </div>
        <Field label="Publishable Key" sub="Beginnt mit pk_live_ oder pk_test_">
          <input style={inputStyle} placeholder="pk_live_…" disabled />
        </Field>
        <Field label="Secret Key" sub="Nur in .env.local, nie im Code">
          <input style={inputStyle} placeholder="sk_live_…" type="password" disabled />
        </Field>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        {saved && <span style={{ fontSize: 13, color: '#2E9E67', display: 'flex', alignItems: 'center' }}>✓ Gespeichert</span>}
        <button onClick={handleSave} style={{
          padding: '10px 28px', background: 'var(--black)', color: 'var(--white)',
          border: 'none', borderRadius: 2, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}>Speichern</button>
      </div>
    </div>
  );
}
