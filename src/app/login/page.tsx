'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function Logo() {
  return (
    <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: -0.5, color: 'var(--black)', textDecoration: 'none' }}>
      flip<span style={{ color: 'var(--accent)' }}>pin</span>
    </Link>
  );
}

function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--gray)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '11px 14px', border: '1px solid var(--border)',
          borderRadius: 2, fontSize: 14, color: 'var(--black)', background: 'white',
          fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess('Bestätigungs-E-Mail gesendet! Bitte überprüfe dein Postfach.');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 48px' }}>
        <Logo />
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 64px)' }}>
        {/* Left – form */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, borderRight: '1px solid var(--border)' }}>
          <div style={{ width: '100%', maxWidth: 380 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: 36, borderBottom: '1px solid var(--border)' }}>
              {(['login', 'register'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }} style={{
                  flex: 1, padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
                  letterSpacing: 0.3,
                  color: tab === t ? 'var(--black)' : 'var(--gray)',
                  borderBottom: tab === t ? '2px solid var(--black)' : '2px solid transparent',
                  marginBottom: -1, transition: 'color 0.15s',
                }}>
                  {t === 'login' ? 'Anmelden' : 'Registrieren'}
                </button>
              ))}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 8px' }}>
              {tab === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 32 }}>
              {tab === 'login' ? 'Melde dich an, um deine Bestellungen zu sehen.' : 'Erstelle ein Konto, um Karten zu kaufen und zu verkaufen.'}
            </p>

            {error && (
              <div style={{ padding: '10px 14px', background: '#fde8e8', border: '1px solid #f5c6c6', borderRadius: 2, fontSize: 13, color: '#c0392b', marginBottom: 20 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '10px 14px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 2, fontSize: 13, color: '#2e7d32', marginBottom: 20 }}>
                {success}
              </div>
            )}

            <form onSubmit={tab === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tab === 'register' && (
                <Field label="Name" type="text" value={name} onChange={setName} placeholder="Max Mustermann" />
              )}
              <Field label="E-Mail" type="email" value={email} onChange={setEmail} placeholder="max@example.ch" />
              <Field label="Passwort" type="password" value={password} onChange={setPassword} placeholder="Mindestens 6 Zeichen" />

              {tab === 'login' && (
                <div style={{ textAlign: 'right', marginTop: -8 }}>
                  <Link href="#" style={{ fontSize: 12, color: 'var(--gray)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                    Passwort vergessen?
                  </Link>
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                marginTop: 8, padding: '12px', background: 'var(--black)', color: 'var(--white)',
                border: 'none', borderRadius: 2, cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
              }}>
                {loading ? 'Bitte warten…' : tab === 'login' ? 'Anmelden' : 'Konto erstellen'}
              </button>
            </form>

            <p style={{ marginTop: 24, fontSize: 13, color: 'var(--gray)', textAlign: 'center' }}>
              {tab === 'login' ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
              <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--black)', fontWeight: 500, fontSize: 13, textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
                {tab === 'login' ? 'Registrieren' : 'Anmelden'}
              </button>
            </p>
          </div>
        </div>

        {/* Right – decorative */}
        <div style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 64, gap: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 16 }}>
              Kauf &amp; Verkauf<br /><em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--gray)' }}>leicht gemacht.</em>
            </div>
            <p style={{ fontSize: 15, color: 'var(--gray)', lineHeight: 1.6, maxWidth: 340 }}>
              Mit einem Flippin-Konto kaufst du sicher, verfolgst deine Bestellungen und verkaufst deine Sammlung.
            </p>
          </div>
          {/* Mini trust items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
            {[['🔒', 'Sicheres Konto', 'Verschlüsselt via Supabase Auth'], ['📦', 'Bestellungen verfolgen', 'Alle Käufe auf einen Blick'], ['💳', 'Schnell bezahlen', 'Zahlungsdaten sicher gespeichert']].map(([icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'white', padding: '14px 16px', borderRadius: 2, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
