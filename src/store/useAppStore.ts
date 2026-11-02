import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ChecklistState, DivePlanInput, GeoLocation, QuizResult, SavedDivePlan, UnitSystem, UserProfile } from '@/types';
import { getPersistenceAdapter } from '@/services/storage/adapter';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  certification: 'open-water',
  agency: '',
  experience: 'novice',
  completedDives: 0,
  preferredLocations: [],
  createdAt: new Date(0).toISOString(),
};

export type FavoriteKind = 'lesson' | 'module' | 'specialty' | 'marine' | 'shop';

export interface Favorite {
  id: string; // unique key, e.g. "lesson:ow-03"
  kind: FavoriteKind;
  title: string;
  subtitle?: string;
  to: string;
  addedAt: string;
}

export interface AppState {
  onboarded: boolean;
  favorites: Record<string, Favorite>;
  dismissedTips: string[];
  readNotifications: string[];
  profile: UserProfile;
  units: UnitSystem;
  completedLessons: Record<string, string>; // lessonId -> ISO date completed
  quizHistory: QuizResult[];
  checklist: ChecklistState;
  checklistUpdatedAt: string | null;
  savedPlans: SavedDivePlan[];
  planDraft: DivePlanInput | null;
  lastLocation: GeoLocation | null;
  whatsappTemplate: string | null;

  updateProfile: (patch: Partial<UserProfile>) => void;
  setUnits: (u: UnitSystem) => void;
  toggleLesson: (lessonId: string, complete?: boolean) => void;
  addQuizResult: (r: QuizResult) => void;
  clearQuizHistory: () => void;
  setChecklistItem: (id: string, checked: boolean) => void;
  setChecklistItems: (ids: string[], checked: boolean) => void;
  resetChecklist: () => void;
  savePlan: (input: DivePlanInput) => SavedDivePlan;
  updatePlan: (id: string, input: DivePlanInput) => void;
  deletePlan: (id: string) => void;
  setPlanDraft: (input: DivePlanInput | null) => void;
  setLastLocation: (l: GeoLocation | null) => void;
  setWhatsappTemplate: (t: string | null) => void;
  resetAll: () => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  toggleFavorite: (f: Omit<Favorite, 'addedAt'>) => boolean;
  dismissTip: (id: string) => void;
  markNotificationsRead: (ids: string[]) => void;
}

const uid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

const initialData = {
  onboarded: false,
  favorites: {} as Record<string, Favorite>,
  dismissedTips: [] as string[],
  readNotifications: [] as string[],
  profile: DEFAULT_PROFILE,
  units: 'metric' as UnitSystem,
  completedLessons: {},
  quizHistory: [],
  checklist: {},
  checklistUpdatedAt: null,
  savedPlans: [],
  planDraft: null,
  lastLocation: null,
  whatsappTemplate: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialData,
      updateProfile: (patch) =>
        set((s) => ({
          profile: { ...s.profile, ...patch, createdAt: s.profile.createdAt === DEFAULT_PROFILE.createdAt ? new Date().toISOString() : s.profile.createdAt },
        })),
      setUnits: (units) => set({ units }),
      toggleLesson: (lessonId, complete) =>
        set((s) => {
          const next = { ...s.completedLessons };
          const shouldComplete = complete ?? !next[lessonId];
          if (shouldComplete) next[lessonId] = new Date().toISOString();
          else delete next[lessonId];
          return { completedLessons: next };
        }),
      addQuizResult: (r) => set((s) => ({ quizHistory: [r, ...s.quizHistory].slice(0, 50) })),
      clearQuizHistory: () => set({ quizHistory: [] }),
      setChecklistItem: (id, checked) => set((s) => ({ checklist: { ...s.checklist, [id]: checked }, checklistUpdatedAt: new Date().toISOString() })),
      setChecklistItems: (ids, checked) =>
        set((s) => {
          const next = { ...s.checklist };
          ids.forEach((id) => (next[id] = checked));
          return { checklist: next, checklistUpdatedAt: new Date().toISOString() };
        }),
      resetChecklist: () => set({ checklist: {}, checklistUpdatedAt: null }),
      savePlan: (input) => {
        const plan: SavedDivePlan = { id: uid(), createdAt: new Date().toISOString(), input };
        set((s) => ({ savedPlans: [plan, ...s.savedPlans].slice(0, 30) }));
        return plan;
      },
      updatePlan: (id, input) => set((s) => ({ savedPlans: s.savedPlans.map((p) => (p.id === id ? { ...p, input } : p)) })),
      deletePlan: (id) => set((s) => ({ savedPlans: s.savedPlans.filter((p) => p.id !== id) })),
      setPlanDraft: (planDraft) => set({ planDraft }),
      setLastLocation: (lastLocation) => set({ lastLocation }),
      setWhatsappTemplate: (whatsappTemplate) => set({ whatsappTemplate }),
      resetAll: () => set({ ...initialData }),
      completeOnboarding: () => set({ onboarded: true }),
      restartOnboarding: () => set({ onboarded: false }),
      toggleFavorite: (f) => {
        let added = false;
        set((s) => {
          const next = { ...s.favorites };
          if (next[f.id]) delete next[f.id];
          else {
            next[f.id] = { ...f, addedAt: new Date().toISOString() };
            added = true;
          }
          return { favorites: next };
        });
        return added;
      },
      dismissTip: (id) => set((s) => ({ dismissedTips: s.dismissedTips.includes(id) ? s.dismissedTips : [...s.dismissedTips, id] })),
      markNotificationsRead: (ids) => set((s) => ({ readNotifications: [...new Set([...s.readNotifications, ...ids])].slice(-200) })),
    }),
    {
      name: 'scubadive-state',
      version: 2,
      // v1 → v2: users who already used the app skip onboarding.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<AppState>;
        if (version < 2) {
          const used = !!state.profile?.name || Object.keys(state.completedLessons ?? {}).length > 0 || (state.quizHistory?.length ?? 0) > 0 || (state.savedPlans?.length ?? 0) > 0;
          return { ...state, onboarded: used, favorites: {}, dismissedTips: [], readNotifications: [] } as AppState;
        }
        return state as AppState;
      },
      storage: createJSONStorage(() => getPersistenceAdapter()),
      partialize: (s) => ({
        onboarded: s.onboarded,
        favorites: s.favorites,
        dismissedTips: s.dismissedTips,
        readNotifications: s.readNotifications,
        profile: s.profile,
        units: s.units,
        completedLessons: s.completedLessons,
        quizHistory: s.quizHistory,
        checklist: s.checklist,
        checklistUpdatedAt: s.checklistUpdatedAt,
        savedPlans: s.savedPlans,
        planDraft: s.planDraft,
        lastLocation: s.lastLocation,
        whatsappTemplate: s.whatsappTemplate,
      }),
    },
  ),
);

export { uid };
