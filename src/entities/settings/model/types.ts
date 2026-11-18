import type { Bars } from './bars'
import { isLocale, type Locale } from '@/shared/i18n/locale'
import type { Inversion } from '@/shared/lib/music'
import {
  CAMERA_ANGLES,
  CHORD_LABELS,
  CHORD_RANGES,
  isOneOf,
  NAMED_KEYS,
  OCTAVE_SHIFTS,
  PEDAL_WAYS,
  SONG_RANGES,
  type CameraAngle,
  type ChordLabels,
  type ChordRange,
  type SheetView,
  type NamedKeys,
  type OctaveShift,
  type PedalWay,
  type SongRange,
} from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import {
  METRONOME_SOUNDS,
  SUBDIVISIONS,
  TOUCHES,
  TRAINER_BARS,
  type BarTrainer,
  type BeatLevel,
  type MetronomeMeter,
  type MetronomeSound,
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
 * With one hand chosen (loop round 24, the Parts sheet's Dim): how the other hand's staff looks, as it
 * is or dimmed. How loud it is heard is its staff's volume.
 */
export const OTHER_HAND_LOOKS = ['show', 'dim'] as const
export type OtherHandLook = (typeof OTHER_HAND_LOOKS)[number]
export interface OtherHandSettings {
  readonly look: OtherHandLook
}
/** The other hand dimmed, as the Player always did. */
export const DEFAULT_OTHER_HAND: OtherHandSettings = { look: 'dim' }

/**
 * How the Player's count-in goes (Flat's metronome: Off · Count-in): none, or a bar of clicks counted
 * down on the screen. New learners start without, as Flat's.
 */
export const COUNTDOWNS = ['none', 'audible'] as const
export type Countdown = (typeof COUNTDOWNS)[number]
/** How much faster each pass of speed training plays, a share of the piece's tempo in percent. */
export const SPEED_STEPS = [2, 5, 10] as const
export type SpeedStep = (typeof SPEED_STEPS)[number]

/**
 * How the Player always plays (B7, its settings page): its count-in and speed training's step. No
 * pedal, cursor or scrolling settings (R37): the pedal plays as marked, else automatically; the cursor
 * moves note by note; the views follow the music, a scroll by hand pausing them until Back to the music.
 */
export interface PlaybackSettings {
  readonly countdown: Countdown
  readonly speedStep: SpeedStep
}
/** No count-in, 5% a pass. */
export const DEFAULT_PLAYBACK: PlaybackSettings = {
  countdown: 'none',
  speedStep: 5,
}

/** How every trainer goes, whatever it asks. */
export interface TrainerSettings {
  /** A right answer moves on to the next round by itself. */
  readonly autoNext: boolean
}

/** How every lesson shows its examples. */
/** The keyboard settings: the same on every screen, set in Settings › On-screen piano. */
export interface KeyboardSettings {
  /**
   * What the keys carry (the Piano sheet's Labels, the boards' PIANO_SHEET_2D): the Cs named, or
   * nothing. Every other choice about the keys went with the On-screen piano page (owner,
   * 2026-11-15): the keys fit their screen, a swipe scrolls them, the sustain pedal alone.
   */
  readonly namedKeys: NamedKeys
  /** The computer keyboard plays the keys (General's Computer keyboard). */
  readonly typing: boolean
  /** A page's keys hidden from its bar's Keyboard (R34): the screen as the learner left it. */
  readonly folded: boolean
  /**
   * On a phone on its side, a reading page's keys (a lesson's, an explorer's, a song's) folded away,
   * apart from `folded`: the screen is too short for the page and the keys both (ADR 0062).
   */
  readonly foldedLandscape: boolean
}

/** The sizes of screen the keys' height is kept for (R34): a phone upright, on its side, a wider screen. */
export const KEYS_SCREEN_SIZES = ['phone', 'side', 'wide'] as const
export type KeysScreenSize = (typeof KEYS_SCREEN_SIZES)[number]
/**
 * The keys' window where the learner left it (loop round 24): px from the screen's left and its foot,
 * its width and height.
 */
export interface KeysWindow {
  readonly left: number
  readonly bottom: number
  readonly width: number
  readonly height: number
}
/** The keys' window for each size of screen; null: at the foot over the transport, the screen's width, a piano's proportion. */
export type KeysWindows = Readonly<Record<KeysScreenSize, KeysWindow | null>>
export const DEFAULT_KEYS_WINDOWS: KeysWindows = { phone: null, side: null, wide: null }
/** The farthest a window's edge is kept: no screen is wider or taller. */
export const KEYS_WINDOW_MOST = 8000

const SIDEBARS = ['open', 'collapsed'] as const
/** A laptop's sidebar: its places named, or their icons alone. */
export type Sidebar = (typeof SIDEBARS)[number]

/** How the score editor's Recorder records a take (ADR 0028). */
/** The bars counted in before a take (A40, Flat's Start countdown): none starts it on the first note. */
export const RECORDER_COUNT_INS = [0, 1, 2] as const
export type RecorderCountIn = (typeof RECORDER_COUNT_INS)[number]

export interface RecorderSettings {
  /** The click goes on after the count-in, while the take records. */
  readonly click: boolean
  /** The song's tune plays under the take. */
  readonly tune: boolean
  /** The bars counted in before a take. */
  readonly countIn: RecorderCountIn
}

/** How the score editor writes (round 28, MuseScore's and Dorico's note input preferences). */
export interface EditingSettings {
  /** A note sounds as it is chosen on the score or its pitch is changed (the keys sound themselves). */
  readonly hearNotes: boolean
  /** Which side of the sheet the palette docks on, from 48rem wide. */
  readonly paletteSide: PaletteSide
}

/**
 * The modes the editor opens in, as it was left (R31-E): Chord is chosen for a moment, never a way
 * to start.
 */
export const EDITOR_START_MODES = ['replace', 'insert'] as const
export type EditorStartMode = (typeof EDITOR_START_MODES)[number]

/** The palette's sides. */
export const PALETTE_SIDES = ['left', 'right'] as const
export type PaletteSide = (typeof PALETTE_SIDES)[number]

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
  /** How late the piano is heard, in milliseconds, measured by Calibrate timing; taken off every take. */
  readonly latency: number
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
  readonly chordNames: boolean
  /** The verses under the staff they are written on, where the song has words. */
  readonly lyrics: boolean
  /** Chords over lyrics' chord diagrams pinned under its strip (ADR 0108). */
  readonly pinned: boolean
  /** Chords over lyrics' words and chords, as a percent of their own size (ADR 0108). */
  readonly textSize: TextSize
  /** The keys under the score: off, the score has the screen. */
  readonly keys: boolean
  /**
   * In the keys' place, the hands at the keys (R36): a piano seen from the seat, two hands playing
   * the music on it; off, the keys, which a tap plays.
   */
  readonly hands: boolean
  /** Where the 3D piano is seen from (its Piano sheet's Angle): from the seat, or from above. */
  readonly angle: CameraAngle
  /** The 3D piano with the hands at the keys, or the keys alone (Hands on the keys). */
  readonly handsOnKeys: boolean
  /** How many keys stand in the keys' place (its Piano sheet's Range): the song's, or 61, 76 or 88. */
  readonly range: SongRange
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
  chordNames: true,
  lyrics: true,
  pinned: true,
  textSize: 100,
  keys: true,
  hands: true,
  angle: 'seat',
  handsOnKeys: true,
  range: 'song',
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
  /** How loud it clicks, in `METRONOME_VOLUMES`' steps of ten, a percent of its full sound. */
  readonly volume: number
  /** The screen flashes on each beat, to follow it by eye. */
  readonly flash: boolean
}

/** The Metronome's volumes, ten to a hundred percent. */
export const METRONOME_VOLUMES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const

/** 120 a minute in 4/4, a click on each beat; the bar trainer off, at two bars and two. */
export const DEFAULT_METRONOME: MetronomeSettings = {
  bpm: 120,
  meter: '4/4',
  sound: 'click',
  levels: null,
  subdivision: 'none',
  trainer: { on: false, play: 2, mute: 2 },
  speed: { on: false, from: 80, to: 120, step: 5, every: 4 },
  volume: 100,
  flash: false,
}

export interface SettingsState {
  theme: Theme
  locale: Locale
  practice: PracticeToggles
  sound: SoundSettings
  trainer: TrainerSettings
  keyboard: KeyboardSettings
  /** The keys' window, moved and sized by the learner, per size of screen (loop round 24). */
  keysWindow: KeysWindows
  recorder: RecorderSettings
  /** How the score editor writes (round 28). */
  editing: EditingSettings
  sidebar: Sidebar
  /**
   * Whether the score editor's palette floating on a phone is folded to its category's row and the
   * categories (R31-E), as the learner left it; folded as it first opens.
   */
  paletteFolded: boolean
  /** The palette's category chosen, by name, as the learner left it (R31-E); null until chosen. */
  paletteCategory: string | null
  /** The mode the score editor writes in, as it was left (R31-E). */
  editorMode: EditorStartMode
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
  /** The tips put away or done (R31-P), by their ids (`coach.listen`): a tip shows until then. */
  tipsSeen: readonly string[]
  /** Practice's pages opened from its list, the latest first (R30-4): its Continue's two. */
  practiceRecent: readonly string[]
  /**
   * The score editor's palette tools used last, the latest first (loop round 57, Flat's recent
   * notation): its Recent group, eight at most, each still in its own category.
   */
  paletteRecent: readonly string[]
  /** How Progressions writes and voices every progression (A24). */
  progressions: ProgressionsSettings
  /** How Intervals plays them all, and how fast (canvas 176). */
  intervals: IntervalSettings
  /** How the Chord player writes its chords and voices its piano (R29 CP6). */
  chordPlayer: ChordPlayerSettings
  chords: ChordsSettings
  /** The bars the learner arranged (R29 B10): a surface left out holds its default. */
  bars: Bars
  /** The Tuner's reference pitch (R29 B11). */
  tuner: TunerSettings
  /** What the Scales page writes on its staff (A43). */
  scaleStaff: ScaleStaffSettings
}

/**
 * The theory written on the Scales page's staff (A43): each note's degree under it, the whole and
 * half steps between the notes, the tonic and leading note named, and the two tetrachords bracketed.
 */
/**
 * The theory the Scales page writes on its staff besides its one layer of labels (R34: fingers,
 * degrees or steps, the page's own, in its URL): the tonic and leading note, the tetrachords.
 */
export interface ScaleStaffSettings {
  readonly tonic: boolean
  readonly tetrachords: boolean
}
export const DEFAULT_SCALE_STAFF: ScaleStaffSettings = {
  tonic: false,
  tetrachords: false,
}

/** The concert A the Tuner reads against, Baroque to modern orchestral, in whole hertz. */
export const A4_RANGE = { min: 415, max: 466 } as const
/** The Tuner's reference (R29 B11): what A above middle C is tuned to, 440 Hz by default. */
export interface TunerSettings {
  readonly a4: number
}
export const DEFAULT_TUNER: TunerSettings = { a4: 440 }

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
export const DEFAULT_RECORDER: RecorderSettings = { click: true, tune: false, countIn: 1 }

/** A note heard as it is edited, as notation software does by default. */
export const DEFAULT_EDITING: EditingSettings = {
  hearNotes: true,
  paletteSide: 'right',
}

/** The owner's piano sounds itself: the app sounds no MIDI key until asked. */
export const DEFAULT_MIDI: MidiSettings = {
  input: true,
  device: null,
  sound: false,
  throughPiano: false,
  octaveShift: 0,
  touch: 'normal',
  pedal: 'normal',
  latency: 0,
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

/** How Play all goes through the intervals: in the page's order, or shuffled each time. */
export const INTERVAL_ORDERS = ['in-order', 'shuffled'] as const
export type IntervalOrder = (typeof INTERVAL_ORDERS)[number]
export const isIntervalOrder = isOneOf(INTERVAL_ORDERS)

/** How fast an interval's two notes follow each other, and Play all goes from one to the next. */
export const INTERVAL_SPEEDS = ['slow', 'medium', 'fast'] as const
export type IntervalSpeed = (typeof INTERVAL_SPEEDS)[number]
export const isIntervalSpeed = isOneOf(INTERVAL_SPEEDS)

/** Intervals' own settings (canvas 176): Play all's order and the speed every interval plays at. */
export interface IntervalSettings {
  readonly order: IntervalOrder
  readonly speed: IntervalSpeed
}

export const DEFAULT_INTERVALS: IntervalSettings = { order: 'in-order', speed: 'medium' }

export const DEFAULT_PROGRESSIONS: ProgressionsSettings = {
  names: 'numerals',
  voicing: 'led',
  inversion: 0,
}

/**
 * How the Chord player writes every chord sheet's boxes (R29 CP6), large on each box: as chord
 * symbols, Roman numerals or Nashville numbers; and how its piano voices them, led or as blocks.
 */
export interface ChordPlayerSettings {
  readonly names: ProgressionNames
  readonly voicing: ProgressionVoicing
  /** Follow a MIDI arranger (a Genos): its Start, Stop and clock lead the sheet, which sends it its sections. */
  readonly follow: boolean
  /** Where its Genos strip stands: a card over the dock, folded to its head, or in a laptop's side column. */
  readonly arranger: ArrangerPlace
}
export const ARRANGER_PLACES = ['card', 'folded', 'side'] as const
export type ArrangerPlace = (typeof ARRANGER_PLACES)[number]
export const DEFAULT_CHORD_PLAYER: ChordPlayerSettings = {
  names: 'chords',
  voicing: 'led',
  follow: false,
  arranger: 'card',
}

/** The Chords page's own settings, in its Piano sheet. */
export interface ChordsSettings {
  /** What its keys and its staff's heads carry. */
  readonly labels: ChordLabels
  /** How many keys its piano shows. */
  readonly range: ChordRange
  /** The white key the strip was dragged to, where two or four octaves start; null: the C under the chord. */
  readonly rangeFrom: Midi | null
  /** Where its 3D piano is seen from. */
  readonly angle: CameraAngle
  /** Its 3D piano with the hands at the keys, or the keys alone. */
  readonly handsOnKeys: boolean
}
export const DEFAULT_CHORDS: ChordsSettings = {
  labels: 'names',
  range: 'chord',
  rangeFrom: null,
  angle: 'seat',
  handsOnKeys: true,
}
export const isCameraAngle = isOneOf(CAMERA_ANGLES)
export const isChordLabels = isOneOf(CHORD_LABELS)
export const isChordRange = isOneOf(CHORD_RANGES)
export const isSongRange = isOneOf(SONG_RANGES)

/** A new keyboard's settings: the computer keyboard plays where the pointer is fine (a mouse, a trackpad). */
export const defaultKeyboard = (finePointer: boolean): KeyboardSettings => ({
  namedKeys: 'c',
  typing: finePointer,
  folded: false,
  foldedLandscape: true,
})

export const isTheme = isOneOf(THEMES)
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
