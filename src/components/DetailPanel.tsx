'use client';

import { CreatureCard } from '@/components/CreatureCard';
import { Icon } from '@/components/ui/Icon';
import { Toggle } from '@/components/ui/Toggle';
import { Card, CONDITIONS, ELEMENT_KEYS, formatCHF } from '@/types';

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid var(--line-2)',
  borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-ui)', background: '#fff',
  color: 'var(--ink)', outline: 'none',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      {children}
    </label>
  );
}

interface DetailPanelProps {
  card: Card | null;
  onClose: () => void;
  onToggleSale: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Card>) => void;
  onDelete: (id: string) => void;
}

export function DetailPanel({ card, onClose, onToggleSale, onUpdate, onDelete }: DetailPanelProps) {
  if (!card) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 60,
      background: 'var(--cream)', borderLeft: '1px solid var(--line-2)',
      boxShadow: '-12px 0 44px rgba(26,27,46,0.12)',
      display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.35s cubic-bezier(.2,.9,.3,1.3)',
    }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-4)' }}>{card.set} · {card.setNumber}</span>
        <div style={{ flex: 1 }}/>
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, color: 'var(--ink-3)' }}>
          <Icon name="x" size={18}/>
        </button>
      </div>

      <div className="scroller" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'auto', flex: 1 }}>
        <div style={{ display: 'grid', placeItems: 'center', padding: '12px 0' }}>
          <CreatureCard card={card} width={220} height={308}/>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, letterSpacing: -0.6 }}>{card.name}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 2 }}>{card.year} · {card.condition}</div>
        </div>

        {/* Sale toggle */}
        <div style={{
          padding: '14px 16px',
          background: card.forSale ? 'linear-gradient(135deg, #E3ECFF, #C6D6F5)' : '#fff',
          border: `1px solid ${card.forSale ? 'var(--coral)' : 'var(--line-2)'}`,
          borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
              {card.forSale ? 'Steht zum Verkauf' : 'Nicht im Angebot'}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>
              {card.forSale ? 'Sichtbar auf deinem Share-Link' : 'Nur du siehst diese Karte'}
            </div>
          </div>
          <Toggle value={card.forSale} onChange={() => onToggleSale(card.id)}/>
        </div>

        {card.forSale && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-4)' }}>VERKAUFSPREIS</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-4)' }}>CHF</span>
            <input
              type="number" value={card.price}
              onChange={(e) => onUpdate(card.id, { price: Number(e.target.value) })}
              style={{ width: 90, padding: '6px 10px', border: '1px solid var(--line-2)', borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', textAlign: 'right', background: 'var(--cream)', outline: 'none' }}
            />
          </div>
        )}

        <Field label="Zustand">
          <select value={card.condition} onChange={(e) => onUpdate(card.id, { condition: e.target.value as Card['condition'] })} style={fieldStyle}>
            {CONDITIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Set"><input value={card.set} onChange={(e) => onUpdate(card.id, { set: e.target.value })} style={fieldStyle}/></Field>
          <Field label="Nummer"><input value={card.setNumber} onChange={(e) => onUpdate(card.id, { setNumber: e.target.value })} style={fieldStyle}/></Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Jahr"><input type="number" value={card.year} onChange={(e) => onUpdate(card.id, { year: Number(e.target.value) })} style={fieldStyle}/></Field>
          <Field label="Seltenheit">
            <select value={card.rarity} onChange={(e) => onUpdate(card.id, { rarity: e.target.value as Card['rarity'] })} style={fieldStyle}>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="holo">Holo</option>
            </select>
          </Field>
        </div>

        {card.price > 100 && card.forSale && (
          <div style={{ padding: '12px 14px', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10, background: 'linear-gradient(135deg, #E8F5EC, #DFF3E6)', border: '1px solid #9ED4B0' }}>
            <span style={{ color: '#2E9E67', marginTop: 2 }}><Icon name="verify" size={18}/></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#12391F' }}>Verification empfohlen</div>
              <div style={{ fontSize: 11.5, color: '#2A5B3E', marginTop: 2, lineHeight: 1.45 }}>
                Bei Karten über CHF 100 schafft eine Echtheitsprüfung Vertrauen. Flippin prüft physisch — ab CHF 10.
              </div>
              <button style={{ marginTop: 8, padding: '6px 12px', border: 'none', borderRadius: 999, background: '#2E9E67', color: '#fff', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                Verification anfragen →
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button style={{ flex: 1, padding: '10px', border: '1px solid var(--line-2)', background: '#fff', borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--ink-3)' }}>
            <Icon name="edit" size={14}/> Bearbeiten
          </button>
          <button onClick={() => { onDelete(card.id); onClose(); }} style={{ padding: '10px 14px', border: '1px solid var(--line-2)', background: '#fff', borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: '#B34A4A', display: 'grid', placeItems: 'center' }}>
            <Icon name="trash" size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}
