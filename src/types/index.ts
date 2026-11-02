// ---------- Shared domain types ----------

export type ThemePreference = 'light' | 'dark' | 'system';
export type UnitSystem = 'metric' | 'imperial';

export type CertificationLevel =
  | 'none'
  | 'scuba-diver'
  | 'open-water'
  | 'advanced-open-water'
  | 'rescue'
  | 'divemaster'
  | 'instructor';

export type ExperienceLevel = 'novice' | 'intermediate' | 'experienced' | 'professional';

export interface UserProfile {
  name: string;
  certification: CertificationLevel;
  agency: string;
  experience: ExperienceLevel;
  completedDives: number;
  preferredLocations: string[];
  createdAt: string;
}

// ---------- Learning ----------

export type CourseId = 'open-water' | 'advanced-open-water' | 'specialty';

export interface LessonSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface KnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type IllustrationKey =
  | 'regulator'
  | 'bcd'
  | 'pressure'
  | 'equalize'
  | 'buoyancy'
  | 'mask'
  | 'signals'
  | 'buddy'
  | 'compass'
  | 'profile'
  | 'ascent'
  | 'reef'
  | 'computer'
  | 'diver'
  | 'night'
  | 'wreck'
  | 'drift'
  | 'boat'
  | 'camera'
  | 'search'
  | 'fish'
  | 'nitrox'
  | 'drysuit'
  | 'sidemount'
  | 'ice'
  | 'rescue'
  | 'cylinder';

export interface Lesson {
  id: string;
  course: CourseId;
  order: number;
  title: string;
  summary: string;
  duration: number; // minutes
  illustration: IllustrationKey;
  objectives: string[];
  sections: LessonSection[];
  realWorld: string;
  keyTakeaways: string[];
  check: KnowledgeCheck[];
}

export interface AdventureModule {
  id: string;
  title: string;
  summary: string;
  illustration: IllustrationKey;
  theory: string[];
  equipment: string[];
  planning: string[];
  skills: string[];
  safety: string[];
  check: KnowledgeCheck[];
}

export interface Specialty {
  id: string;
  title: string;
  category: 'depth-gas' | 'environment' | 'skills' | 'equipment' | 'naturalist' | 'rescue';
  summary: string;
  illustration: IllustrationKey;
  overview: string[];
  prerequisites: string[];
  equipment: string[];
  theory: { heading: string; body: string }[];
  skills: string[];
  risks: string[];
  pathway: string[];
  check: KnowledgeCheck[];
}

// ---------- Quiz ----------

export type QuizCategory =
  | 'fundamentals'
  | 'equipment'
  | 'communication'
  | 'buoyancy'
  | 'pressure'
  | 'planning'
  | 'emergency'
  | 'marine-life'
  | 'navigation'
  | 'decompression'
  | 'environment';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuestionKind = 'multiple-choice' | 'true-false' | 'image' | 'identify-equipment' | 'scenario';

export interface QuizVisual {
  /** Key into the visual registry (SVG diagram rendered by the quiz). */
  key: VisualKey;
  /** Optional element of the diagram to highlight while asking. */
  highlight?: string;
  /** Annotations displayed after answering. */
  annotations: { label: string; detail: string }[];
}

export type VisualKey =
  | 'regulator-set'
  | 'bcd'
  | 'spg'
  | 'dive-computer'
  | 'signal-ok'
  | 'signal-out-of-air'
  | 'signal-up'
  | 'signal-problem'
  | 'clownfish'
  | 'sea-turtle'
  | 'manta'
  | 'lionfish'
  | 'dive-profile'
  | 'unsafe-ascent'
  | 'nav-reciprocal';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: Difficulty;
  kind: QuestionKind;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  visual?: QuizVisual;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number | null; // null = timed out
  correct: boolean;
  timeTakenMs: number;
}

export interface QuizResult {
  id: string;
  date: string;
  categories: QuizCategory[] | 'all';
  difficulty: Difficulty | 'mixed';
  timed: boolean;
  total: number;
  correct: number;
  percentage: number;
  answers: QuizAnswer[];
}

// ---------- Checklist ----------

export type ChecklistCategoryId = 'personal' | 'equipment' | 'buddy' | 'site';

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
  critical: boolean;
}

export interface ChecklistCategory {
  id: ChecklistCategoryId;
  title: string;
  description: string;
  items: ChecklistItem[];
}

export type ChecklistState = Record<string, boolean>;

// ---------- Dive planner ----------

export type BreathingGas = 'air' | 'ean32' | 'ean36' | 'custom-nitrox';
export type CurrentStrength = 'none' | 'light' | 'moderate' | 'strong' | 'unknown';
export type VisibilityRange = 'poor' | 'moderate' | 'good' | 'excellent' | 'unknown';
export type DiveType = 'shore' | 'boat' | 'drift' | 'night' | 'wreck' | 'deep' | 'reef' | 'training';

export interface DivePlanInput {
  site: string;
  latitude?: number;
  longitude?: number;
  certification: CertificationLevel;
  maxDepth: number; // metres (always stored metric)
  bottomTime: number; // minutes
  divers: number;
  experience: ExperienceLevel;
  cylinderSize: number; // litres water capacity
  startPressure: number; // bar
  reservePressure: number; // bar
  gas: BreathingGas;
  customO2?: number; // percent, custom nitrox
  sacRate: number; // L/min at surface
  waterTemp: number; // °C
  current: CurrentStrength;
  visibility: VisibilityRange;
  diveType: DiveType;
  dateTime: string; // ISO local
  descentRate: number; // m/min
  ascentRate: number; // m/min
  includeSafetyStop: boolean;
}

export interface SavedDivePlan {
  id: string;
  createdAt: string;
  input: DivePlanInput;
}

export type Severity = 'info' | 'caution' | 'warning';

export interface PlanMessage {
  severity: Severity;
  title: string;
  detail: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof DivePlanInput, string>>;
}

export interface ProfilePoint {
  time: number; // minutes
  depth: number; // metres
  phase: 'surface' | 'descent' | 'bottom' | 'ascent' | 'safety-stop';
}

export interface GasEstimate {
  usableGasLitres: number;
  estimatedUseLitres: number;
  estimatedEndPressure: number;
  marginLitres: number;
  byPhase: { phase: string; litres: number }[];
  withinReserve: boolean;
}

// ---------- Weather ----------

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGusts: number; // km/h
  cloudCover: number; // %
  precipitation: number; // mm
  weatherCode: number;
  isDay: boolean;
  visibility?: number; // metres (atmospheric)
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  precipitationProbability: number | null;
  windSpeed: number;
  windGusts: number;
  weatherCode: number;
  waveHeight?: number | null;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number | null;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number | null;
  waveHeightMax?: number | null;
}

export interface MarineConditions {
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  swellWaveHeight: number | null;
  seaSurfaceTemperature: number | null;
}

export interface WeatherBundle {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  marine: MarineConditions | null;
  marineError?: string;
  fetchedAt: string;
  sources: string[];
}

export type ConditionRating = 'favorable' | 'caution' | 'unfavorable' | 'unknown';

export interface ConditionAssessment {
  factor: string;
  value: string;
  rating: ConditionRating;
  explanation: string;
}

// ---------- Dive shops ----------

export interface DiveShop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  openingHours?: string;
  image?: string;
  osmUrl: string;
  tags: string[];
}

// ---------- Marine life ----------

export type MarineGroup =
  | 'tropical-fish'
  | 'sharks-rays'
  | 'turtles'
  | 'coral'
  | 'nudibranchs'
  | 'seahorses'
  | 'crustaceans'
  | 'wrecks'
  | 'environments';

export interface MarineEntry {
  id: string;
  group: MarineGroup;
  commonName: string;
  scientificName?: string;
  habitat: string;
  identification: string[];
  facts: string[];
  conservation: string;
  iucn?: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'DD' | 'NE';
  art: MarineArtKey;
  palette: [string, string];
}

export type MarineArtKey =
  | 'clownfish'
  | 'angelfish'
  | 'butterflyfish'
  | 'parrotfish'
  | 'lionfish'
  | 'moorish-idol'
  | 'reef-shark'
  | 'whale-shark'
  | 'manta'
  | 'stingray'
  | 'turtle'
  | 'coral-branching'
  | 'coral-brain'
  | 'coral-fan'
  | 'nudibranch'
  | 'seahorse'
  | 'lobster'
  | 'shrimp'
  | 'crab'
  | 'wreck'
  | 'kelp'
  | 'cave'
  | 'seagrass';
