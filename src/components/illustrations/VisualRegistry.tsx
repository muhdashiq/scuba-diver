import type { VisualKey } from '@/types';
import { BcdDiagram, DiveComputerDiagram, RegulatorDiagram, SpgDiagram } from './EquipmentDiagrams';
import { HandSignalArt } from './HandSignals';
import { MarineArt } from './MarineArt';
import { CompassReciprocalDiagram, DiveProfileDiagram, UnsafeAscentDiagram } from './ScienceDiagrams';

/** Renders the image used by an image-based quiz question. */
export function QuizVisual({ visual, highlight, showLabels, className = 'w-full h-auto' }: { visual: VisualKey; highlight?: string; showLabels?: boolean; className?: string }) {
  const p = { highlight, showLabels, className };
  switch (visual) {
    case 'regulator-set':
      return <RegulatorDiagram {...p} />;
    case 'bcd':
      return <BcdDiagram {...p} />;
    case 'spg':
      return <SpgDiagram {...p} value={60} />;
    case 'dive-computer':
      return <DiveComputerDiagram {...p} />;
    case 'signal-ok':
      return <HandSignalArt signal="ok" className={className} />;
    case 'signal-out-of-air':
      return <HandSignalArt signal="out-of-air" className={className} />;
    case 'signal-up':
      return <HandSignalArt signal="up" className={className} />;
    case 'signal-problem':
      return <HandSignalArt signal="problem" className={className} />;
    case 'clownfish':
      return <MarineArt art="clownfish" palette={['#0891b2', '#164e63']} className={className} label="Fish illustration" />;
    case 'sea-turtle':
      return <MarineArt art="turtle" palette={['#0e7490', '#083344']} className={className} label="Marine reptile illustration" />;
    case 'manta':
      return <MarineArt art="manta" palette={['#38bdf8', '#0c4a6e']} className={className} label="Ray illustration" />;
    case 'lionfish':
      return <MarineArt art="lionfish" palette={['#0e7490', '#082f49']} className={className} label="Fish illustration" />;
    case 'dive-profile':
      return <DiveProfileDiagram {...p} />;
    case 'unsafe-ascent':
      return <UnsafeAscentDiagram {...p} />;
    case 'nav-reciprocal':
      return <CompassReciprocalDiagram {...p} />;
  }
}
