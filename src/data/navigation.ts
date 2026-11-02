import {
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  CloudSun,
  Compass,
  Fish,
  GraduationCap,
  Heart,
  History,
  House,
  Mountain,
  Route,
  Settings,
  Sparkles,
  Store,
  CircleUserRound,
  Waves,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  color: string; // icon-tile colour
}

export interface Tab extends NavItem {
  /** Secondary screens reached contextually from this tab. */
  children: NavItem[];
  /** Route prefixes that belong to this tab (for the active state). */
  match: string[];
}

export const TABS: Tab[] = [
  { to: '/', label: 'Home', icon: House, color: 'bg-primary', children: [], match: [] },
  {
    to: '/learn',
    label: 'Learn',
    icon: GraduationCap,
    color: 'bg-[#5856D6]',
    match: ['/learn', '/open-water', '/advanced-open-water', '/specialties', '/quiz'],
    children: [
      { to: '/open-water', label: 'Open Water', icon: BookOpen, color: 'bg-primary' },
      { to: '/advanced-open-water', label: 'Advanced Open Water', icon: Mountain, color: 'bg-[#5856D6]' },
      { to: '/specialties', label: 'Specialties', icon: Sparkles, color: 'bg-[#AF52DE]' },
      { to: '/quiz', label: 'Knowledge Quiz', icon: BrainCircuit, color: 'bg-[#FF9500]' },
    ],
  },
  {
    to: '/dive',
    label: 'Dive',
    icon: Waves,
    color: 'bg-teal',
    match: ['/dive', '/planner', '/readiness', '/weather'],
    children: [
      { to: '/planner', label: 'Dive Planner', icon: Route, color: 'bg-primary' },
      { to: '/readiness', label: 'Readiness Check', icon: ClipboardCheck, color: 'bg-[#34C759]' },
      { to: '/weather', label: 'Weather & Conditions', icon: CloudSun, color: 'bg-[#32ADE6]' },
    ],
  },
  {
    to: '/explore',
    label: 'Explore',
    icon: Compass,
    color: 'bg-[#FF9500]',
    match: ['/explore', '/dive-shops', '/marine-life'],
    children: [
      { to: '/dive-shops', label: 'Dive Shops', icon: Store, color: 'bg-[#FF9500]' },
      { to: '/marine-life', label: 'Marine Life', icon: Fish, color: 'bg-teal' },
    ],
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: CircleUserRound,
    color: 'bg-[#8E8E93]',
    match: ['/profile', '/settings', '/favorites', '/history'],
    children: [
      { to: '/favorites', label: 'Favourites', icon: Heart, color: 'bg-[#FF2D55]' },
      { to: '/history', label: 'History', icon: History, color: 'bg-[#5856D6]' },
      { to: '/settings', label: 'Settings', icon: Settings, color: 'bg-[#8E8E93]' },
    ],
  },
];

export function activeTab(pathname: string): Tab {
  return TABS.find((t) => t.match.some((m) => pathname === m || pathname.startsWith(`${m}/`))) ?? TABS[0];
}
