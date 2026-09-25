import { isOneOf } from '@/shared/lib'
import { CHORD_FAMILIES, SCALE_KINDS, type ChordFamily, type ScaleKind } from '@/shared/lib/music'

export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

export const LOCALES = ['en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

/** The Setup's saved switches. */
export const PRACTICE_TOGGLES = ['fingerNumbers', 'melody', 'metronome', 'countIn'] as const
export type PracticeToggle = (typeof PRACTICE_TOGGLES)[number]
export type PracticeToggles = Readonly<Record<PracticeToggle, boolean>>

/** The chord families and scale kinds the open-ended quiz asks about. */
export interface QuizChoice {
  readonly families: readonly ChordFamily[]
  readonly scales: readonly ScaleKind[]
}

export interface SettingsState {
  theme: Theme
  locale: Locale
  practice: PracticeToggles
  quiz: QuizChoice
}

export const DEFAULT_PRACTICE: PracticeToggles = {
  fingerNumbers: false,
  melody: false,
  metronome: false,
  countIn: false,
}

export const DEFAULT_QUIZ_CHOICE: QuizChoice = {
  families: ['sev', 'nin'],
  scales: ['major', 'natural', 'harmonic'],
}

/** The known families among `values`, each once, in table order: the one rule for a family list. */
export const canonicalFamilies = (values: readonly unknown[]): ChordFamily[] =>
  CHORD_FAMILIES.filter((family) => values.includes(family))

/** The known scale kinds among `values`, each once, in table order. */
export const canonicalScales = (values: readonly unknown[]): ScaleKind[] =>
  SCALE_KINDS.filter((kind) => values.includes(kind))

export const isTheme = isOneOf(THEMES)
export const isLocale = isOneOf(LOCALES)

/** The first of the browser's preferred languages the app speaks decides; English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
