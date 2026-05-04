'use client';

type IconName =
  | 'stack' | 'folder' | 'star' | 'copy' | 'plus' | 'search' | 'filter'
  | 'grid' | 'list' | 'tag' | 'eye' | 'share' | 'link' | 'qr' | 'check'
  | 'x' | 'chev' | 'chevd' | 'settings' | 'bell' | 'card' | 'chart'
  | 'upload' | 'image' | 'trash' | 'edit' | 'chat' | 'arrup' | 'spark' | 'verify';

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export function Icon({ name, size = 20, stroke = 'currentColor', strokeWidth = 1.8, fill = 'none' }: IconProps) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill, stroke, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  const paths: Record<IconName, React.ReactNode> = {
    stack:    <><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    folder:   <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>,
    star:     <polygon points="12,3 14.6,9.3 21.3,9.9 16.3,14.2 17.9,21 12,17.3 6.1,21 7.7,14.2 2.7,9.9 9.4,9.3"/>,
    copy:     <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></>,
    plus:     <path d="M12 5v14M5 12h14"/>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    filter:   <path d="M4 6h16M7 12h10M10 18h4"/>,
    grid:     <><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></>,
    list:     <path d="M4 6h16M4 12h16M4 18h16"/>,
    tag:      <><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.4"/></>,
    eye:      <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    share:    <><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/></>,
    link:     <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11 7"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7L13 17"/></>,
    qr:       <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2M18 14v2M14 18h2M18 18h2v-2M20 20v-2"/></>,
    check:    <path d="M4 12l5 5L20 6"/>,
    x:        <path d="M6 6l12 12M18 6L6 18"/>,
    chev:     <path d="M9 6l6 6-6 6"/>,
    chevd:    <path d="M6 9l6 6 6-6"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>,
    bell:     <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    card:     <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></>,
    chart:    <><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></>,
    upload:   <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></>,
    image:    <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="M21 16l-5-5-8 8"/></>,
    trash:    <><path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></>,
    edit:     <path d="M4 20h4l10-10-4-4L4 16v4ZM14 6l4 4"/>,
    chat:     <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>,
    arrup:    <path d="M12 19V5M5 12l7-7 7 7"/>,
    spark:    <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/>,
    verify:   <><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z"/><path d="M8 12l3 3 5-6"/></>,
  };

  return <svg {...props}>{paths[name] ?? paths.card}</svg>;
}
