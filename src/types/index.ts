export type Element = 'feuer' | 'wasser' | 'pflanze' | 'blitz' | 'psycho' | 'finster' | 'metall' | 'drache';
export type Rarity = 'common' | 'rare' | 'holo';
export type Condition = 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Played';

export interface Card {
  id: string;
  name: string;
  element: Element;
  hp: number;
  set: string;
  setNumber: string;
  rarity: Rarity;
  year: number;
  emblemSeed: number;
  foil: boolean;
  condition: Condition;
  price: number;
  forSale: boolean;
  attack: string;
  dmg: string;
  collection: string;
  sold?: boolean;
  soldPrice?: number;
  soldDate?: string;
  imageUrl?: string;
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  count: number;
  system?: boolean;
}

export type ViewMode = 'grid' | 'list';
export type DensityMode = 'compact' | 'regular' | 'comfy';

export const CONDITIONS: Condition[] = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Played'];
export const ELEMENT_KEYS: Element[] = ['feuer', 'wasser', 'pflanze', 'blitz', 'psycho', 'finster', 'metall', 'drache'];

export const DENSITY = {
  compact: { gap: 14, w: 138, h: 194 },
  regular: { gap: 20, w: 164, h: 230 },
  comfy:   { gap: 24, w: 188, h: 263 },
};

export function formatCHF(n: number): string {
  return `CHF ${n.toLocaleString('de-CH')}`;
}

export const SEED_CARDS: Card[] = [];

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  cardId: string;
  cardName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  stripePaymentIntentId?: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export const SEED_COLLECTIONS: Collection[] = [
  { id: 'all',     name: 'Alle Karten',   icon: 'stack',  count: 16, system: true },
  { id: 'basis',   name: 'Basis-Set',     icon: 'folder', count: 6 },
  { id: 'holos',   name: 'Holos & Rares', icon: 'star',   count: 7 },
  { id: 'doppelt', name: 'Doppelte',      icon: 'copy',   count: 3 },
];
