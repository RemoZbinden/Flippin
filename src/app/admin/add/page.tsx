'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatCHF } from '@/types';

function Logo() {
  return (
    <Link href="/admin" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: 'var(--black)', textDecoration: 'none' }}>
      flip<span style={{ color: 'var(--accent)' }}>pin</span>
      <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--gray)', textTransform: 'uppercase' }}>Admin</span>
    </Link>
  );
}

function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--gray)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
  borderRadius: 2, fontSize: 14, color: 'var(--black)', background: 'white',
  fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box',
};

const CATEGORIES = ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Dragon Ball', 'Sonstiges'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare', 'Secret Rare', 'Full Art', 'Rainbow Rare'];
const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Played'];
const LANGUAGES = ['Deutsch', 'Englisch', 'Japanisch', 'Französisch', 'Spanisch', 'Italienisch'];

interface FormData {
  name: string;
  category: string;
  set: string;
  setNumber: string;
  rarity: string;
  condition: string;
  language: string;
  year: string;
  price: string;
  forSale: boolean;
  foil: boolean;
  description: string;
}

const EMPTY: FormData = {
  name: '', category: 'Pokémon', set: '', setNumber: '', rarity: 'Holo Rare',
  condition: 'Near Mint', language: 'Deutsch', year: String(new Date().getFullYear()),
  price: '', forSale: true, foil: false, description: '',
};

export default function AddCardPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData) => (v: string | boolean) =>
    setForm(f => ({ ...f, [key]: v }));

  const handleImage = (file: File, side: 'front' | 'back') => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    if (side === 'front') { setImageFile(file); setImagePreview(url); }
    else { setBackFile(file); setBackPreview(url); }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImage(file, 'front');
  }, []);

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const supabase = createClient();
    const { error } = await supabase.storage.from('cards').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('cards').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError('Name und Preis sind erforderlich.'); return; }
    if (!imageFile) { setError('Bitte ein Bild der Vorderseite hochladen.'); return; }
    setError(''); setLoading(true);

    try {
      const supabase = createClient();
      const slug = `${Date.now()}-${form.name.toLowerCase().replace(/\s+/g, '-')}`;

      const imageUrl = await uploadImage(imageFile, `${slug}-front.${imageFile.name.split('.').pop()}`);
      let backUrl = '';
      if (backFile) backUrl = await uploadImage(backFile, `${slug}-back.${backFile.name.split('.').pop()}`);

      const { error } = await supabase.from('cards').insert({
        name: form.name,
        category: form.category,
        set_name: form.set,
        set_number: form.setNumber,
        rarity: form.rarity.toLowerCase().replace(/\s/g, '_'),
        condition: form.condition,
        language: form.language,
        year: parseInt(form.year),
        price: parseFloat(form.price),
        for_sale: form.forSale,
        foil: form.foil,
        description: form.description,
        image_url: imageUrl,
        back_image_url: backUrl || null,
        element: 'feuer', hp: 100, attack: '', dmg: '', collection: form.category.toLowerCase(),
      });

      if (error) throw error;
      router.push('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Speichern.';
      setError(msg + ' (Supabase konfiguriert?)');
      setLoading(false);
    }
  };

  const priceNum = parseFloat(form.price) || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, background: 'var(--white)', zIndex: 50 }}>
        <Logo />
        <Link href="/admin" style={{ fontSize: 13, color: 'var(--gray)', textDecoration: 'none' }}>← Zurück zur Übersicht</Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 32px' }}>Neue Karte hinzufügen</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 32, alignItems: 'start' }}>

            {/* ─── Left: Images ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Front image upload */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Vorderseite *</div>
                <div
                  onClick={() => frontRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  style={{
                    border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 4, cursor: 'pointer', overflow: 'hidden',
                    background: dragging ? 'rgba(200,169,110,0.04)' : 'var(--cream)',
                    transition: 'border-color 0.2s, background 0.2s',
                    aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Vorschau" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.4)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
                      >
                        <span style={{ color: 'white', fontSize: 12, fontWeight: 600, opacity: 0, transition: 'opacity 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                        >Bild ändern</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 32 }}>
                      <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📷</div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Bild hochladen</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)' }}>Drag &amp; Drop oder klicken<br />JPG, PNG, HEIC · max. 10 MB</div>
                    </div>
                  )}
                  <input ref={frontRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleImage(e.target.files[0], 'front')} />
                </div>
              </div>

              {/* Back image */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rückseite (optional)</div>
                <div
                  onClick={() => backRef.current?.click()}
                  style={{
                    border: '2px dashed var(--border)', borderRadius: 4, cursor: 'pointer',
                    background: 'var(--cream)', height: 120, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', overflow: 'hidden', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {backPreview ? (
                    <img src={backPreview} alt="Rückseite" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, opacity: 0.4 }}>🔄</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 4 }}>Rückseite hochladen</div>
                    </div>
                  )}
                  <input ref={backRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleImage(e.target.files[0], 'back')} />
                </div>
              </div>

              {/* Price preview */}
              {form.name && priceNum > 0 && (
                <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 4, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Vorschau Shopkarte</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{form.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 10 }}>{form.set || 'Kein Set'} · {form.condition}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>{formatCHF(priceNum)}</span>
                    <span style={{ padding: '3px 8px', background: form.forSale ? '#e8f5e9' : 'var(--cream)', color: form.forSale ? '#2E9E67' : 'var(--gray)', fontSize: 11, fontWeight: 600, borderRadius: 2 }}>
                      {form.forSale ? '✓ Im Shop sichtbar' : 'Versteckt'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Right: Form fields ─── */}
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 4, padding: 32 }}>
              {error && (
                <div style={{ padding: '10px 14px', background: '#fde8e8', border: '1px solid #f5c6c6', borderRadius: 2, fontSize: 13, color: '#c0392b', marginBottom: 20 }}>{error}</div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <Field label="Kartenname *">
                  <input value={form.name} onChange={e => set('name')(e.target.value)} placeholder="z.B. Charizard Holo" style={inputStyle} />
                </Field>

                <Field label="Kategorie" half>
                  <select value={form.category} onChange={e => set('category')(e.target.value)} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Set / Edition" half>
                  <input value={form.set} onChange={e => set('set')(e.target.value)} placeholder="z.B. Base Set" style={inputStyle} />
                </Field>

                <Field label="Set-Nummer" half>
                  <input value={form.setNumber} onChange={e => set('setNumber')(e.target.value)} placeholder="z.B. 4/102" style={inputStyle} />
                </Field>

                <Field label="Seltenheit" half>
                  <select value={form.rarity} onChange={e => set('rarity')(e.target.value)} style={inputStyle}>
                    {RARITIES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </Field>

                <Field label="Zustand" half>
                  <select value={form.condition} onChange={e => set('condition')(e.target.value)} style={inputStyle}>
                    {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Sprache" half>
                  <select value={form.language} onChange={e => set('language')(e.target.value)} style={inputStyle}>
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>

                <Field label="Jahr" half>
                  <input type="number" value={form.year} onChange={e => set('year')(e.target.value)} min="1996" max="2030" style={inputStyle} />
                </Field>

                <Field label="Preis (CHF) *">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: 13, fontWeight: 500 }}>CHF</span>
                    <input
                      type="number" step="0.01" min="0"
                      value={form.price} onChange={e => set('price')(e.target.value)}
                      placeholder="0.00"
                      style={{ ...inputStyle, paddingLeft: 48 }}
                    />
                  </div>
                </Field>

                <Field label="Beschreibung">
                  <textarea
                    value={form.description}
                    onChange={e => set('description')(e.target.value)}
                    placeholder="Besondere Merkmale, Zustandsdetails…"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </Field>

                {/* Checkboxes */}
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12 }}>
                  {[
                    { key: 'foil', label: '✨ Holographic / Foil', sub: 'Schillernde Oberfläche' },
                    { key: 'forSale', label: '🛒 Im Shop anzeigen', sub: 'Sofort für Käufer sichtbar' },
                  ].map(cb => (
                    <label key={cb.key} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1.5px solid ${form[cb.key as keyof FormData] ? 'var(--black)' : 'var(--border)'}`, borderRadius: 2, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                      <input type="checkbox" checked={!!form[cb.key as keyof FormData]} onChange={e => set(cb.key as keyof FormData)(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--black)' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{cb.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray)' }}>{cb.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
                <Link href="/admin" style={{ padding: '12px 20px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 13, textDecoration: 'none', color: 'var(--gray)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Abbrechen</Link>
                <button type="submit" disabled={loading} style={{
                  flex: 1, padding: '12px', background: loading ? 'var(--cream)' : 'var(--black)',
                  color: loading ? 'var(--gray)' : 'var(--white)', border: 'none', borderRadius: 2,
                  fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                  transition: 'background 0.2s',
                }}>
                  {loading ? 'Wird gespeichert…' : '→ Karte speichern'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
