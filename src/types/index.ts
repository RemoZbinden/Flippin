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

export const SEED_CARDS: Card[] = [
  { id: 'c1',  name: 'Pyroshi',   element: 'feuer',   hp: 120, set: 'BASIS',    setNumber: '004/102', rarity: 'holo',   year: 2024, emblemSeed: 3, foil: true,  condition: 'Mint',      price: 340,  forSale: true,  attack: 'Flammenstoß',  dmg: '60',  collection: 'holos',   sold: true,  soldPrice: 340,  soldDate: '2026-04-10' },
  { id: 'c2',  name: 'Aquarin',   element: 'wasser',  hp: 90,  set: 'BASIS',    setNumber: '007/102', rarity: 'rare',   year: 2024, emblemSeed: 1, foil: false, condition: 'Near Mint', price: 45,   forSale: true,  attack: 'Wasserstrahl', dmg: '30',  collection: 'basis' },
  { id: 'c3',  name: 'Verdora',   element: 'pflanze', hp: 80,  set: 'DSCH',     setNumber: '012/165', rarity: 'common', year: 2023, emblemSeed: 5, foil: false, condition: 'Near Mint', price: 12,   forSale: false, attack: 'Blattwirbel',  dmg: '20',  collection: 'basis' },
  { id: 'c4',  name: 'Voltaris',  element: 'blitz',   hp: 110, set: 'NEO',      setNumber: '025/200', rarity: 'holo',   year: 2025, emblemSeed: 6, foil: true,  condition: 'Mint',      price: 820,  forSale: false, attack: 'Donnerhieb',   dmg: '70',  collection: 'holos',   sold: true,  soldPrice: 820,  soldDate: '2026-04-18' },
  { id: 'c5',  name: 'Mystara',   element: 'psycho',  hp: 100, set: 'NEO',      setNumber: '054/200', rarity: 'rare',   year: 2025, emblemSeed: 2, foil: false, condition: 'Excellent', price: 68,   forSale: false, attack: 'Traumstoß',    dmg: '40',  collection: 'holos' },
  { id: 'c6',  name: 'Nocturion', element: 'finster', hp: 130, set: 'SCHATTEN', setNumber: '003/093', rarity: 'holo',   year: 2025, emblemSeed: 4, foil: true,  condition: 'Mint',      price: 1250, forSale: true,  attack: 'Nachtklinge',  dmg: '90',  collection: 'holos' },
  { id: 'c7',  name: 'Kupferix',  element: 'metall',  hp: 140, set: 'SCHATTEN', setNumber: '078/093', rarity: 'rare',   year: 2025, emblemSeed: 0, foil: false, condition: 'Near Mint', price: 58,   forSale: true,  attack: 'Eisenprall',   dmg: '50',  collection: 'basis' },
  { id: 'c8',  name: 'Drakaryn',  element: 'drache',  hp: 160, set: 'ZENIT',    setNumber: '001/048', rarity: 'holo',   year: 2024, emblemSeed: 7, foil: true,  condition: 'Mint',      price: 2400, forSale: false, attack: 'Sturmfeuer',   dmg: '120', collection: 'holos',   sold: true,  soldPrice: 2400, soldDate: '2026-03-28' },
  { id: 'c9',  name: 'Pyroshi',   element: 'feuer',   hp: 80,  set: 'BASIS',    setNumber: '004/102', rarity: 'common', year: 2022, emblemSeed: 3, foil: false, condition: 'Good',      price: 8,    forSale: false, attack: 'Funkenflug',   dmg: '15',  collection: 'doppelt' },
  { id: 'c10', name: 'Aquarin',   element: 'wasser',  hp: 90,  set: 'BASIS',    setNumber: '007/102', rarity: 'rare',   year: 2024, emblemSeed: 1, foil: true,  condition: 'Near Mint', price: 95,   forSale: true,  attack: 'Wasserstrahl', dmg: '30',  collection: 'holos' },
  { id: 'c11', name: 'Fungori',   element: 'pflanze', hp: 70,  set: 'DSCH',     setNumber: '018/165', rarity: 'common', year: 2023, emblemSeed: 5, foil: false, condition: 'Excellent', price: 6,    forSale: false, attack: 'Sporenstaub',  dmg: '10',  collection: 'basis' },
  { id: 'c12', name: 'Elektrox',  element: 'blitz',   hp: 60,  set: 'NEO',      setNumber: '099/200', rarity: 'common', year: 2025, emblemSeed: 6, foil: false, condition: 'Played',    price: 4,    forSale: false, attack: 'Schock',       dmg: '10',  collection: 'doppelt' },
  { id: 'c13', name: 'Mystara',   element: 'psycho',  hp: 130, set: 'ZENIT',    setNumber: '011/048', rarity: 'holo',   year: 2024, emblemSeed: 2, foil: true,  condition: 'Mint',      price: 680,  forSale: true,  attack: 'Psystoß',      dmg: '80',  collection: 'holos' },
  { id: 'c14', name: 'Umbrix',    element: 'finster', hp: 90,  set: 'SCHATTEN', setNumber: '034/093', rarity: 'rare',   year: 2025, emblemSeed: 4, foil: false, condition: 'Near Mint', price: 32,   forSale: false, attack: 'Schleicher',   dmg: '35',  collection: 'basis' },
  { id: 'c15', name: 'Ferrotank', element: 'metall',  hp: 180, set: 'ZENIT',    setNumber: '023/048', rarity: 'rare',   year: 2024, emblemSeed: 0, foil: false, condition: 'Near Mint', price: 85,   forSale: true,  attack: 'Panzerstoß',   dmg: '60',  collection: 'basis' },
  { id: 'c16', name: 'Drakaryn',  element: 'drache',  hp: 120, set: 'ZENIT',    setNumber: '001/048', rarity: 'common', year: 2022, emblemSeed: 7, foil: false, condition: 'Good',      price: 22,   forSale: false, attack: 'Schwanzschlag', dmg: '40', collection: 'doppelt' },
];

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
