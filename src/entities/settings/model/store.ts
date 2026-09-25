import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { safeLocalStorage, savedObject } from '@/shared/lib'
import {
  DEFAULT_PRACTICE,
  DEFAULT_QUIZ_CHOICE,
  PRACTICE_TOGGLES,
  canonicalFamilies,
  canonicalScales,
  detectLocale,
  isLocale,
  isTheme,
  type PracticeToggles,
  type QuizChoice,
  type SettingsState,
} from './types'

/** Read before first paint by index.html's #theme-boot script: keep the key and shape in step. */
export const SETTINGS_STORAGE_KEY = 'pt-settings'
export const SETTINGS_VERSION = 2

export type SettingsStore = StoreApi<SettingsState>

export function createSettingsStore({
  storage = safeLocalStorage(),
  languages = navigator.languages,
}: { storage?: Storage; languages?: readonly string[] } = {}): SettingsStore {
  const initial: SettingsState = {
    theme: 'system',
    locale: detectLocale(languages),
    practice: DEFAULT_PRACTICE,
    quiz: DEFAULT_QUIZ_CHOICE,
  }
  return createStore<SettingsState>()(
    persist(() => initial, {
      name: SETTINGS_STORAGE_KEY,
      version: SETTINGS_VERSION,
      storage: createJSONStorage(() => storage),
      // Every earlier shape is sanitised field by field in `merge`, so migrating is passing it on.
      migrate: (persisted) => persisted as SettingsState,
      merge: (persisted, current) => sanitize(persisted, current),
    }),
  )
}

/** A toggle is on only when saved as true; anything else is off. */
function practiceToggles(value: unknown): PracticeToggles {
  const saved = savedObject<PracticeToggles>(value)
  return Object.fromEntries(
    PRACTICE_TOGGLES.map((toggle) => [toggle, saved[toggle] === true]),
  ) as Record<keyof PracticeToggles, boolean>
}

/** Each list keeps its known entries; a list left empty takes the default. */
function quizChoice(value: unknown): QuizChoice {
  const saved = savedObject<QuizChoice>(value)
  const families = Array.isArray(saved.families) ? canonicalFamilies(saved.families) : []
  const scales = Array.isArray(saved.scales) ? canonicalScales(saved.scales) : []
  return {
    families: families.length > 0 ? families : DEFAULT_QUIZ_CHOICE.families,
    scales: scales.length > 0 ? scales : DEFAULT_QUIZ_CHOICE.scales,
  }
}

/**
 * Stored JSON is untrusted: keep each field that is still valid, and the current value otherwise.
 * A version-1 save has no practice or quiz fields, so it gains their defaults here.
 */
function sanitize(persisted: unknown, current: SettingsState): SettingsState {
  const saved = savedObject<SettingsState>(persisted)
  return {
    theme: isTheme(saved.theme) ? saved.theme : current.theme,
    locale: isLocale(saved.locale) ? saved.locale : current.locale,
    practice: practiceToggles(saved.practice),
    quiz: quizChoice(saved.quiz),
  }
}
