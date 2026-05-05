'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin',          label: 'Übersicht',    icon: '▦' },
  { href: '/admin/cards',    label: 'Karten',        icon: '🃏' },
  { href: '/admin/add',      label: 'Karte hinzufügen', icon: '+' },
  { href: '/admin/orders',   label: 'Bestellungen',  icon: '📦' },
  { href: '/admin/settings', label: 'Einstellungen', icon: '⚙' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email ?? '');
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--black)', color: 'var(--white)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: 'var(--white)', textDecoration: 'none' }}>
            flip<span style={{ color: 'var(--accent)' }}>pin</span>
          </Link>
          <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4, fontWeight: 600 }}>Admin Konsole</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(item => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 4, marginBottom: 2,
                textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400,
                background: active ? 'rgba(200,169,110,0.15)' : 'transparent',
                color: active ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: item.icon === '+' ? 18 : 14, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Shop-Link */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/shop" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            borderRadius: 4, textDecoration: 'none', fontSize: 12,
            color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 8, transition: 'all 0.15s',
          }}>
            <span>↗</span> Shop ansehen
          </Link>

          {/* User */}
          <div style={{ padding: '10px 12px', borderRadius: 4, background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Eingeloggt als</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8, wordBreak: 'break-all' }}>{userEmail}</div>
            <button onClick={handleLogout} style={{
              width: '100%', padding: '7px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2,
              color: 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer',
              fontFamily: 'var(--font-body)', letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'); (e.currentTarget.style.color = 'white'); }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'); (e.currentTarget.style.color = 'rgba(255,255,255,0.4)'); }}
            >Abmelden</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: 'var(--white)', minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
