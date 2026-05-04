'use client';

import { useState, useEffect, useMemo } from 'react';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { StatCards } from '@/components/StatCards';
import { Toolbar } from '@/components/Toolbar';
import { CardGrid } from '@/components/CardGrid';
import { DetailPanel } from '@/components/DetailPanel';
import { ShareModal } from '@/components/ShareModal';
import { AddCardModal } from '@/components/AddCardModal';
import { MobileApp } from '@/components/MobileApp';
import { Card, Collection, ViewMode, DensityMode, SEED_CARDS, SEED_COLLECTIONS } from '@/types';

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>(SEED_CARDS);
  const [collections] = useState<Collection[]>(SEED_COLLECTIONS);
  const [activeCollection, setActiveCollection] = useState('all');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [saleOnly, setSaleOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [density] = useState<DensityMode>('regular');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsWide(window.innerWidth >= 1200);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filtered = useMemo(() => cards.filter(c => {
    if (activeCollection !== 'all' && c.collection !== activeCollection) return false;
    if (filter !== 'all' && c.element !== filter) return false;
    if (saleOnly && !c.forSale) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.set.toLowerCase().includes(q) && !c.setNumber.includes(q)) return false;
    }
    return true;
  }), [cards, activeCollection, filter, saleOnly, search]);

  const selected = cards.find(c => c.id === selectedId) ?? null;

  const toggleSale = (id: string) => setCards(cs => cs.map(c => c.id === id ? { ...c, forSale: !c.forSale } : c));
  const updateCard = (id: string, patch: Partial<Card>) => setCards(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  const deleteCard = (id: string) => { setCards(cs => cs.filter(c => c.id !== id)); setSelectedId(null); };
  const addCard = (card: Card) => setCards(cs => [card, ...cs]);

  if (isMobile) {
    return (
      <>
        <MobileApp
          cards={filtered} onToggleSale={toggleSale} onSelectCard={setSelectedId}
          density={density} onOpenShare={() => setShareOpen(true)} onNewCard={() => setAddOpen(true)}
          filter={filter} setFilter={setFilter} saleOnly={saleOnly} setSaleOnly={setSaleOnly}
          collections={collections} activeCollection={activeCollection} setActiveCollection={setActiveCollection}
        />
        <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} cards={cards}/>
        <AddCardModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addCard}/>
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <TopNav onOpenShare={() => setShareOpen(true)} search={search} onSearch={setSearch}/>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isWide ? '260px 1fr' : '1fr',
        minHeight: 'calc(100vh - 62px)',
      }}>
        {isWide && (
          <Sidebar
            collections={collections} activeCollection={activeCollection}
            setActiveCollection={setActiveCollection} onNewCollection={() => {}}
          />
        )}
        <div style={{ padding: isWide ? '28px 32px' : '20px', paddingRight: selected ? 'calc(420px + 32px)' : undefined }}>
          <StatCards cards={cards}/>
          <Toolbar
            filter={filter} setFilter={setFilter}
            viewMode={viewMode} setViewMode={setViewMode}
            saleOnly={saleOnly} setSaleOnly={setSaleOnly}
            onNewCard={() => setAddOpen(true)}
          />
          <CardGrid
            cards={filtered} selectedId={selectedId}
            onSelect={id => setSelectedId(prev => prev === id ? null : id)}
            onToggleSale={toggleSale}
            viewMode={viewMode} density={density}
          />
        </div>
      </div>

      {selected && (
        <DetailPanel
          card={selected}
          onClose={() => setSelectedId(null)}
          onToggleSale={toggleSale}
          onUpdate={updateCard}
          onDelete={deleteCard}
        />
      )}

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} cards={cards}/>
      <AddCardModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addCard}/>
    </div>
  );
}
