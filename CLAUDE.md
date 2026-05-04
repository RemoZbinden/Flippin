# Flippin – Karten Webshop

Kauf & Verkauf von Sammelkarten (Pokémon, MTG, Yu-Gi-Oh!, One Piece). **Kein Community-Feature** – nur Ankauf und Verkauf.

## Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Inline-Styles mit CSS-Variablen
- **Datenbank**: Supabase (PostgreSQL + Auth + Storage)
- **Bezahlung**: Stripe (noch zu integrieren)
- **Währung**: CHF (Schweizer Franken)

## Design-System
CSS-Variablen in `globals.css`:
| Variable | Wert | Verwendung |
|---|---|---|
| `--black` | `#0e0e0e` | Hintergrund dark, Buttons |
| `--white` | `#f5f3ef` | Seitenhintergrund |
| `--cream` | `#ece9e3` | Hover-State, Sektionen |
| `--accent` | `#c8a96e` | Gold, CTAs, Badges |
| `--gray` | `#6b6760` | Texte sekundär |
| `--border` | `#d8d4cc` | Linien, Trennungen |

**Fonts**: `--font-display` = Syne (Titel, Logo), `--font-body` = DM Sans (Fliesstext)

**Logo**: `flip` + `<span accent>pin</span>` — immer so schreiben.

## Routen
| Route | Beschreibung |
|---|---|
| `/` | Landing-Page (Hero, Highlights, Ankauf-Formular, Footer) |
| `/shop` | Produktgrid (4 Spalten), Filter-Chips, Sort |
| `/shop/[id]` | Karten-Detailseite |
| `/cart` | Warenkorb (localStorage, CartProvider) |
| `/checkout` | Kasse mit Adressformular (Stripe noch ausstehend) |
| `/dashboard` | Admin-Sammlung (intern) |

## Wichtige Dateien
- `src/types/index.ts` — Typen + SEED_CARDS (Testdaten)
- `src/lib/cart.tsx` — CartProvider + useCart Hook
- `src/lib/supabase/client.ts` — Browser-Client
- `src/lib/supabase/server.ts` — Server-Client (async cookies!)
- `supabase/migrations/001_init.sql` — DB-Schema mit RLS

## Noch zu implementieren
1. **Supabase verbinden** — `.env.local` aus `.env.local.example` anlegen
2. **Stripe einbinden** — `/api/checkout` Route + Stripe Elements in Checkout
3. **Ankauf-Formular** — Bild-Upload an Supabase Storage + E-Mail-Benachrichtigung
4. **Auth** — Login via Supabase Auth (Button in Nav bereits vorhanden)
5. **Admin** — Dashboard absichern

## Befehle
```bash
cd "FLIPPIN Website/flippin"
npm run dev    # http://localhost:3000
npm run build
```

## Hinweis
Next.js 16: `cookies()` ist async — immer `await cookies()` in Server Components.
