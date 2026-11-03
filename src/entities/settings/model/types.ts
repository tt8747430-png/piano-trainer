import { isLocale, type Locale } from '@/shared/i18n/locale'
import type { Inversion } from '@/shared/lib/music'
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
import {
  METRONOME_SOUNDS,
  PEDAL_PLAYS,
  SUBDIVISIONS,
  TOUCHES,
  TRAINER_BARS,
  type BarTrainer,
  type BeatLevel,
  type MetronomeMeter,
  type MetronomeSound,
  type PedalPlay,
  type SpeedTrainer,
  type Subdivision,
  type Touch,
} from '@/shared/lib/schedule'

export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

/**
 * The Player's saved switches: the View menu's chord positions, finger numbers and named notes, and
 * the click (`metronome`, the transport's quick toggle, ADR 0105).
 */
export const PRACTICE_TOGGLES = ['fingerNumbers', 'namedNotes', 'positions', 'metronome'] as const
export type PracticeToggle = (typeof PRACTICE_TOGGLES)[number]
export type PracticeToggles = Readonly<Record<PracticeToggle, boolean>>

/**
 * How loud each part of the Player's music sounds (ADR 0105, A35, Flat's Audio playback), in whole
 * percent, 100 its own loudness and 0 none: each staff by its place (the piano's upper and lower, a
 * single staff's, the same for every song; one never set at full), a piece's recording, and the click
 * (the count-in's and the metronome's).
 */
export interface SoundSettings {
  readonly staves: Readonly<Partial<Record<StaffId, number>>>
  readonly recording: number
  readonly click: number
}

/**
 * With one hand practised (A35, the reference's Practice mode): how the other hand's staff looks
 * (shown as it is, dimmed, or hidden, only the chosen hand's staff left), and whether it is heard.
 */
export const OTHER_HAND_LOOKS = ['show', 'dim', 'hide'] as const
export type OtherHandLook = (typeof OTHER_HAND_LOOKS)[number]
export interface OtherHandSettings {
  readonly look: OtherHandLook
  readonly play: boolean
}
/** The other hand dimmed, and played along in Wait mode, as the Player always did. */
export const DEFAULT_OTHER_HAND: OtherHandSettings = { look: 'dim', play: true }

/**
 * How the Player's count-in goes (B7, the reference's Countdown): none; a bar of clicks counted down
 * on the screen; or counted down on the screen alone, unheard.
 */
export const COUNTDOWNS = ['none', 'audible', 'visual'] as const
export type Countdown = (typeof COUNTDOWNS)[number]
/**
 * How the Player's cursor moves (B7, the reference's Cursor): none drawn; a step at each beat its
 * notes start on; or gliding with the music (ADR 0096).
 */
export const CURSORS = ['none', 'beats', 'continuous'] as const
export type Cursor = (typeof CURSORS)[number]
/** How much faster each pass of speed training plays, a share of the piece's tempo in percent. */
export const SPEED_STEPS = [2, 5, 10] as const
export type SpeedStep = (typeof SPEED_STEPS)[number]

/**
 * How the Player always plays (B7, its settings page): its count-in, its cursor, the sustain pedal (as
 * written, none, or automatic, A27), and speed training's step.
 */
export interface PlaybackSettings {
  readonly countdown: Countdown
  readonly cursor: Cursor
  readonly pedal: PedalPlay
  readonly speedStep: SpeedStep
}
/** No count-in, the cursor gliding, the pedal as written, 5% a pass: the Player as it always was. */
export const DEFAULT_PLAYBACK: PlaybackSettings = {
  countdown: 'none',
  cursor: 'continuous',
  pedal: 'written',
  speedStep: 5,
}

/** How every trainer goes, whatever it asks. */
export interface TrainerSettings {
  /** A right answer moves on to the next round by itself. */
  readonly autoNext: boolean
}

/** How every lesson shows its examples. */
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
  /** A chord or a scale chosen on a Practice page plays as it is chosen. */
  readonly autoplay: boolean
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
 * Where the score editor's palette stands (ADR 0114, Flat's): a panel docked at the sheet's left
 * (a laptop, a tablet, a phone on its side), or a sheet docked at its foot (a phone held upright).
 */
export const PALETTE_PLACES = ['panel', 'sheet'] as const
export type PalettePlace = (typeof PALETTE_PLACES)[number]
/**
 * Whether the palette is folded, as the learner last left it in each place; a place never chosen
 * takes its default (ADR 0114): the panel shown, the sheet compact (its quick row and its tabs).
 */
export type PaletteFolds = Readonly<Partial<Record<PalettePlace, boolean>>>

const SIDEBARS = ['open', 'collapsed'] as const
/** A laptop's sidebar: its places named, or their icons alone. */
export type Sidebar = (typeof SIDEBARS)[number]

/** How the score editor's Recorder records a take (ADR 0028). */
export interface RecorderSettings {
  /** The click goes on after the count-in, while the take records. */
  readonly click: boolean
  /** The song's tune plays under the take. */
  readonly tune: boolean
}

/** How the score editor writes (round 28, MuseScore's and Dorico's note input preferences). */
export interface EditingSettings {
  /** A note sounds as it is chosen on the score or its pitch is changed (the keys sound themselves). */
  readonly hearNotes: boolean
}

/** The MIDI keyboard's settings. */
export interface MidiSettings {
  /** MIDI input on: a keyboard the learner allowed is heard again as the app opens. */
  readonly input: boolean
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

/** The Chord finder's own settings (ADR 0052), and the chords it remembers. */
export interface ChordFinderSettings {
  /** The staff keeps the chords played in turn, and so does the device; else it writes only the chord down now. */
  readonly remember: boolean
  /** The keys the chord is in, each with its numeral, shown under it. */
  readonly inKeys: boolean
  /** An inversion named over its bass (`C/E`); else by its root alone (`C`), its inversion said. */
  readonly slash: boolean
  /** The key's scale painted on the keys under the chord. */
  readonly scale: boolean
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
 * The Player's four views of the music (ADR 0108, Chordify's): the sheet music; the chords as chips
 * over the words; the chord sounding as a diagram beside the next; the chart in beat cells.
 */
export const MUSIC_VIEWS = ['sheet', 'lyrics', 'diagrams', 'grid'] as const
export type MusicView = (typeof MUSIC_VIEWS)[number]

/**
 * The Diagrams view's modes (ADR 0108, Chordify's "Diagram view mode"): the chord sounding beside
 * the next, moving with the music; or the song's chords all at once, the one sounding marked.
 */
export const DIAGRAMS_MODES = ['animated', 'summary'] as const
export type DiagramsMode = (typeof DIAGRAMS_MODES)[number]

/**
 * Chords over lyrics' text sizes (ADR 0108, Chordify's font size): its words and chords as a percent
 * of their own size, smallest first, a step at a time by its − and +.
 */
export const TEXT_SIZES = [80, 90, 100, 115, 130, 150] as const
export type TextSize = (typeof TEXT_SIZES)[number]

/**
 * How the Player and the score editor show a score (ADR 0096, Soundslice's view settings): laid out
 * as one line across, lines down the screen or A4 pages; the Player's view of it (ADR 0108: the
 * editor always shows the score), Diagrams' mode, and whether a song opens asking for it (ADR 0108);
 * the chord names; the words under the staff they are written on (ADR 0097); and the keys, or the
 * score alone. Which staves are in sight is the Player's Staves, in its URL (A35).
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
  /** Chords over lyrics' chord diagrams pinned under its strip (ADR 0108). */
  readonly pinned: boolean
  /** Chords over lyrics' words and chords, as a percent of their own size (ADR 0108). */
  readonly textSize: TextSize
  /** The keys under the score: off, the score has the screen. */
  readonly keys: boolean
}

/**
 * Down the screen, a line at a time, as a phone held upright reads best (one line across shows a bar
 * or two there); Diagrams moving with the music; a song opening in the view last chosen; the chord
 * names, the words.
 */
export const DEFAULT_SCORE_VIEW: ScoreViewSettings = {
  layout: 'vertical',
  music: 'sheet',
  diagrams: 'animated',
  askOnOpen: false,
  chordNames: true,
  lyrics: true,
  pinned: true,
  textSize: 100,
  keys: true,
}

/** The bar trainer as left: on or off, its counts kept either way. */
export interface BarTrainerSettings extends BarTrainer {
  readonly on: boolean
}

/** The Metronome as the learner left it (ADR 0052): its tempo, meter, sound and bar trainer. */
/** The speed trainer (A39): from one tempo toward another by a step every so many bars. */
export interface SpeedTrainerSettings extends SpeedTrainer {
  readonly on: boolean
}

export interface MetronomeSettings {
  /** Beats a minute, whole, within `BPM_RANGE`: the beat players count (dotted in 6/8). */
  readonly bpm: number
  /** Any time signature the Metronome counts ("7/8"). */
  readonly meter: MetronomeMeter
  readonly sound: MetronomeSound
  /** Each beat's level as its square was set; null for the meter's own. */
  readonly levels: readonly BeatLevel[] | null
  readonly subdivision: Subdivision
  readonly trainer: BarTrainerSettings
  readonly speed: SpeedTrainerSettings
}

/** 120 a minute in 4/4, a click on each beat; the bar trainer off, at two bars and two. */
export const DEFAULT_METRONOME: MetronomeSettings = {
  bpm: 120,
  meter: '4/4',
  sound: 'click',
  levels: null,
  subdivision: 'none',
  trainer: { on: false, play: 2, mute: 2 },
  speed: { on: false, from: 80, to: 120, step: 5, every: 4 },
}

export interface SettingsState {
  theme: Theme
  locale: Locale
  practice: PracticeToggles
  sound: SoundSettings
  trainer: TrainerSettings
  keyboard: KeyboardSettings
  recorder: RecorderSettings
  /** How the score editor writes (round 28). */
  editing: EditingSettings
  sidebar: Sidebar
  /** Whether the score editor's palette is folded to its quick row and categories, by where it stands. */
  paletteFolded: PaletteFolds
  /**
   * The editor's panel's sections open, by name, as the learner left them (ADR 0114); null until
   * they open or fold one, the panel then opening its first ones.
   */
  paletteSections: readonly string[] | null
  midi: MidiSettings
  chordFinder: ChordFinderSettings
  scoreView: ScoreViewSettings
  /** With one hand practised, how the other looks and whether it is heard (A35). */
  otherHand: OtherHandSettings
  /** How the Player always plays: count-in, cursor, pedal, speed training's step (B7). */
  playback: PlaybackSettings
  metronome: MetronomeSettings
  /** The sections folded away, by their ids (`chords.tensions`): the same on every visit. */
  foldedSections: readonly string[]
  /** Whether the welcome was seen: the app's first run shows it once. */
  welcomed: boolean
  /** How a lesson reads (round 26): one page of its sections, or a section at a time. */
  lessonReading: LessonReading
  /** How Progressions writes and voices every progression (A24). */
  progressions: ProgressionsSettings
  /** What Accompaniment shows (A24). */
  accompaniment: AccompanimentSettings
}

/** How a lesson reads: one page of its sections (the plain page), or a section at a time. */
export const LESSON_READINGS = ['page', 'sections'] as const
export type LessonReading = (typeof LESSON_READINGS)[number]
export const isLessonReading = (value: unknown): value is LessonReading =>
  LESSON_READINGS.some((reading) => reading === value)

export const DEFAULT_PRACTICE: PracticeToggles = {
  fingerNumbers: false,
  namedNotes: false,
  positions: false,
  metronome: false,
}

/** Every part as loud as it is. */
export const DEFAULT_SOUND: SoundSettings = { staves: {}, recording: 100, click: 100 }

export const DEFAULT_TRAINER: TrainerSettings = { autoNext: false }

/** In the thumbs' middle, icons alone: a name is the button's tooltip and its screen reader's. */
export const DEFAULT_RECORDER: RecorderSettings = { click: true, tune: false }

/** A note heard as it is edited, as notation software does by default. */
export const DEFAULT_EDITING: EditingSettings = { hearNotes: true }

/** The owner's piano sounds itself: the app sounds no MIDI key until asked. */
export const DEFAULT_MIDI: MidiSettings = {
  input: true,
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
  scale: false,
  chords: [],
}

/** How Progressions writes its chords: Roman numerals, Nashville numbers, or chord symbols. */
export const PROGRESSION_NAMES = ['numerals', 'nashville', 'chords'] as const
export type ProgressionNames = (typeof PROGRESSION_NAMES)[number]
export const isProgressionNames = isOneOf(PROGRESSION_NAMES)

/** How a progression's chords are voiced: led to the nearest notes, or each a root-position block. */
export const PROGRESSION_VOICINGS = ['led', 'block'] as const
export type ProgressionVoicing = (typeof PROGRESSION_VOICINGS)[number]
export const isProgressionVoicing = isOneOf(PROGRESSION_VOICINGS)

/**
 * How every progression is written and voiced (A24): its chords' names, voice-led or as blocks, and
 * the first chord's inversion a voice-led row starts from.
 */
export interface ProgressionsSettings {
  readonly names: ProgressionNames
  readonly voicing: ProgressionVoicing
  readonly inversion: Inversion
}

export const DEFAULT_PROGRESSIONS: ProgressionsSettings = {
  names: 'numerals',
  voicing: 'led',
  inversion: 0,
}

/** Accompaniment's sources the learner hid from its tabs, by their ids (A24). */
export interface AccompanimentSettings {
  readonly hidden: readonly string[]
}

export const DEFAULT_ACCOMPANIMENT: AccompanimentSettings = { hidden: [] }

/** A new keyboard's settings: the computer keyboard plays where the pointer is fine (a mouse, a trackpad). */
export const defaultKeyboard = (finePointer: boolean): KeyboardSettings => ({
  keySize: 'fit',
  swipe: 'scroll',
  namedKeys: 'c',
  markNotes: true,
  chordNames: true,
  typing: finePointer,
  autoplay: true,
  dock: 'bottom',
  folded: false,
  foldedLandscape: true,
  keyLength: 'long',
  railControls: RAIL_CONTROLS,
})

export const isTheme = isOneOf(THEMES)
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
export const isTextSize = isOneOf(TEXT_SIZES)
export const isOtherHandLook = isOneOf(OTHER_HAND_LOOKS)
export const isCountdown = isOneOf(COUNTDOWNS)
export const isCursor = isOneOf(CURSORS)
export const isPedalPlay = isOneOf(PEDAL_PLAYS)
export const isSpeedStep = isOneOf(SPEED_STEPS)
export const isMetronomeSound = isOneOf(METRONOME_SOUNDS)
export const isSubdivision = isOneOf(SUBDIVISIONS)
const BEAT_LEVELS = ['downbeat', 'accent', 'normal', 'silent'] as const
export const isBeatLevel = isOneOf(BEAT_LEVELS)
export const isTrainerBars = isOneOf(TRAINER_BARS)

/** The first of the browser's preferred languages the app speaks decides; English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
