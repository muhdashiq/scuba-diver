import {
  LayoutDashboard,
  GraduationCap,
  Waves,
  Mountain,
  Sparkles,
  BrainCircuit,
  ClipboardCheck,
  Route,
  CloudSun,
  Store,
  Fish,
  UserRound,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  short: string;
  icon: LucideIcon;
  group: 'main' | 'learn' | 'dive' | 'explore' | 'account';
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', short: 'Home', icon: LayoutDashboard, group: 'main' },
  { to: '/learn', label: 'Learn Scuba', short: 'Learn', icon: GraduationCap, group: 'learn' },
  { to: '/open-water', label: 'Open Water', short: 'OW', icon: Waves, group: 'learn' },
  { to: '/advanced-open-water', label: 'Advanced Open Water', short: 'AOW', icon: Mountain, group: 'learn' },
  { to: '/specialties', label: 'Specialties', short: 'Specialties', icon: Sparkles, group: 'learn' },
  { to: '/quiz', label: 'Knowledge Quiz', short: 'Quiz', icon: BrainCircuit, group: 'learn' },
  { to: '/readiness', label: 'Dive Readiness', short: 'Ready', icon: ClipboardCheck, group: 'dive' },
  { to: '/planner', label: 'Dive Planner', short: 'Plan', icon: Route, group: 'dive' },
  { to: '/weather', label: 'Weather & Conditions', short: 'Weather', icon: CloudSun, group: 'dive' },
  { to: '/dive-shops', label: 'Nearby Dive Shops', short: 'Shops', icon: Store, group: 'explore' },
  { to: '/marine-life', label: 'Marine Life Library', short: 'Marine', icon: Fish, group: 'explore' },
  { to: '/profile', label: 'My Profile', short: 'Profile', icon: UserRound, group: 'account' },
  { to: '/settings', label: 'Settings', short: 'Settings', icon: Settings, group: 'account' },
];

export const NAV_GROUP_LABELS: Record<NavItem['group'], string> = {
  main: '',
  learn: 'Learn',
  dive: 'Dive',
  explore: 'Explore',
  account: 'Account',
};

/** Items shown in the mobile bottom bar; everything else lives in the menu sheet. */
export const MOBILE_PRIMARY = ['/', '/learn', '/planner', '/weather'];
