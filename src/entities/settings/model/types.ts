import { isLocale, type Locale } from '@/shared/i18n/locale'
import {
  isOneOf,
  KEY_SIZES,
  NAMED_KEYS,
  OCTAVE_SHIFTS,
  PEDAL_WAYS,
  SWIPES,
  type KeySize,
  type NamedKeys,
  type OctaveShift,
  type PedalWay,
  type Swipe,
} from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { TOUCHES, type Touch } from '@/shared/lib/schedule'

export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

/** The Setup's saved switches. */
export const PRACTICE_TOGGLES = [
  'fingerNumbers',
  'namedNotes',
  'positions',
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
  'positions',
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
  /** The rail names the chord a hand holds. */
  readonly chordNames: boolean
  /** The computer keyboard plays the keys. */
  readonly typing: boolean
}

const SIDEBARS = ['open', 'collapsed'] as const
/** A laptop's sidebar: its places named, or their icons alone. */
export type Sidebar = (typeof SIDEBARS)[number]

/** How the score editor's Recorder records a take (ADR 0028). */
export interface RecorderSettings {
  /** The click goes on after the count-in, while the take records. */
  readonly click: boolean
  /** The song's tune plays under the take (spec 2026-10-09 §4.2). */
  readonly tune: boolean
}

/** The MIDI keyboard's settings (spec 2026-10-09 §3.1). */
export interface MidiSettings {
  /** The keyboard heard, by its name; null: any. */
  readonly device: string | null
  /** The app sounds the keys played on it: for a keyboard with no speaker. */
  readonly sound: boolean
  /** The app's music sounds on its speaker. */
  readonly throughPiano: boolean
  readonly octaveShift: OctaveShift
  /** How loud the app hears its velocities. */
  readonly touch: Touch
  readonly pedal: PedalWay
}

/** The Chord finder's own settings (ADR 0054), and the chords it remembers. */
export interface ChordFinderSettings {
  /** The staff keeps the chords played in turn, and so does the device; else it writes only the chord down now. */
  readonly remember: boolean
  /** The keys the chord is in, each with its numeral, shown under it. */
  readonly inKeys: boolean
  /** The chords remembered, oldest first, each its keys lowest first. */
  readonly chords: readonly (readonly Midi[])[]
}

/** The most chords the Chord finder remembers: the newest are kept. */
export const REMEMBERED_CHORDS = 24
/** The most keys a chord remembered holds: two hands'. */
export const CHORD_KEYS_MAX = 10

export interface SettingsState {
  theme: Theme
  locale: Locale
  practice: PracticeToggles
  trainer: TrainerSettings
  keyboard: KeyboardSettings
  recorder: RecorderSettings
  sidebar: Sidebar
  midi: MidiSettings
  chordFinder: ChordFinderSettings
}

export const DEFAULT_PRACTICE: PracticeToggles = {
  fingerNumbers: false,
  namedNotes: false,
  positions: false,
  melody: false,
  metronome: false,
  countIn: false,
  recording: true,
}

export const DEFAULT_TRAINER: TrainerSettings = { autoNext: false }

export const DEFAULT_RECORDER: RecorderSettings = { click: true, tune: false }

/** The owner's piano sounds itself: the app sounds no MIDI key until asked. */
export const DEFAULT_MIDI: MidiSettings = {
  device: null,
  sound: false,
  throughPiano: false,
  octaveShift: 0,
  touch: 'normal',
  pedal: 'normal',
}

/** The longest keyboard name kept: the longest the MIDI port names one. */
export { DEVICE_NAME_MAX } from '@/shared/api/midi'

export const DEFAULT_SIDEBAR: Sidebar = 'open'

/** The staff writes only the chord down now; the keys it is in are shown. */
export const DEFAULT_CHORD_FINDER: ChordFinderSettings = {
  remember: false,
  inKeys: true,
  chords: [],
}

/** A new keyboard's settings: the computer keyboard plays where the pointer is fine (a mouse, a trackpad). */
export const defaultKeyboard = (finePointer: boolean): KeyboardSettings => ({
  keySize: 'fit',
  swipe: 'scroll',
  namedKeys: 'c',
  chordNames: true,
  typing: finePointer,
})

export const isTheme = isOneOf(THEMES)
export const isKeySize = isOneOf(KEY_SIZES)
export const isSwipe = isOneOf(SWIPES)
export const isNamedKeys = isOneOf(NAMED_KEYS)
export const isSidebar = isOneOf(SIDEBARS)
export const isOctaveShift = isOneOf(OCTAVE_SHIFTS)
export const isTouch = isOneOf(TOUCHES)
export const isPedalWay = isOneOf(PEDAL_WAYS)

/** The first of the browser's preferred languages the app speaks decides; English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
