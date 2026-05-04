'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

/* ─── Shared primitives ─── */
function Logo() {
  return (
    <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: -0.5, color: 'var(--black)', textDecoration: 'none' }}>
      flip<span style={{ color: 'var(--accent)' }}>pin</span>
    </Link>
  );
}

function BtnPrimary({ children, href, onClick, style }: { children: React.ReactNode; href?: string; onClick?: () => void; style?: React.CSSProperties }) {
  const s: React.CSSProperties = {
    background: 'var(--black)', color: 'var(--white)', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, letterSpacing: '0.04em',
    padding: '10px 22px', borderRadius: 2, textTransform: 'uppercase' as const,
    textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s',
    ...style,
  };
  if (href) return <Link href={href} style={s}>{children}</Link>;
  return <button onClick={onClick} style={s}>{children}</button>;
}

function BtnOutline({ children, href, onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
  const s: React.CSSProperties = {
    background: 'transparent', color: 'var(--black)', border: '1px solid var(--border)',
    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
    letterSpacing: '0.04em', padding: '10px 22px', borderRadius: 2,
    textTransform: 'uppercase' as const, textDecoration: 'none', display: 'inline-block',
  };
  if (href) return <Link href={href} style={s}>{children}</Link>;
  return <button onClick={onClick} style={s}>{children}</button>;
}

/* ─── Nav ─── */
function Nav() {
  const { count } = useCart();
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--white)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 64,
    }}>
      <Logo />
      <ul style={{ listStyle: 'none', display: 'flex', gap: 36, fontSize: 14, letterSpacing: '0.02em', margin: 0, padding: 0 }}>
        {[['Shop', '/shop'], ['Ankauf', '#ankauf'], ['Über uns', '#']].map(([label, href]) => (
          <li key={label}><Link href={href} style={{ textDecoration: 'none', color: 'var(--gray)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--black)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray)')}>{label}</Link></li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Search icon */}
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', color: 'var(--gray)' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
        {/* Cart icon */}
        <Link href="/cart" style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', color: 'var(--gray)', textDecoration: 'none' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {count > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, background: 'var(--accent)', borderRadius: '50%', fontSize: 9, fontWeight: 700, color: '#fff', display: 'grid', placeItems: 'center' }}>{count}</span>}
        </Link>
        <BtnPrimary href="/dashboard">Anmelden</BtnPrimary>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 580, borderBottom: '1px solid var(--border)' }}>
      <div style={{ padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
        <span style={{
          display: 'inline-block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--accent)', fontWeight: 500, marginBottom: 24,
          border: '1px solid var(--accent-light)', padding: '4px 12px', borderRadius: 2,
        }}>Karten · Kaufen &amp; Verkaufen</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, margin: '0 0 24px' }}>
          Dein Marktplatz<br />für <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--gray)' }}>seltene</em><br />Karten.
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--gray)', maxWidth: 400, marginBottom: 40 }}>
          Durchstöbere hunderte Singles, kaufe sicher online – oder verkaufe uns deine Sammlung. Faire Preise, schneller Versand.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <BtnPrimary href="/shop">Zum Shop</BtnPrimary>
          <BtnOutline href="#ankauf">Sammlung verkaufen</BtnOutline>
        </div>
      </div>

      {/* Card stack */}
      <div style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 48 }}>
        <div style={{ position: 'relative', width: 220, height: 310 }}>
          {[
            { emoji: '🔥', name: 'Charizard', price: 'CHF 189', bg: 'linear-gradient(135deg, #a8360a 0%, #fcb045 100%)', rot: '-6deg', tx: '-20px', ty: '10px', z: 1 },
            { emoji: '⚡', name: 'Pikachu EX', price: 'CHF 64', bg: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)', rot: '2deg', tx: '10px', ty: '-5px', z: 2 },
            { emoji: '🌟', name: 'Mewtwo GX', price: 'CHF 245', bg: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', rot: '-1deg', tx: '0', ty: '0', z: 3 },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'absolute', width: 200, height: 280, borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: 'white',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              transform: `rotate(${c.rot}) translate(${c.tx}, ${c.ty})`,
              zIndex: c.z, transition: 'transform 0.4s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${c.rot}) translate(${c.tx}, ${c.ty})`)}
            >
              <div style={{ flex: 1, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{c.emoji}</div>
              <div style={{ padding: '10px 12px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 500 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{c.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32, right: 32,
          background: 'white', border: '1px solid var(--border)', borderRadius: 4, padding: '12px 16px', fontSize: 12,
        }}>
          <strong style={{ display: 'block', fontSize: 18, fontWeight: 700, marginBottom: 2 }}>2.400+</strong>
          <span style={{ color: 'var(--gray)' }}>Karten im Shop</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Modes strip ─── */
function ModesStrip() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
      {[
        { num: '01 — Kaufen', title: 'Karten kaufen', desc: 'Wähle aus unserem gesamten Sortiment. Sicher bezahlen per Karte, PayPal oder Überweisung. Versand innerhalb von 1–2 Werktagen.', href: '/shop' },
        { num: '02 — Verkaufen', title: 'Sammlung ankaufen', desc: 'Lade Fotos deiner Karten hoch. Wir bewerten deine Sammlung und senden dir innerhalb von 24h ein unverbindliches Angebot zu.', href: '#ankauf' },
      ].map((m, i) => (
        <Link key={i} href={m.href} style={{
          padding: '48px 64px', textDecoration: 'none', color: 'inherit',
          borderRight: i === 0 ? '1px solid var(--border)' : undefined,
          display: 'block', position: 'relative', transition: 'background 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget.style.background = 'var(--cream)'); const arr = e.currentTarget.querySelector('.mode-arrow') as HTMLElement; if(arr){arr.style.background='var(--black)';arr.style.color='white';arr.style.borderColor='var(--black)';} }}
          onMouseLeave={e => { (e.currentTarget.style.background = ''); const arr = e.currentTarget.querySelector('.mode-arrow') as HTMLElement; if(arr){arr.style.background='';arr.style.color='var(--gray)';arr.style.borderColor='var(--border)';} }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 16, textTransform: 'uppercase' }}>{m.num}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: -0.5 }}>{m.title}</div>
          <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.6, maxWidth: 380 }}>{m.desc}</p>
          <div className="mode-arrow" style={{
            position: 'absolute', top: 48, right: 48, width: 40, height: 40,
            border: '1px solid var(--border)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', transition: 'all 0.2s',
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Products section (highlights) ─── */
const HIGHLIGHTS = [
  { emoji: '🌊', name: 'Blastoise Holo', set: 'Pokémon · Base Set', cond: 'Near Mint · Englisch', price: 'CHF 310', badge: 'HOT', bg: 'linear-gradient(160deg, #e8f4fd 0%, #d0e8f5 100%)' },
  { emoji: '🔥', name: 'Charizard Holo', set: 'Pokémon · Base Set', cond: 'Lightly Played · Deutsch', price: 'CHF 189', badge: 'RARE', bg: 'linear-gradient(160deg, #fdf0e8 0%, #f5d8c0 100%)' },
  { emoji: '🌿', name: 'Black Lotus', set: 'MTG · Unlimited', cond: 'Good · Englisch', price: 'CHF 2.800', badge: 'NEU', bg: 'linear-gradient(160deg, #edf8ed 0%, #c8e6c9 100%)' },
  { emoji: '⚡', name: 'Pikachu Promo', set: 'Pokémon · Jungle', cond: 'Near Mint · Japanisch', price: 'CHF 64', badge: null, bg: 'linear-gradient(160deg, #f8edf8 0%, #e1bee7 100%)' },
  { emoji: '✨', name: 'Blue Eyes White Dragon', set: 'Yu-Gi-Oh! · LOB', cond: 'Near Mint · Englisch', price: 'CHF 420', badge: 'RARE', bg: 'linear-gradient(160deg, #fff8e1 0%, #ffe082 100%)' },
  { emoji: '🧊', name: 'Time Walk', set: 'MTG · Alpha', cond: 'Good · Englisch', price: 'CHF 950', badge: null, bg: 'linear-gradient(160deg, #e8eaf6 0%, #c5cae9 100%)' },
  { emoji: '🌸', name: 'Monkey D. Luffy SP', set: 'One Piece · OP-01', cond: 'Near Mint · Japanisch', price: 'CHF 78', badge: 'NEU', bg: 'linear-gradient(160deg, #fce4ec 0%, #f8bbd0 100%)' },
  { emoji: '🌀', name: 'Lugia Holo', set: 'Pokémon · Neo Genesis', cond: 'Near Mint · Englisch', price: 'CHF 530', badge: null, bg: 'linear-gradient(160deg, #e0f7fa 0%, #b2ebf2 100%)' },
];

const BADGE_STYLE: Record<string, React.CSSProperties> = {
  HOT: { background: 'var(--black)', color: 'white' },
  RARE: { background: 'var(--accent)', color: 'white' },
  NEU: { background: 'var(--cream)', color: 'var(--gray)', border: '1px solid var(--border)' },
};

function ProductsSection() {
  return (
    <section style={{ padding: '72px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>Aktuelle Highlights</h2>
        <Link href="/shop" style={{ fontSize: 13, color: 'var(--gray)', textDecoration: 'none', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>Alle ansehen →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
        {HIGHLIGHTS.map((p, i) => (
          <Link key={i} href="/shop" style={{
            background: 'var(--white)', textDecoration: 'none', color: 'inherit',
            display: 'block', position: 'relative', overflow: 'hidden', transition: 'background 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget.style.background = 'var(--cream)'); const btn = e.currentTarget.querySelector('.product-btn') as HTMLElement; if(btn){btn.style.opacity='1';btn.style.transform='translateY(0)';} }}
            onMouseLeave={e => { (e.currentTarget.style.background = 'var(--white)'); const btn = e.currentTarget.querySelector('.product-btn') as HTMLElement; if(btn){btn.style.opacity='0';btn.style.transform='translateY(4px)';} }}
          >
            <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: p.bg, position: 'relative' }}>
              {p.badge && (
                <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, ...BADGE_STYLE[p.badge] }}>
                  {p.badge}
                </span>
              )}
              {p.emoji}
            </div>
            <div style={{ padding: '16px 20px 20px' }}>
              <div style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{p.set}</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 12 }}>{p.cond}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>{p.price}</span>
                <button className="product-btn" style={{
                  background: 'var(--black)', color: 'white', border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '8px 14px', borderRadius: 2, opacity: 0, transform: 'translateY(4px)',
                  transition: 'opacity 0.2s, transform 0.2s', fontFamily: 'var(--font-body)',
                }}>+ Warenkorb</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─── Trust bar ─── */
function TrustBar() {
  const items = [
    { icon: '🔒', title: 'Sicher bezahlen', sub: 'Karte, PayPal, Überweisung' },
    { icon: '📦', title: 'Schneller Versand', sub: '1–2 Werktage, versichert' },
    { icon: '🔍', title: 'Geprüfte Ware', sub: 'Jede Karte wird kontrolliert' },
    { icon: '💬', title: 'Persönlicher Support', sub: 'Mo–Fr, schnelle Antwort' },
  ];
  return (
    <div style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {items.map((t, i) => (
        <div key={i} style={{ padding: '32px', borderRight: i < 3 ? '1px solid var(--border)' : undefined, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 22 }}>{t.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: 'var(--gray)' }}>{t.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Ankauf section ─── */
function AnkaufSection() {
  const steps = [
    { title: 'Fotos hochladen', desc: 'Lade Bilder deiner Karten hoch – Vorder- und Rückseite, gerne auch als Übersicht.' },
    { title: 'Wir bewerten deine Sammlung', desc: 'Unser Team analysiert Zustand, Seltenheit und aktuellen Marktwert.' },
    { title: 'Angebot erhalten & entscheiden', desc: 'Du bekommst einen Kaufpreis – unverbindlich. Du entscheidest, ob du annimmst.' },
    { title: 'Einsenden & bezahlt werden', desc: 'Schick die Karten ein, wir überweisen direkt nach Eingang.' },
  ];
  return (
    <section id="ankauf" style={{
      background: 'var(--black)', color: 'var(--white)',
      padding: '80px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 80, alignItems: 'center', borderTop: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20, fontWeight: 500 }}>Ankauf</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, margin: '0 0 24px' }}>
          Wir kaufen<br />deine Sammlung.
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(245,243,239,0.6)', marginBottom: 40 }}>
          Keine Lust mehr auf deine Karten? Schick uns einfach Fotos – wir bewerten alles und machen dir innerhalb von 24 Stunden ein faires Angebot.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.08)' : undefined }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em', minWidth: 28, paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(245,243,239,0.5)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload form */}
      <div>
        <div style={{
          border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 4,
          padding: '40px 32px', textAlign: 'center', cursor: 'pointer',
          background: 'rgba(255,255,255,0.03)', marginBottom: 16,
          transition: 'border-color 0.2s, background 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--accent)'); (e.currentTarget.style.background = 'rgba(200,169,110,0.04)'); }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'); (e.currentTarget.style.background = 'rgba(255,255,255,0.03)'); }}
        >
          <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.6 }}>📷</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Sammlung hochladen</div>
          <p style={{ fontSize: 13, color: 'rgba(245,243,239,0.4)', lineHeight: 1.5, marginBottom: 24 }}>
            Lade Fotos deiner Karten hoch.<br />Einzelkarten oder ganze Sets – alles willkommen.
          </p>
          <button style={{
            background: 'var(--accent)', color: 'var(--black)', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '12px 28px', borderRadius: 2,
          }}>Bilder auswählen</button>
          <p style={{ marginTop: 16, fontSize: 11, color: 'rgba(245,243,239,0.3)', letterSpacing: '0.04em' }}>JPG, PNG, HEIC · Max. 10 MB pro Bild</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['Dein Name', 'E-Mail-Adresse'].map(p => (
            <input key={p} type={p.includes('Mail') ? 'email' : 'text'} placeholder={p} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 2, padding: '12px 16px', color: 'var(--white)',
              fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
            }} />
          ))}
          <textarea placeholder="Kurze Beschreibung (optional)" rows={3} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 2, padding: '12px 16px', color: 'var(--white)',
            fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', resize: 'vertical',
          }} />
          <button style={{
            alignSelf: 'flex-start', marginTop: 4, background: 'var(--accent)', color: 'var(--black)',
            border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '12px 28px', borderRadius: 2,
          }}>Anfrage absenden →</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const cols = [
    { title: 'Shop', links: ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Alle Kategorien'] },
    { title: 'Service', links: ['Ankauf', 'Versand & Rückgabe', 'Grading Guide', 'FAQ', 'Kontakt'] },
    { title: 'Rechtliches', links: ['Impressum', 'Datenschutz', 'AGB', 'Widerruf'] },
  ];
  return (
    <>
      <footer style={{ padding: 48, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, borderTop: '1px solid var(--border)' }}>
        <div>
          <Logo />
          <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6, maxWidth: 240, marginTop: 12 }}>
            Dein vertrauensvoller Partner für Sammelkarten – Kaufen, Verkaufen, Bewerten.
          </p>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map(l => (
                <li key={l}><Link href="#" style={{ fontSize: 13, color: 'var(--gray)', textDecoration: 'none' }}>{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
      <div style={{ padding: '20px 48px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--gray)' }}>
        <span>© 2025 Flippin. Alle Rechte vorbehalten.</span>
        <span>Made with ♥ für Kartenfreaks</span>
      </div>
    </>
  );
}

/* ─── Page ─── */
export default function LandingPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.transitionDelay = (i * 0.05) + 's';
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Nav />
      <Hero />
      <ModesStrip />
      <ProductsSection />
      <TrustBar />
      <AnkaufSection />
      <Footer />
    </div>
  );
}
