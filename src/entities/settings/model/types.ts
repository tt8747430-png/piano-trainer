import { isLocale, type Locale } from '@/shared/i18n/locale'
import {
  isOneOf,
  KEY_DOCKS,
  KEY_LENGTHS,
  KEY_SIZES,
  NAMED_KEYS,
  OCTAVE_SHIFTS,
  PEDAL_WAYS,
  RAIL_CONTROLS,
  SWIPES,
  type KeyDock,
  type SheetView,
  type KeyLength,
  type KeySize,
  type NamedKeys,
  type OctaveShift,
  type PedalWay,
  type RailControl,
  type Swipe,
} from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { TOUCHES, type Touch } from '@/shared/lib/schedule'

export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

export const TITLE_SIZES = ['large', 'small'] as const
/** How large a screen's title is: large, or small, leaving the page more of the screen. */
export type TitleSize = (typeof TITLE_SIZES)[number]

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
/**
 * The Setup's saved switches: how any piece plays (the melody and the recording are a piece's own: its
 * setup shows them). What the sheet shows (finger numbers, named notes) is the View menu's alone.
 */
export const PLAYING_TOGGLES = [
  'positions',
  'metronome',
  'countIn',
] as const satisfies readonly PracticeToggle[]

/** How every trainer goes, whatever it asks. */
export interface TrainerSettings {
  /** A right answer moves on to the next round by itself. */
  readonly autoNext: boolean
}

/** How every lesson shows its examples. */
/** Where a screen's floating actions stand along its foot (ADR 0058). */
export const FLOATING_PLACES = ['left', 'center', 'right'] as const
export type FloatingPlace = (typeof FLOATING_PLACES)[number]
export const isFloatingPlace = (value: unknown): value is FloatingPlace =>
  FLOATING_PLACES.includes(value as FloatingPlace)

/** A screen's floating actions: where they stand, and whether each says its name beside its icon. */
export interface FloatingSettings {
  readonly place: FloatingPlace
  readonly labels: boolean
}

/** The keyboard settings: the same on every screen, set in Settings or from the keys' rail. */
export interface KeyboardSettings {
  readonly keySize: KeySize
  readonly swipe: Swipe
  readonly namedKeys: NamedKeys
  /** A key a page marks (a chord's, a scale's) names its note under its degree. */
  readonly markNotes: boolean
  /** The rail names the chord a hand holds. */
  readonly chordNames: boolean
  /** The computer keyboard plays the keys. */
  readonly typing: boolean
  /** Where a page's keys stay while it scrolls. */
  readonly dock: KeyDock
  /** A page's keys folded away to a button that brings them back. */
  readonly folded: boolean
  /**
   * On a phone on its side, a reading page's keys (a lesson's, an explorer's, a song's) folded away,
   * apart from `folded`: the screen is too short for the page and the keys both (ADR 0062).
   */
  readonly foldedLandscape: boolean
  readonly keyLength: KeyLength
  /** The controls the keys' rail holds, in its order. */
  readonly railControls: readonly RailControl[]
}

/** The side of the sheet the score editor's palette stands on, where it stands beside it (ADR 0071). */
export const PALETTE_SIDES = ['right', 'left'] as const
export type PaletteSide = (typeof PALETTE_SIDES)[number]

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
  /** An inversion named over its bass (`C/E`); else by its root alone (`C`), its inversion said. */
  readonly slash: boolean
  /** The chords remembered, oldest first, each its keys lowest first. */
  readonly chords: readonly (readonly Midi[])[]
}

/** The most sections kept folded, and the longest id one has. */
export const FOLDED_MAX = 100
export const SECTION_ID_MAX = 64

/** The most chords the Chord finder remembers: the newest are kept. */
export const REMEMBERED_CHORDS = 24
/** The most keys a chord remembered holds: two hands'. */
export const CHORD_KEYS_MAX = 10

/**
 * How the Player shows a score (ADR 0064, Soundslice's view settings): laid out as one line across,
 * lines down the screen or A4 pages; the score itself, or only the keys; the chord names; the tune on
 * its own staff; the staves hidden; and the keys, or the score alone.
 */
export interface ScoreViewSettings {
  readonly layout: SheetView
  readonly notation: boolean
  readonly chordNames: boolean
  readonly melodyStaff: boolean
  readonly hidden: readonly StaffId[]
  /** The keys under the score: off, the score has the screen. */
  readonly keys: boolean
}

/** As the Player was: one line across, every staff, the chord names, the tune on its staff. */
export const DEFAULT_SCORE_VIEW: ScoreViewSettings = {
  layout: 'horizontal',
  notation: true,
  chordNames: true,
  melodyStaff: true,
  hidden: [],
  keys: true,
}

export interface SettingsState {
  theme: Theme
  titles: TitleSize
  locale: Locale
  practice: PracticeToggles
  trainer: TrainerSettings
  floating: FloatingSettings
  keyboard: KeyboardSettings
  recorder: RecorderSettings
  sidebar: Sidebar
  /** The side the score editor's palette stands on beside the sheet. */
  paletteSide: PaletteSide
  midi: MidiSettings
  chordFinder: ChordFinderSettings
  scoreView: ScoreViewSettings
  /** The sections folded away, by their ids (`chords.tensions`): the same on every visit. */
  foldedSections: readonly string[]
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

/** In the thumbs' middle, icons alone: a name is the button's tooltip and its screen reader's. */
export const DEFAULT_FLOATING: FloatingSettings = { place: 'center', labels: false }

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
export const DEFAULT_PALETTE_SIDE: PaletteSide = 'right'

/** The staff writes only the chord down now; the keys it is in are shown. */
export const DEFAULT_CHORD_FINDER: ChordFinderSettings = {
  remember: false,
  inKeys: true,
  slash: true,
  chords: [],
}

/** A new keyboard's settings: the computer keyboard plays where the pointer is fine (a mouse, a trackpad). */
export const defaultKeyboard = (finePointer: boolean): KeyboardSettings => ({
  keySize: 'fit',
  swipe: 'scroll',
  namedKeys: 'c',
  markNotes: true,
  chordNames: true,
  typing: finePointer,
  dock: 'bottom',
  folded: false,
  foldedLandscape: true,
  keyLength: 'long',
  railControls: RAIL_CONTROLS,
})

export const isTheme = isOneOf(THEMES)
export const isTitleSize = isOneOf(TITLE_SIZES)
export const isKeySize = isOneOf(KEY_SIZES)
export const isSwipe = isOneOf(SWIPES)
export const isKeyDock = isOneOf(KEY_DOCKS)
export const isKeyLength = isOneOf(KEY_LENGTHS)
export const isNamedKeys = isOneOf(NAMED_KEYS)
export const isSidebar = isOneOf(SIDEBARS)
export const isPaletteSide = isOneOf(PALETTE_SIDES)
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
