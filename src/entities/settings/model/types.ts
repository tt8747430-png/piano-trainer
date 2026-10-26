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

/** The Player's saved switches: the Setup's (`PLAYING_TOGGLES`), the View menu's chord positions, finger numbers and named notes, a piece's tune and recording. */
export const PRACTICE_TOGGLES = [
  'fingerNumbers',
  'namedNotes',
  'positions',
  'tune',
  'metronome',
  'countIn',
  'recording',
] as const
export type PracticeToggle = (typeof PRACTICE_TOGGLES)[number]
export type PracticeToggles = Readonly<Record<PracticeToggle, boolean>>
/**
 * The Setup's saved switches: how any piece plays (the tune and the recording are a piece's own: its
 * setup shows them). What the sheet shows (chord positions, finger numbers, named notes) is the View
 * menu's alone (ADR 0064, 0085).
 */
export const PLAYING_TOGGLES = ['metronome', 'countIn'] as const satisfies readonly PracticeToggle[]

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

/**
 * Where the score editor's palette stands: beside the sheet (a laptop, a phone on its side), at its
 * right (ADR 0094), or at its foot.
 */
export const PALETTE_PLACES = ['beside', 'foot'] as const
export type PalettePlace = (typeof PALETTE_PLACES)[number]
/**
 * Whether the palette is folded, as the learner last left it in each place; a place never chosen
 * takes its default (ADR 0089): open beside the sheet, where it covers no music, folded at the foot.
 */
export type PaletteFolds = Readonly<Partial<Record<PalettePlace, boolean>>>

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
 * The Player's four views of the music (ADR 0099, Chordify's): the sheet music; the chords as chips
 * over the words; the chord sounding as a diagram beside the next; the chart in beat cells.
 */
export const MUSIC_VIEWS = ['sheet', 'lyrics', 'diagrams', 'grid'] as const
export type MusicView = (typeof MUSIC_VIEWS)[number]

/**
 * The Diagrams view's modes (ADR 0102, Chordify's "Diagram view mode"): the chord sounding beside
 * the next, moving with the music; or the song's chords all at once, the one sounding marked.
 */
export const DIAGRAMS_MODES = ['animated', 'summary'] as const
export type DiagramsMode = (typeof DIAGRAMS_MODES)[number]

/**
 * How the Player and the score editor show a score (ADR 0064, Soundslice's view settings): laid out
 * as one line across, lines down the screen or A4 pages; the Player's view of it (ADR 0099: the
 * editor always shows the score), Diagrams' mode, and whether a song opens asking for it (ADR 0102);
 * the chord names; the words under the staff they are written on (ADR 0093); the staves hidden, each
 * by its place (ADR 0097); and the keys, or the score alone.
 */
export interface ScoreViewSettings {
  readonly layout: SheetView
  readonly music: MusicView
  readonly diagrams: DiagramsMode
  /** A piece's Player opens with its View menu open (Chordify's "Show this when opening a song"). */
  readonly askOnOpen: boolean
  readonly chordNames: boolean
  /** The verses under the staff they are written on, where the song has words. */
  readonly lyrics: boolean
  /** The staves out of sight: a single staff by its place, the piano's upper or lower staff. */
  readonly hidden: readonly StaffId[]
  /** The keys under the score: off, the score has the screen. */
  readonly keys: boolean
}

/**
 * Down the screen, a line at a time, as a phone held upright reads best (one line across shows a bar
 * or two there); Diagrams moving with the music; a song opening in the view last chosen; every
 * staff, the chord names, the words.
 */
export const DEFAULT_SCORE_VIEW: ScoreViewSettings = {
  layout: 'scroll',
  music: 'sheet',
  diagrams: 'animated',
  askOnOpen: false,
  chordNames: true,
  lyrics: true,
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
  /** Whether the score editor's palette is folded to its quick row and categories, by where it stands. */
  paletteFolded: PaletteFolds
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
  tune: false,
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
export const isOctaveShift = isOneOf(OCTAVE_SHIFTS)
export const isTouch = isOneOf(TOUCHES)
export const isPedalWay = isOneOf(PEDAL_WAYS)
export const isMusicView = isOneOf(MUSIC_VIEWS)
export const isDiagramsMode = isOneOf(DIAGRAMS_MODES)

/** The first of the browser's preferred languages the app speaks decides; English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
