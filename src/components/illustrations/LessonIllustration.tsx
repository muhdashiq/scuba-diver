import {
  Anchor,
  Camera,
  Cylinder,
  Glasses,
  LifeBuoy,
  Moon,
  Search,
  Ship,
  Snowflake,
  Users,
  Waves,
  Wind,
  Shirt,
  Columns2,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react';
import type { IllustrationKey } from '@/types';
import { cn } from '@/lib/utils';
import { BcdDiagram, DiveComputerDiagram, RegulatorDiagram } from './EquipmentDiagrams';
import { BuoyancyDiagram, CompassReciprocalDiagram, DiveProfileDiagram, EqualizationDiagram, PressureVolumeDiagram, UnsafeAscentDiagram } from './ScienceDiagrams';
import { HandSignalArt } from './HandSignals';
import { MarineArt } from './MarineArt';
import { Diver } from './Diver';

const ICON_SCENES: Partial<Record<IllustrationKey, { icon: LucideIcon; from: string; to: string; caption: string }>> = {
  mask: { icon: Glasses, from: '#0891b2', to: '#082f49', caption: 'Mask & snorkel skills' },
  buddy: { icon: Users, from: '#0d9488', to: '#083344', caption: 'Buddy system' },
  night: { icon: Moon, from: '#1e1b4b', to: '#020617', caption: 'Night diving' },
  drift: { icon: Wind, from: '#0284c7', to: '#082f49', caption: 'Drift diving' },
  boat: { icon: Ship, from: '#0369a1', to: '#0c4a6e', caption: 'Boat diving' },
  camera: { icon: Camera, from: '#0e7490', to: '#164e63', caption: 'Underwater imaging' },
  search: { icon: Search, from: '#155e75', to: '#042f2e', caption: 'Search & recovery' },
  nitrox: { icon: FlaskConical, from: '#15803d', to: '#052e16', caption: 'Enriched air nitrox' },
  drysuit: { icon: Shirt, from: '#1d4ed8', to: '#172554', caption: 'Dry suit diving' },
  sidemount: { icon: Columns2, from: '#4338ca', to: '#1e1b4b', caption: 'Sidemount configuration' },
  ice: { icon: Snowflake, from: '#7dd3fc', to: '#0c4a6e', caption: 'Ice diving' },
  rescue: { icon: LifeBuoy, from: '#be123c', to: '#4c0519', caption: 'Rescue & first aid' },
  cylinder: { icon: Cylinder, from: '#ca8a04', to: '#422006', caption: 'Cylinders & gas' },
};

function IconScene({ k, compact }: { k: IllustrationKey; compact?: boolean }) {
  const scene = ICON_SCENES[k] ?? { icon: Anchor, from: '#0e7490', to: '#082f49', caption: '' };
  const Icon = scene.icon;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ background: `linear-gradient(160deg, ${scene.from}, ${scene.to})` }}>
      <Waves className="absolute -left-6 top-4 h-24 w-24 text-white/10" aria-hidden="true" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      {[18, 30, 44].map((l, i) => (
        <span key={l} className="absolute rounded-full border border-white/40 bg-white/10" style={{ left: `${l + i * 20}%`, bottom: `${12 + i * 14}%`, width: 8 + i * 4, height: 8 + i * 4 }} />
      ))}
      <div className="relative flex flex-col items-center gap-2 text-white">
        <div className="rounded-3xl bg-white/15 p-4 shadow-xl ring-1 ring-white/30 backdrop-blur">
          <Icon className={compact ? 'h-10 w-10' : 'h-14 w-14'} strokeWidth={1.6} aria-hidden="true" />
        </div>
        {!compact && scene.caption && <span className="text-sm font-semibold tracking-wide text-white/90">{scene.caption}</span>}
      </div>
    </div>
  );
}

/** Visual for lessons, modules and specialties. `compact` is for small card thumbnails. */
export function LessonIllustration({ k, className, compact }: { k: IllustrationKey; className?: string; compact?: boolean }) {
  const svgClass = 'h-full w-full object-cover';
  const labels = !compact;
  let content: JSX.Element;
  switch (k) {
    case 'regulator':
      content = <RegulatorDiagram showLabels={labels} className={svgClass} />;
      break;
    case 'bcd':
      content = <BcdDiagram showLabels={labels} className={svgClass} />;
      break;
    case 'computer':
      content = <DiveComputerDiagram showLabels={labels} className={svgClass} />;
      break;
    case 'pressure':
      content = <PressureVolumeDiagram className={svgClass} />;
      break;
    case 'equalize':
      content = <EqualizationDiagram className={svgClass} />;
      break;
    case 'buoyancy':
      content = <BuoyancyDiagram className={svgClass} />;
      break;
    case 'compass':
      content = <CompassReciprocalDiagram showLabels={labels} className={svgClass} />;
      break;
    case 'profile':
      content = <DiveProfileDiagram showLabels={labels} className={svgClass} />;
      break;
    case 'ascent':
      content = <UnsafeAscentDiagram showLabels={labels} className={svgClass} />;
      break;
    case 'signals':
      content = <HandSignalArt signal="ok" caption={labels ? 'OK?' : undefined} className={svgClass} />;
      break;
    case 'reef':
      content = <MarineArt art="coral-branching" palette={['#0e7490', '#082f49']} className={svgClass} />;
      break;
    case 'fish':
      content = <MarineArt art="butterflyfish" palette={['#0891b2', '#0c4a6e']} className={svgClass} />;
      break;
    case 'wreck':
      content = <MarineArt art="wreck" palette={['#155e75', '#020617']} className={svgClass} />;
      break;
    case 'diver':
      content = (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-cyan-600 to-sky-950 p-4">
          <Diver className="w-4/5" animate={false} />
        </div>
      );
      break;
    default:
      content = <IconScene k={k} compact={compact} />;
  }
  return <div className={cn('overflow-hidden bg-ocean-900 [&>svg]:block', className)}>{content}</div>;
}
