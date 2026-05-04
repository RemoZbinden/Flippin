'use client';

import { Card, Element } from '@/types';

const ELEMENTS: Record<Element, { name: string; color: string; glyph: string; wash: [string, string]; fg: string }> = {
  feuer:   { name: 'Feuer',   color: '#3D6BE8', glyph: 'flame', wash: ['#E3ECFF', '#9EBAF5'], fg: '#0B1F58' },
  wasser:  { name: 'Wasser',  color: '#3D8BE8', glyph: 'drop',  wash: ['#D7E8FF', '#9CC2FF'], fg: '#0B2A58' },
  pflanze: { name: 'Pflanze', color: '#4792C2', glyph: 'leaf',  wash: ['#DDEBF6', '#A2C7E0'], fg: '#0E2A42' },
  blitz:   { name: 'Blitz',   color: '#5AA0E8', glyph: 'bolt',  wash: ['#E1EEFC', '#ACCDEF'], fg: '#0E2E55' },
  psycho:  { name: 'Psycho',  color: '#6E7BDE', glyph: 'eye',   wash: ['#E2E6FA', '#B3BAEE'], fg: '#1A2162' },
  finster: { name: 'Finster', color: '#2D3966', glyph: 'moon',  wash: ['#D6DBEB', '#9AA4C6'], fg: '#0B1130' },
  metall:  { name: 'Metall',  color: '#8996B5', glyph: 'gear',  wash: ['#E2E7F1', '#B4BECF'], fg: '#28334D' },
  drache:  { name: 'Drache',  color: '#4F7DC4', glyph: 'wing',  wash: ['#DCE6F4', '#A6BEDE'], fg: '#122647' },
};

function r(seed: number, n: number): number {
  const x = Math.sin((seed + 1) * (n + 1) * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function CreatureEmblem({ seed = 0, color = '#3D6BE8', accent = '#fff', size = 120 }) {
  const variant = Math.floor(r(seed, 0) * 6);
  const rot = (r(seed, 1) - 0.5) * 30;

  const shapes: Record<number, React.ReactNode> = {
    0: (
      <g transform={`rotate(${rot} 60 60)`}>
        <circle cx="60" cy="60" r="34" fill={color} />
        <circle cx="60" cy="60" r="34" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 4" />
        <ellipse cx="60" cy="60" rx="52" ry="18" fill="none" stroke={color} strokeWidth="4" strokeOpacity="0.6" transform={`rotate(${r(seed,2)*60-30} 60 60)`} />
        <circle cx={60 + Math.cos(r(seed,3)*6.28)*52} cy={60 + Math.sin(r(seed,3)*6.28)*18} r="5" fill={accent} />
      </g>
    ),
    1: (
      <g transform={`rotate(${rot} 60 60)`}>
        <polygon points="60,18 98,60 60,102 22,60" fill={color} />
        <polygon points="60,18 98,60 60,60" fill={accent} opacity={0.25} />
        <polygon points="60,102 22,60 60,60" fill={accent} opacity={0.12} />
        <circle cx="60" cy="60" r="8" fill={accent} opacity={0.9} />
      </g>
    ),
    2: (
      <g transform={`rotate(${rot} 60 60)`}>
        <path d="M20 80 Q60 20 100 80" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"/>
        <path d="M30 88 Q60 48 90 88" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity={0.75}/>
        <path d="M42 94 Q60 70 78 94" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity={0.55}/>
        <circle cx="60" cy="38" r="7" fill={accent}/>
      </g>
    ),
    3: (
      <g transform={`rotate(${rot} 60 60)`}>
        {[0,1,2,3,4,5].map(i => (
          <ellipse key={i} cx="60" cy="30" rx="10" ry="22" fill={color} transform={`rotate(${i*60} 60 60)`} opacity={0.85 - i*0.05}/>
        ))}
        <circle cx="60" cy="60" r="10" fill={accent}/>
      </g>
    ),
    4: (
      <g transform={`rotate(${rot} 60 60)`}>
        {([[60,30],[30,50],[90,50],[45,80],[75,80]] as [number,number][]).map(([x,y],i) => (
          <polygon key={i}
            points={[0,60,120,180,240,300].map(a => {
              const rad = a*Math.PI/180; return `${x+Math.cos(rad)*14},${y+Math.sin(rad)*14}`;
            }).join(' ')}
            fill={i===0?accent:color} opacity={i===0?1:0.8 - i*0.08}/>
        ))}
      </g>
    ),
    5: (
      <g transform={`rotate(${rot} 60 60)`}>
        <polygon points="66,18 38,64 58,64 46,102 86,50 64,50 78,18" fill={color}/>
        <polygon points="66,18 38,64 58,64 46,102 86,50 64,50 78,18" fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="1.5"/>
      </g>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: 'block' }}>
      {shapes[variant] ?? shapes[0]}
    </svg>
  );
}

export function ElementBadge({ element, size = 22 }: { element: Element; size?: number }) {
  const el = ELEMENTS[element] ?? ELEMENTS.feuer;
  const glyphs: Record<string, React.ReactNode> = {
    flame: <path d="M11 3 C 13 7, 16 8, 16 12 C 16 15.3 13.8 17.5 11 17.5 C 8.2 17.5 6 15.3 6 12 C 6 9 8 8 9.5 6 C 10.2 5 10.6 4 11 3 Z" fill="#fff"/>,
    drop:  <path d="M11 3 C 13.5 7, 17 10, 17 13.5 C 17 16.5 14.5 18.5 11 18.5 C 7.5 18.5 5 16.5 5 13.5 C 5 10 8.5 7 11 3 Z" fill="#fff"/>,
    leaf:  <><path d="M4 16 C 4 9, 9 4, 18 4 C 18 13, 13 18, 6 18 Z" fill="#fff" fillOpacity="0.35"/><path d="M4 16 C 4 9, 9 4, 18 4 C 18 13, 13 18, 6 18 Z M 6 16 L 14 8" stroke="#fff" strokeWidth="2" fill="none"/></>,
    bolt:  <polygon points="13,3 5,12 10,12 8,18 16,9 11,9" fill="#fff"/>,
    eye:   <><ellipse cx="11" cy="11" rx="7" ry="4.5" fill="#fff"/><circle cx="11" cy="11" r="2.4" fill={el.color}/></>,
    moon:  <path d="M14 3 A 8 8 0 1 0 19 13 A 6 6 0 1 1 14 3 Z" fill="#fff"/>,
    gear:  <><circle cx="11" cy="11" r="4" fill="#fff"/>{[0,60,120,180,240,300].map(a => <rect key={a} x="9.5" y="3" width="3" height="3.5" fill="#fff" transform={`rotate(${a} 11 11)`}/>)}</>,
    wing:  <path d="M3 15 Q 9 4 19 7 Q 14 10 13 15 Q 9 13 3 15 Z" fill="#fff"/>,
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: el.color, display: 'grid', placeItems: 'center',
      boxShadow: `inset 0 -2px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)`,
      flexShrink: 0,
    }}>
      <svg width={size*0.82} height={size*0.82} viewBox="0 0 22 22">{glyphs[el.glyph]}</svg>
    </div>
  );
}

function RaritySymbol({ rarity, size = 12 }: { rarity: string; size?: number }) {
  if (rarity === 'holo') return <svg width={size} height={size} viewBox="0 0 12 12"><polygon points="6,1 7.5,4.5 11,5 8.3,7.5 9,11 6,9.2 3,11 3.7,7.5 1,5 4.5,4.5" fill="#D8B13A"/></svg>;
  if (rarity === 'rare') return <svg width={size} height={size} viewBox="0 0 12 12"><polygon points="6,1 11,10 1,10" fill="#2D2E45"/></svg>;
  return <svg width={size} height={size} viewBox="0 0 12 12"><circle cx="6" cy="6" r="4.5" fill="#6E6F85"/></svg>;
}

interface CreatureCardProps {
  card: Card;
  width?: number;
  height?: number;
  faded?: boolean;
  tilt?: number;
}

export function CreatureCard({ card, width = 170, height = 238, faded = false, tilt = 0 }: CreatureCardProps) {
  const el = ELEMENTS[card.element] ?? ELEMENTS.feuer;
  const [w1, w2] = el.wash;
  const pad = Math.max(6, width * 0.045);
  const emblemSize = Math.min(width, height) * 0.56;

  return (
    <div style={{
      width, height, borderRadius: 14, position: 'relative',
      background: `linear-gradient(160deg, ${w1} 0%, ${w2} 100%)`,
      boxShadow: 'var(--shadow-card)',
      transform: `rotate(${tilt}deg)`,
      overflow: 'hidden', fontFamily: 'var(--font-ui)',
      opacity: faded ? 0.45 : 1, flexShrink: 0,
    }}>
      {/* inner border */}
      <div style={{
        position: 'absolute', inset: 3, border: `1.5px solid ${el.fg}`, borderRadius: 11,
        background: `linear-gradient(180deg, ${w1} 0%, ${w2} 65%, ${w1} 100%)`,
        pointerEvents: 'none',
      }}/>

      {/* name + HP */}
      <div style={{
        position: 'absolute', left: pad+4, right: pad+4, top: pad+2,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4, zIndex: 2,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.max(10, width*0.082), color: el.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: -0.2 }}>
          {card.name}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.max(8, width*0.062), color: '#B34A4A', whiteSpace: 'nowrap' }}>
          HP <span style={{ fontSize: Math.max(10, width*0.085) }}>{card.hp}</span>
        </div>
      </div>

      {/* artwork */}
      <div style={{
        position: 'absolute', left: pad+4, right: pad+4, top: pad*2+14,
        height: height*0.48, borderRadius: 7,
        background: `linear-gradient(145deg, #fff 0%, ${w2} 100%)`,
        border: `1px solid ${el.fg}33`,
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        <CreatureEmblem seed={card.emblemSeed ?? 0} color={el.color} accent="#fff" size={emblemSize}/>
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(45deg, transparent 0 8px, ${el.color}08 8px 9px)`, pointerEvents: 'none' }}/>
        {card.foil && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 7,
            background: 'linear-gradient(90deg, #ffd86e44, #ff6ec744, #a0ffbd44)',
            backgroundSize: '200% 200%',
            animation: 'holoSweep 4s linear infinite',
          }}/>
        )}
      </div>

      {/* attack strip */}
      <div style={{
        position: 'absolute', left: pad+4, right: pad+4,
        top: pad*2 + 14 + height*0.48 + 4,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <ElementBadge element={card.element} size={Math.max(14, width*0.11)}/>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: Math.max(7, width*0.055), color: el.fg, letterSpacing: -0.1 }}>
          {card.attack}
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.max(8, width*0.08), color: el.fg }}>
          {card.dmg}
        </div>
      </div>

      {/* footer */}
      <div style={{
        position: 'absolute', left: pad+4, right: pad+4, bottom: pad+2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: Math.max(6, width*0.045), color: el.fg, opacity: 0.75,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: 0.5 }}>{card.set} · {card.setNumber}</span>
        <RaritySymbol rarity={card.rarity} size={Math.max(8, width*0.055)}/>
      </div>

      {/* gloss */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.18) 100%)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}
