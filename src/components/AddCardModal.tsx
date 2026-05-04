'use client';

import { useState } from 'react';
import { CreatureCard } from '@/components/CreatureCard';
import { ElementBadge } from '@/components/CreatureCard';
import { Icon } from '@/components/ui/Icon';
import { Card, CONDITIONS, ELEMENT_KEYS, Element } from '@/types';

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

type Draft = Omit<Card, 'id' | 'sold' | 'soldPrice' | 'soldDate'>;

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (card: Card) => void;
}

export function AddCardModal({ open, onClose, onAdd }: AddCardModalProps) {
  const [draft, setDraft] = useState<Draft>({
    name: '', element: 'feuer', hp: 100, set: 'NEO', setNumber: '000/200',
    rarity: 'rare', year: 2025, condition: 'Near Mint', price: 50, forSale: false,
    emblemSeed: Math.floor(Math.random() * 8), foil: false, attack: 'Angriff', dmg: '30',
    collection: 'basis',
  });

  if (!open) return null;
  const update = (p: Partial<Draft>) => setDraft(d => ({ ...d, ...p }));

  const handleAdd = () => {
    onAdd({ ...draft, name: draft.name || 'Neues Creature', id: `n${Date.now()}` });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,27,46,0.45)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'grid', placeItems: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 780, maxWidth: '100%', maxHeight: '92vh', background: 'var(--cream)', borderRadius: 22,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '280px 1fr',
        animation: 'flipIn 0.4s cubic-bezier(.2,.9,.3,1.3)',
      }}>
        {/* Preview */}
        <div style={{ padding: 24, background: 'linear-gradient(160deg, var(--cream-2), var(--cream-3))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, borderRight: '1px solid var(--line-2)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--ink-4)' }}>Live-Vorschau</div>
          <CreatureCard card={{ ...draft, name: draft.name || 'Dein Creature', id: 'preview' }} width={200} height={280}/>
          <div style={{ fontSize: 11, color: 'var(--ink-5)', textAlign: 'center', lineHeight: 1.4 }}>
            Du kannst später Vorder- und Rückseite als Foto hochladen.
          </div>
        </div>

        {/* Form */}
        <div className="scroller" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: -0.4 }}>Neue Karte</div>
            <div style={{ flex: 1 }}/>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-4)' }}>
              <Icon name="x" size={18}/>
            </button>
          </div>

          <div style={{ padding: '18px 14px', border: '2px dashed var(--line-2)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, background: '#fff' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--coral-wash)', color: 'var(--coral-ink)', display: 'grid', placeItems: 'center' }}>
              <Icon name="upload" size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Bilder hochladen</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>JPG/PNG bis 10 MB · Vorder- & Rückseite</div>
            </div>
            <button style={{ padding: '6px 12px', border: '1px solid var(--line-2)', background: 'var(--cream)', borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Dateien wählen</button>
          </div>

          <Field label="Kartenname">
            <input value={draft.name} placeholder="z.B. Voltaris" onChange={e => update({ name: e.target.value })} style={fieldStyle}/>
          </Field>

          <Field label="Element">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ELEMENT_KEYS.map(k => {
                const active = draft.element === k;
                return (
                  <button key={k} onClick={() => update({ element: k })} style={{
                    padding: '6px 10px 6px 6px', borderRadius: 999,
                    background: active ? '#fff' : 'transparent',
                    border: `1px solid ${active ? 'var(--ink)' : 'var(--line-2)'}`,
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    color: active ? 'var(--ink)' : 'var(--ink-4)', textTransform: 'capitalize',
                  }}>
                    <ElementBadge element={k} size={16}/> {k}
                  </button>
                );
              })}
            </div>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Field label="HP"><input type="number" value={draft.hp} onChange={e => update({ hp: Number(e.target.value) })} style={fieldStyle}/></Field>
            <Field label="Set"><input value={draft.set} onChange={e => update({ set: e.target.value })} style={fieldStyle}/></Field>
            <Field label="Jahr"><input type="number" value={draft.year} onChange={e => update({ year: Number(e.target.value) })} style={fieldStyle}/></Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Zustand">
              <select value={draft.condition} onChange={e => update({ condition: e.target.value as Card['condition'] })} style={fieldStyle}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Seltenheit">
              <select value={draft.rarity} onChange={e => update({ rarity: e.target.value as Card['rarity'] })} style={fieldStyle}>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="holo">Holo</option>
              </select>
            </Field>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={draft.foil} onChange={e => update({ foil: e.target.checked })}/>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Holographic-Foil</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>Schillernde Oberfläche</span>
          </label>

          <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid var(--line-2)', background: 'transparent', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Abbrechen</button>
            <button onClick={handleAdd} style={{
              flex: 2, padding: '10px', border: 'none', borderRadius: 10,
              background: 'var(--coral)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(61,107,232,0.35), inset 0 -1.5px 0 rgba(0,0,0,0.15)',
            }}>
              Zur Sammlung hinzufügen →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
