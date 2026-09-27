import type { ReactNode } from 'react';

export type IconName =
  | 'plane' | 'package' | 'anchor' | 'truck' | 'home' | 'doc' | 'clipboard'
  | 'chart' | 'user' | 'users' | 'phone' | 'mail' | 'chat' | 'clock'
  | 'calendar' | 'settings' | 'money' | 'card' | 'shield' | 'star'
  | 'check' | 'x' | 'eye' | 'pencil' | 'trash' | 'plus' | 'camera'
  | 'mapPin' | 'bell' | 'paw' | 'car' | 'sparkle' | 'key' | 'arrowRight'
  | 'lock' | 'activity' | 'layers' | 'airplane';

const PATHS: Record<IconName, ReactNode> = {
  plane: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  ),
  airplane: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  ),
  package: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="3" />
      <path d="M12 8v13" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </>
  ),
  truck: (
    <>
      <path d="M14 17V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1.5" />
      <path d="M14 17h-5.5" />
      <path d="M14 10h4l3 4v3a1 1 0 0 1-1 1h-1.5" />
      <circle cx="6.5" cy="18.5" r="2" />
      <circle cx="16.5" cy="18.5" r="2" />
    </>
  ),
  home: (
    <>
      <path d="m3 10.5 9-7.5 9 7.5" />
      <path d="M5 9.5V21h4.5v-6h5v6H19V9.5" />
    </>
  ),
  doc: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a1 1 0 0 0 1 1h4" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 16v-4M12 16V8M17 16V5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </>
  ),
  chat: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v3m0 16v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M1 12h3m16 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  money: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
  ),
  star: (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />
  ),
  check: (
    <path d="M20 6 9 17l-5-5" />
  ),
  x: (
    <path d="M18 6 6 18M6 6l12 12" />
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  pencil: (
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  plus: (
    <path d="M12 5v14M5 12h14" />
  ),
  camera: (
    <>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  mapPin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  paw: (
    <>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="15" r="2" />
      <circle cx="4" cy="8" r="2" />
      <circle cx="4" cy="15" r="2" />
      <path d="M12 11c-4.5 0-4.5 4.5-2.4 6.7.8.9 1.7 1.3 2.4 1.3s1.6-.4 2.4-1.3c2.1-2.2 2.1-6.7-2.4-6.7Z" />
    </>
  ),
  car: (
    <>
      <path d="M19 17h2a1 1 0 0 0 1-1v-3c0-.9-.7-1.7-1.5-1.9l-2.5-.6-1.7-2.4A2 2 0 0 0 14.6 7H7.4a2 2 0 0 0-1.8 1.1L4 10.9c-.8.2-1.5 1-1.5 2v3a1 1 0 0 0 1 1h2.5" />
      <circle cx="8" cy="17" r="2.2" />
      <circle cx="16" cy="17" r="2.2" />
      <path d="M10.2 17h3.6" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3Z" />
  ),
  key: (
    <>
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m10.7 12.3 9.8-9.8M15 7.5l3 3 3.5-3.5-3-3" />
    </>
  ),
  arrowRight: (
    <path d="M5 12h14m-6-7 7 7-7 7" />
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  activity: (
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  ),
  layers: (
    <>
      <path d="m12.83 2.18 8.35 4.59c.54.3.54 1.16 0 1.46l-8.35 4.59a2 2 0 0 1-1.66 0L2.82 8.23a.85.85 0 0 1 0-1.46l8.35-4.59a2 2 0 0 1 1.66 0Z" />
      <path d="m2.9 15.5 9.1 5 9.1-5" />
    </>
  ),
};

export const ICON_OPTIONS: { name: IconName; label: string }[] = [
  { name: 'plane', label: 'Plane / Air' },
  { name: 'anchor', label: 'Sea / Ship' },
  { name: 'package', label: 'Package' },
  { name: 'truck', label: 'Truck' },
  { name: 'home', label: 'Home' },
  { name: 'doc', label: 'Document' },
  { name: 'clipboard', label: 'Clipboard' },
  { name: 'chart', label: 'Chart' },
  { name: 'user', label: 'Person' },
  { name: 'users', label: 'People' },
  { name: 'phone', label: 'Phone' },
  { name: 'mail', label: 'Email' },
  { name: 'chat', label: 'Chat' },
  { name: 'clock', label: 'Clock' },
  { name: 'calendar', label: 'Calendar' },
  { name: 'settings', label: 'Settings' },
  { name: 'money', label: 'Money' },
  { name: 'card', label: 'Card' },
  { name: 'shield', label: 'Shield' },
  { name: 'star', label: 'Star' },
  { name: 'camera', label: 'Camera' },
  { name: 'mapPin', label: 'Location' },
  { name: 'bell', label: 'Bell' },
  { name: 'paw', label: 'Paw / Pet' },
  { name: 'car', label: 'Car' },
  { name: 'sparkle', label: 'Sparkle' },
  { name: 'key', label: 'Key' },
  { name: 'lock', label: 'Lock' },
  { name: 'activity', label: 'Activity' },
  { name: 'layers', label: 'Layers' },
];

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
