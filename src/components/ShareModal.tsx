'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Toggle } from '@/components/ui/Toggle';
import { Card } from '@/types';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  cards: Card[];
}

export function ShareModal({ open, onClose, cards }: ShareModalProps) {
  const [linkToken, setLinkToken] = useState('dein-name-7x3k');
  const [copied, setCopied] = useState(false);
  const [publicAll, setPublicAll] = useState(false);
  const saleCount = cards.filter(c => c.forSale).length;

  if (!open) return null;

  const copy = () => {
    navigator.clipboard?.writeText(`flippit.app/c/${linkToken}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const reset = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let t = 'dein-name-';
    for (let i = 0; i < 4; i++) t += chars[Math.floor(Math.random() * chars.length)];
    setLinkToken(t);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,27,46,0.45)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'grid', placeItems: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxWidth: '100%', background: 'var(--cream)', borderRadius: 22,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)', overflow: 'hidden',
        animation: 'flipIn 0.4s cubic-bezier(.2,.9,.3,1.3)',
      }}>
        <div style={{ padding: '22px 26px 14px', background: 'linear-gradient(140deg, #DCE7FA 0%, #BCCEF2 100%)', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: -0.5 }}>Deine Sammlung teilen</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{saleCount} Karten mit Verkaufs-Tag werden angezeigt.</div>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'rgba(255,255,255,0.6)', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="x" size={14}/>
          </button>
        </div>

        <div style={{ padding: '20px 26px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#fff', border: '2px solid var(--line-2)', borderRadius: 12 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-4)' }}>flippit.app/c/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{linkToken}</span>
            <div style={{ flex: 1 }}/>
            <button onClick={copy} style={{
              padding: '6px 12px', border: 'none', borderRadius: 8,
              background: copied ? 'var(--cond-mint)' : 'var(--ink)', color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {copied ? <><Icon name="check" size={12}/> Kopiert</> : <><Icon name="link" size={12}/> Kopieren</>}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button style={{ padding: '12px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <Icon name="qr" size={18}/>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>QR-Code</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>Zum Ausdrucken</div>
              </div>
            </button>
            <button onClick={reset} style={{ padding: '12px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--coral-wash)', color: 'var(--coral-ink)', display: 'grid', placeItems: 'center' }}>
                <Icon name="spark" size={18}/>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>Link zurücksetzen</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>Neuer Token, alter tot</div>
              </div>
            </button>
          </div>

          <div style={{ padding: '12px 14px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Ganze Sammlung öffentlich</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>Zeigt auch nicht-verkäufliche Karten</div>
            </div>
            <Toggle value={publicAll} onChange={() => setPublicAll(v => !v)}/>
          </div>
        </div>
      </div>
    </div>
  );
}
