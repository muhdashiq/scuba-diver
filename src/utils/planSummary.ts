import type { CurrentStrength, DivePlanInput, DiveType, VisibilityRange } from '@/types';
import { maximumOperatingDepth, oxygenFraction, partialPressureO2 } from './divePlanner';

export const DIVE_TYPE_LABELS: Record<DiveType, string> = {
  reef: 'Reef dive',
  shore: 'Shore dive',
  boat: 'Boat dive',
  drift: 'Drift dive',
  night: 'Night dive',
  wreck: 'Wreck dive (non-penetration)',
  deep: 'Deep dive',
  training: 'Training dive (supervised)',
};

export const CURRENT_LABELS: Record<CurrentStrength, string> = {
  none: 'None / slack',
  light: 'Light',
  moderate: 'Moderate',
  strong: 'Strong',
  unknown: 'Unknown',
};

export const VISIBILITY_LABELS: Record<VisibilityRange, string> = {
  poor: 'Poor (< 5 m)',
  moderate: 'Moderate (5–10 m)',
  good: 'Good (10–20 m)',
  excellent: 'Excellent (> 20 m)',
  unknown: 'Unknown',
};

/** Very general exposure-protection guidance; comfort varies widely between divers. */
export function exposureSuggestion(tempC: number): string {
  if (!Number.isFinite(tempC)) return 'Choose protection suited to the water temperature.';
  if (tempC < 10) return 'Cold water: a dry suit with suitable undergarments, hood and gloves is common. Use cold-water rated regulators.';
  if (tempC < 16) return 'Cool water: many divers use a dry suit or a 7 mm semi-dry/wet suit with hood and gloves.';
  if (tempC < 22) return 'Temperate water: a 5–7 mm wetsuit, often with a hood, is common.';
  if (tempC < 26) return 'Warm water: a 3–5 mm wetsuit is common; consider a hood or vest for repetitive dives.';
  return 'Tropical water: a 3 mm suit or shorty is common. Still protect against sun, stings and abrasions.';
}

export function gasConsiderations(input: DivePlanInput): string[] {
  const fO2 = oxygenFraction(input);
  const out = [
    `Cylinder: ${input.cylinderSize} L filled to ${input.startPressure} bar — verify the fill before kitting up.`,
    `Breathing gas: ${Math.round(fO2 * 100)}% O₂. ppO₂ at ${input.maxDepth} m ≈ ${partialPressureO2(fO2, input.maxDepth).toFixed(2)} bar.`,
  ];
  if (input.gas !== 'air') {
    out.push(`MOD at ppO₂ 1.4 ≈ ${maximumOperatingDepth(fO2, 1.4).toFixed(1)} m (contingency 1.6 ≈ ${maximumOperatingDepth(fO2, 1.6).toFixed(1)} m). Analyse and label the cylinder.`);
  }
  out.push(`Agree turn and ascent pressures with your buddy so you surface with at least ${input.reservePressure} bar.`);
  out.push('Carry an alternate air source and check it during the buddy check.');
  return out;
}

export function buddyConsiderations(input: DivePlanInput): string[] {
  const out: string[] = [];
  if (input.divers < 2) out.push('Plan to dive with a buddy — recreational procedures are built on the buddy system.');
  else if (input.divers === 2) out.push('Buddy pair: agree position (e.g. side by side), signals and lost-buddy procedure.');
  else out.push(`Group of ${input.divers}: split into buddy pairs or teams of three, and assign a leader per team.`);
  if (input.experience === 'novice') out.push('Consider diving with an experienced buddy or a dive professional.');
  out.push('Review hand signals, gas signals and the out-of-air procedure together.');
  out.push('Agree who navigates and how often you will check gas and depth with each other.');
  return out;
}

export function entryExitInfo(input: DivePlanInput): string[] {
  switch (input.diveType) {
    case 'shore':
      return ['Assess surf and surge at the entry point before kitting up.', 'Agree on a backup exit if conditions change.', 'Note the entry point and compass heading back to it.'];
    case 'boat':
    case 'drift':
      return ['Follow the crew’s briefing for entry (giant stride / back roll) and pick-up.', 'Deploy an SMB before surfacing if requested.', 'Stay clear of the propeller area and wait for the crew’s signal before approaching.'];
    case 'night':
      return ['Mark the exit with a light.', 'Dive the site in daylight first.', 'Agree light signals.'];
    case 'wreck':
      return ['Plan an ascent route that avoids overhead structures.', 'Use the descent line if provided.', 'Do not penetrate without wreck training.'];
    default:
      return ['Identify entry and exit points and an alternative exit.', 'Agree the route and turn-around point.', 'Know where the ascent will take place.'];
  }
}

export const EMERGENCY_REMINDERS = [
  'Know where the emergency oxygen kit and first-aid kit are, and who is trained to use them.',
  'Save local emergency numbers and your regional diving emergency hotline (e.g. DAN) before the dive.',
  'Identify the nearest medical facility and how to reach it.',
  'Agree out-of-air, lost-buddy and abort procedures.',
  'Carry surface signalling devices (SMB, whistle) and know how to use them.',
];
