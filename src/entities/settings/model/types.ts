import { isLocale, type Locale } from '@/shared/i18n/locale'
import {
  isOneOf,
  KEY_SIZES,
  NAMED_KEYS,
  SWIPES,
  type KeySize,
  type NamedKeys,
  type Swipe,
} from '@/shared/lib'

export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

/** The Setup's saved switches. */
export const PRACTICE_TOGGLES = [
  'fingerNumbers',
  'namedNotes',
  'melody',
  'metronome',
  'countIn',
  'recording',
] as const
export type PracticeToggle = (typeof PRACTICE_TOGGLES)[number]
export type PracticeToggles = Readonly<Record<PracticeToggle, boolean>>
/** The Setup's saved switches: how any piece plays (the melody and the recording are a piece's own: its setup shows them). */
export const PLAYING_TOGGLES = [
  'fingerNumbers',
  'namedNotes',
  'metronome',
  'countIn',
] as const satisfies readonly PracticeToggle[]

/** How every trainer goes, whatever it asks. */
export interface TrainerSettings {
  /** A right answer moves on to the next round by itself. */
  readonly autoNext: boolean
}

/** The keyboard settings: the same on every screen, set in Settings or from the keys' rail. */
export interface KeyboardSettings {
  readonly keySize: KeySize
  readonly swipe: Swipe
  readonly namedKeys: NamedKeys
  /** The strip of all 88 keys in the rail. */
  readonly map: boolean
  /** The computer keyboard plays the keys. */
  readonly typing: boolean
}

export interface SettingsState {
  theme: Theme
  locale: Locale
  practice: PracticeToggles
  trainer: TrainerSettings
  keyboard: KeyboardSettings
}

export const DEFAULT_PRACTICE: PracticeToggles = {
  fingerNumbers: false,
  namedNotes: false,
  melody: false,
  metronome: false,
  countIn: false,
  recording: true,
}

export const DEFAULT_TRAINER: TrainerSettings = { autoNext: false }

/** A new keyboard's settings: the computer keyboard plays where the pointer is fine (a mouse, a trackpad). */
export const defaultKeyboard = (finePointer: boolean): KeyboardSettings => ({
  keySize: 'fit',
  swipe: 'scroll',
  namedKeys: 'c',
  map: false,
  typing: finePointer,
})

export const isTheme = isOneOf(THEMES)
export const isKeySize = isOneOf(KEY_SIZES)
export const isSwipe = isOneOf(SWIPES)
export const isNamedKeys = isOneOf(NAMED_KEYS)

/** The first of the browser's preferred languages the app speaks decides; English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
