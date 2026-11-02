import type {
  BreathingGas,
  CertificationLevel,
  DivePlanInput,
  GasEstimate,
  PlanMessage,
  ProfilePoint,
  ValidationResult,
} from '@/types';

/**
 * Educational dive-planning helpers.
 *
 * IMPORTANT: Nothing in this module computes decompression obligations or no-decompression
 * limits. The profile is an illustration of the plan the diver typed in; gas figures are
 * simplified ideal-gas estimates for learning purposes. Real dives must be managed with a
 * dive computer and planned according to the diver's training agency procedures.
 */

export const RECREATIONAL_DEPTH_LIMIT_M = 40;
export const SAFETY_STOP_DEPTH_M = 5;
export const SAFETY_STOP_MINUTES = 3;
export const MAX_ASCENT_RATE_M_MIN = 18; // upper bound used by several agencies; slower is preferred
export const PREFERRED_ASCENT_RATE_M_MIN = 9;

/**
 * Typical maximum depths associated with common recreational certifications.
 * These are generic educational references (they align with common PADI/SSI guidance) —
 * the diver's own agency, training and local regulations take precedence.
 */
export const CERTIFICATION_DEPTH_GUIDANCE: Record<CertificationLevel, number | null> = {
  none: null,
  'scuba-diver': 12,
  'open-water': 18,
  'advanced-open-water': 30,
  rescue: 30,
  divemaster: 40,
  instructor: 40,
};

export const CERTIFICATION_LABELS: Record<CertificationLevel, string> = {
  none: 'Not certified',
  'scuba-diver': 'Scuba Diver (supervised)',
  'open-water': 'Open Water Diver',
  'advanced-open-water': 'Advanced Open Water Diver',
  rescue: 'Rescue Diver',
  divemaster: 'Divemaster',
  instructor: 'Instructor',
};

export const GAS_LABELS: Record<BreathingGas, string> = {
  air: 'Air (21% O₂)',
  ean32: 'EANx32 (32% O₂)',
  ean36: 'EANx36 (36% O₂)',
  'custom-nitrox': 'Custom nitrox',
};

export function oxygenFraction(input: Pick<DivePlanInput, 'gas' | 'customO2'>): number {
  switch (input.gas) {
    case 'air':
      return 0.21;
    case 'ean32':
      return 0.32;
    case 'ean36':
      return 0.36;
    case 'custom-nitrox':
      return (input.customO2 ?? 32) / 100;
  }
}

/** Absolute pressure (bar) at depth in sea water, using the 10 m ≈ 1 bar approximation. */
export const ambientPressureBar = (depthM: number) => depthM / 10 + 1;

/** Maximum operating depth (m) for an O₂ fraction at a chosen ppO₂ limit. */
export const maximumOperatingDepth = (fO2: number, ppO2Limit = 1.4) =>
  Math.max(0, (ppO2Limit / fO2 - 1) * 10);

export const partialPressureO2 = (fO2: number, depthM: number) => fO2 * ambientPressureBar(depthM);

// ---------- Validation ----------

export function validateDivePlan(input: DivePlanInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  const num = (v: number) => Number.isFinite(v);

  if (!input.site.trim()) errors.site = 'Enter a dive site or location.';
  if (!num(input.maxDepth) || input.maxDepth <= 0) errors.maxDepth = 'Maximum depth must be greater than zero.';
  else if (input.maxDepth > RECREATIONAL_DEPTH_LIMIT_M)
    errors.maxDepth = `Depths beyond ${RECREATIONAL_DEPTH_LIMIT_M} m are outside recreational limits and this educational planner. Technical training and dedicated planning tools are required.`;
  if (!num(input.bottomTime) || input.bottomTime < 1) errors.bottomTime = 'Bottom time must be at least 1 minute.';
  else if (input.bottomTime > 180) errors.bottomTime = 'Bottom time looks unrealistic (over 180 minutes).';
  if (!Number.isInteger(input.divers) || input.divers < 1 || input.divers > 30) errors.divers = 'Number of divers must be between 1 and 30.';
  if (!num(input.cylinderSize) || input.cylinderSize < 3 || input.cylinderSize > 30) errors.cylinderSize = 'Cylinder size should be between 3 and 30 litres.';
  if (!num(input.startPressure) || input.startPressure < 50 || input.startPressure > 300) errors.startPressure = 'Starting pressure should be between 50 and 300 bar.';
  if (!num(input.reservePressure) || input.reservePressure < 20) errors.reservePressure = 'Reserve pressure should be at least 20 bar.';
  else if (num(input.startPressure) && input.reservePressure >= input.startPressure) errors.reservePressure = 'Reserve must be lower than the starting pressure.';
  if (!num(input.sacRate) || input.sacRate < 8 || input.sacRate > 40) errors.sacRate = 'Surface air consumption should be between 8 and 40 L/min.';
  if (!num(input.waterTemp) || input.waterTemp < -2 || input.waterTemp > 36) errors.waterTemp = 'Water temperature should be between −2 and 36 °C.';
  if (!num(input.descentRate) || input.descentRate < 3 || input.descentRate > 30) errors.descentRate = 'Descent rate should be between 3 and 30 m/min.';
  if (!num(input.ascentRate) || input.ascentRate < 3) errors.ascentRate = 'Ascent rate should be at least 3 m/min.';
  else if (input.ascentRate > MAX_ASCENT_RATE_M_MIN) errors.ascentRate = `Ascent rate must not exceed ${MAX_ASCENT_RATE_M_MIN} m/min. Slower is safer.`;
  if (input.gas === 'custom-nitrox') {
    const o2 = input.customO2 ?? NaN;
    if (!num(o2) || o2 < 22 || o2 > 40) errors.customO2 = 'Recreational nitrox blends range from 22% to 40% O₂.';
  }
  if (!input.dateTime || Number.isNaN(Date.parse(input.dateTime))) errors.dateTime = 'Choose a dive date and time.';
  if (num(input.maxDepth) && num(input.descentRate) && input.descentRate > 0 && num(input.bottomTime)) {
    const descent = input.maxDepth / input.descentRate;
    if (descent > input.bottomTime) errors.bottomTime = 'Bottom time is shorter than the time needed to descend at the chosen rate.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ---------- Profile ----------

/**
 * Build an illustrative square-ish profile from the planned inputs.
 * Bottom time is measured from leaving the surface until starting the final ascent.
 */
export function buildDiveProfile(input: Pick<DivePlanInput, 'maxDepth' | 'bottomTime' | 'descentRate' | 'ascentRate' | 'includeSafetyStop'>): ProfilePoint[] {
  const { maxDepth, bottomTime, descentRate, ascentRate } = input;
  if (!(maxDepth > 0 && bottomTime > 0 && descentRate > 0 && ascentRate > 0)) return [];
  const r = (n: number) => Math.round(n * 10) / 10;

  const descentTime = maxDepth / descentRate;
  const bottomEnd = Math.max(bottomTime, descentTime);
  const points: ProfilePoint[] = [
    { time: 0, depth: 0, phase: 'surface' },
    { time: r(descentTime), depth: maxDepth, phase: 'descent' },
    { time: r(bottomEnd), depth: maxDepth, phase: 'bottom' },
  ];

  const stop = input.includeSafetyStop && maxDepth > SAFETY_STOP_DEPTH_M;
  if (stop) {
    const toStop = (maxDepth - SAFETY_STOP_DEPTH_M) / ascentRate;
    const arriveStop = bottomEnd + toStop;
    const leaveStop = arriveStop + SAFETY_STOP_MINUTES;
    // Final 5 m: many agencies teach taking about a minute or more to surface.
    const surface = leaveStop + Math.max(1, SAFETY_STOP_DEPTH_M / ascentRate);
    points.push(
      { time: r(arriveStop), depth: SAFETY_STOP_DEPTH_M, phase: 'ascent' },
      { time: r(leaveStop), depth: SAFETY_STOP_DEPTH_M, phase: 'safety-stop' },
      { time: r(surface), depth: 0, phase: 'ascent' },
    );
  } else {
    points.push({ time: r(bottomEnd + maxDepth / ascentRate), depth: 0, phase: 'ascent' });
  }
  return points;
}

export const totalRunTime = (profile: ProfilePoint[]) => (profile.length ? profile[profile.length - 1].time : 0);

// ---------- Gas planning (educational) ----------

/**
 * Estimate gas use per phase: SAC × average ambient pressure × minutes.
 * Uses the deepest depth for the whole bottom phase (conservative) and an
 * ideal-gas approximation. This is an educational estimate only.
 */
export function estimateGas(input: Pick<DivePlanInput, 'cylinderSize' | 'startPressure' | 'reservePressure' | 'sacRate'>, profile: ProfilePoint[]): GasEstimate {
  const byPhase = new Map<string, number>();
  for (let i = 1; i < profile.length; i++) {
    const a = profile[i - 1];
    const b = profile[i];
    const minutes = b.time - a.time;
    if (minutes <= 0) continue;
    const avgDepth = (a.depth + b.depth) / 2;
    const litres = input.sacRate * ambientPressureBar(avgDepth) * minutes;
    const label =
      b.phase === 'descent' ? 'Descent' : b.phase === 'bottom' ? 'Bottom' : b.phase === 'safety-stop' ? 'Safety stop' : 'Ascent';
    byPhase.set(label, (byPhase.get(label) ?? 0) + litres);
  }
  const estimatedUseLitres = [...byPhase.values()].reduce((s, v) => s + v, 0);
  const totalGas = input.cylinderSize * input.startPressure;
  const usableGasLitres = Math.max(0, input.cylinderSize * (input.startPressure - input.reservePressure));
  const estimatedEndPressure = (totalGas - estimatedUseLitres) / input.cylinderSize;
  return {
    usableGasLitres,
    estimatedUseLitres,
    estimatedEndPressure,
    marginLitres: usableGasLitres - estimatedUseLitres,
    byPhase: [...byPhase.entries()].map(([phase, litres]) => ({ phase, litres })),
    withinReserve: estimatedUseLitres <= usableGasLitres,
  };
}

// ---------- Advisories ----------

export function getPlanAdvisories(input: DivePlanInput, gas?: GasEstimate): PlanMessage[] {
  const messages: PlanMessage[] = [];
  const guidance = CERTIFICATION_DEPTH_GUIDANCE[input.certification];

  if (input.certification === 'none') {
    messages.push({
      severity: 'warning',
      title: 'No certification selected',
      detail: 'Uncertified divers may only dive under the direct supervision of an instructor within a recognised training programme.',
    });
  } else if (guidance !== null && input.maxDepth > guidance) {
    messages.push({
      severity: 'warning',
      title: 'Depth exceeds typical training limit',
      detail: `${CERTIFICATION_LABELS[input.certification]} training commonly references a maximum of about ${guidance} m. Confirm the limits of your own agency and training, and do not exceed them without appropriate training and supervision.`,
    });
  }
  if (input.maxDepth > 30) {
    messages.push({
      severity: 'caution',
      title: 'Deep dive considerations',
      detail: 'Beyond 30 m gas consumption rises quickly, nitrogen narcosis becomes more likely and decompression limits shorten. Deep-diver training and close computer monitoring are expected.',
    });
  }
  if (input.experience === 'novice' && input.maxDepth > 18) {
    messages.push({
      severity: 'caution',
      title: 'Limited experience for this depth',
      detail: 'Consider diving with a dive professional or building experience gradually at shallower depths.',
    });
  }
  if (input.divers < 2) {
    messages.push({
      severity: 'warning',
      title: 'No buddy planned',
      detail: 'Recreational training is built on the buddy system. Solo diving requires specific training, redundant equipment and agency-approved procedures.',
    });
  }

  if (input.gas !== 'air') {
    const fO2 = oxygenFraction(input);
    const mod14 = maximumOperatingDepth(fO2, 1.4);
    messages.push({
      severity: input.maxDepth > mod14 ? 'warning' : 'info',
      title: input.maxDepth > mod14 ? 'Planned depth exceeds nitrox MOD' : 'Nitrox reminders',
      detail:
        input.maxDepth > mod14
          ? `At ${Math.round(fO2 * 100)}% O₂ the maximum operating depth at ppO₂ 1.4 is about ${mod14.toFixed(1)} m. Reduce the planned depth or choose a different blend.`
          : `Requires Enriched Air Nitrox certification. Personally analyse your cylinder, label it, and set your computer to the analysed O₂%. MOD at ppO₂ 1.4 ≈ ${mod14.toFixed(1)} m.`,
    });
  }

  if (gas && !gas.withinReserve) {
    messages.push({
      severity: 'warning',
      title: 'Estimated gas use reaches your reserve',
      detail: 'The simplified estimate suggests you would dip into your planned reserve. Shorten the dive, plan a shallower depth, or use a larger cylinder — and agree turn pressures with your buddy.',
    });
  } else if (gas && gas.marginLitres < input.cylinderSize * 20) {
    messages.push({
      severity: 'caution',
      title: 'Small gas margin',
      detail: 'Your estimated margin above reserve is small. Stress, current, cold and workload all increase gas consumption.',
    });
  }

  if (input.current === 'strong') {
    messages.push({ severity: 'warning', title: 'Strong current', detail: 'Strong current increases exertion and gas consumption. Consider postponing, choosing a sheltered site, or diving with local professionals who know the site.' });
  } else if (input.current === 'moderate') {
    messages.push({ severity: 'caution', title: 'Moderate current', detail: 'Plan to start the dive into the current, use reference lines where available, and agree on a drift/pick-up plan.' });
  } else if (input.current === 'unknown') {
    messages.push({ severity: 'caution', title: 'Current unknown', detail: 'Ask local dive operators about tides and currents. Ordinary weather forecasts do not describe underwater currents.' });
  }
  if (input.visibility === 'poor') {
    messages.push({ severity: 'caution', title: 'Poor visibility', detail: 'Stay close to your buddy, agree on lost-buddy procedures and consider a buddy line or lights.' });
  }
  if (input.waterTemp < 10) {
    messages.push({ severity: 'caution', title: 'Cold water', detail: 'Cold water calls for appropriate exposure protection (often a dry suit), cold-water-rated regulators and shorter dives.' });
  }
  if (input.diveType === 'night') {
    messages.push({ severity: 'info', title: 'Night dive', detail: 'Carry a primary and backup light, mark the exit, and review light signals. Night-diving training is recommended.' });
  }
  if (input.diveType === 'drift') {
    messages.push({ severity: 'info', title: 'Drift dive', detail: 'Carry a surface marker buoy and audible signal; agree on group procedures with the boat crew before entry.' });
  }
  if (input.diveType === 'wreck') {
    messages.push({ severity: 'info', title: 'Wreck dive', detail: 'Penetrating overhead environments requires specific wreck training. Plan for entanglement hazards and carry a cutting tool.' });
  }

  messages.push({
    severity: 'info',
    title: 'Decompression status',
    detail: 'This planner does not calculate no-decompression limits. Follow your dive computer and your agency’s tables or procedures, and stay well within them.',
  });
  return messages;
}

// ---------- Completeness ----------

const COMPLETENESS_FIELDS: { key: keyof DivePlanInput; label: string; isSet: (i: DivePlanInput) => boolean }[] = [
  { key: 'site', label: 'Dive site', isSet: (i) => i.site.trim().length > 0 },
  { key: 'latitude', label: 'Site coordinates', isSet: (i) => i.latitude !== undefined && i.longitude !== undefined },
  { key: 'certification', label: 'Certification level', isSet: (i) => i.certification !== 'none' },
  { key: 'maxDepth', label: 'Maximum depth', isSet: (i) => i.maxDepth > 0 },
  { key: 'bottomTime', label: 'Bottom time', isSet: (i) => i.bottomTime > 0 },
  { key: 'divers', label: 'Buddy team (2+)', isSet: (i) => i.divers >= 2 },
  { key: 'reservePressure', label: 'Reserve pressure', isSet: (i) => i.reservePressure > 0 },
  { key: 'current', label: 'Current conditions', isSet: (i) => i.current !== 'unknown' },
  { key: 'visibility', label: 'Visibility', isSet: (i) => i.visibility !== 'unknown' },
  { key: 'dateTime', label: 'Date & time', isSet: (i) => !!i.dateTime },
];

export function planCompleteness(input: DivePlanInput) {
  const missing = COMPLETENESS_FIELDS.filter((f) => !f.isSet(input)).map((f) => f.label);
  const done = COMPLETENESS_FIELDS.length - missing.length;
  return { done, total: COMPLETENESS_FIELDS.length, percent: Math.round((done / COMPLETENESS_FIELDS.length) * 100), missing };
}

export const DEFAULT_PLAN_INPUT: DivePlanInput = {
  site: '',
  certification: 'open-water',
  maxDepth: 18,
  bottomTime: 40,
  divers: 2,
  experience: 'intermediate',
  cylinderSize: 12,
  startPressure: 200,
  reservePressure: 50,
  gas: 'air',
  customO2: 32,
  sacRate: 20,
  waterTemp: 26,
  current: 'unknown',
  visibility: 'unknown',
  diveType: 'reef',
  dateTime: '',
  descentRate: 15,
  ascentRate: PREFERRED_ASCENT_RATE_M_MIN,
  includeSafetyStop: true,
};
