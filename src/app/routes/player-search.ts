import {
  isLeftFigureId,
  isPatternRef,
  isRightFigureId,
  type PatternChoice,
} from '@/entities/pattern'
import {
  CHROMATIC,
  CHROMATIC_DIRECTIONS,
  chordsParam,
  isLoopParam,
  PRACTICE_MODES,
  PROGRESSION,
  readChords,
} from '@/features/practice'
import {
  isArpeggioQuality,
  isChordTone,
  isFigureId,
  isFingering,
  isOctaves,
  isTonality,
  isVoicing,
} from '@/entities/exercise'
import type {
  ChromaticSearch,
  ExerciseSearch,
  PlayerSearch,
  ProgressionSearch,
  WalkSearch,
} from '@/pages/player'
import type { EditSearch } from '@/pages/score-editor'
import { isOneOf, readNote, valueOr, wholeIn } from '@/shared/lib'
import { isInversion, keyParam, note, noteParam } from '@/shared/lib/music'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import type { SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import {
  C_MAJOR_PARAM,
  isChordSize,
  isHands,
  isKeyWalk,
  isScaleKind,
  readKey,
  readNumerals,
  routeSearch,
  type Raw,
} from './read-search'

// The Player, over whatever it plays: a piece, a walk of a scale's chords, the chromatic walk, a progression.

const isPlayerPattern = (value: unknown): value is PatternChoice =>
  value === 'chart' || isPatternRef(value)
const isMode = isOneOf(PRACTICE_MODES)

// A piece: key, tempo, pattern and chord size default to the piece's own, so their absence is the default.
export const PLAYER_DEFAULTS: PlayerSearch = {
  mode: 'listen',
  speedTraining: false,
  hands: 'both',
  swing: false,
}
/** The Player's own params: how it goes, whatever it plays. */
function practiceView(raw: Raw): PracticeView {
  return {
    mode: valueOr(isMode, raw.mode, PLAYER_DEFAULTS.mode),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
    speedTraining: raw.speedTraining === true,
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    swing: raw.swing === true,
    loop: isLoopParam(raw.loop) ? raw.loop : undefined,
  }
}
/** The pattern and the hands' figures a Setup chooses, whatever the Player plays. */
function figures(raw: Raw): Pick<SetupParams, 'pattern' | 'rh' | 'lh' | 'inversion'> {
  return {
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
    inversion: isInversion(raw.inversion) ? raw.inversion : undefined,
  }
}
const chordSize = (raw: Raw) => (isChordSize(raw.chordSize) ? raw.chordSize : undefined)
const walk = (raw: Raw) => (isKeyWalk(raw.walk) ? raw.walk : undefined)

export function readPlayerSearch(raw: Raw): PlayerSearch {
  const key = readNote(raw.key)
  return {
    ...practiceView(raw),
    key: key ? noteParam(key) : undefined,
    ...figures(raw),
    chordSize: chordSize(raw),
  }
}
export const playerSearch = routeSearch(readPlayerSearch, PLAYER_DEFAULTS)

/** How the learner plays: what a link to the Player that names its music takes from the last time. */
const PLAYING = [
  'pattern',
  'rh',
  'lh',
  'inversion',
  'tempo',
  'hands',
  'mode',
  'swing',
  'speedTraining',
] as const
/** A piece's kept params (ADR 0022): its key and chord size too. */
export const PLAYER_KEPT: readonly (keyof PlayerSearch & string)[] = [
  'key',
  'chordSize',
  ...PLAYING,
]

// Walk the chords: the scale, then the Player's own params.
export const WALK_DEFAULTS: WalkSearch = {
  root: noteParam(note('C')),
  kind: 'major',
  ...PLAYER_DEFAULTS,
}
export function readWalkSearch(raw: Raw): WalkSearch {
  const kind = valueOr(isScaleKind, raw.kind, WALK_DEFAULTS.kind)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(root) : WALK_DEFAULTS.root,
    kind,
    ...practiceView(raw),
    ...figures(raw),
    chordSize: chordSize(raw),
  }
}
export const walkSearch = routeSearch(readWalkSearch, WALK_DEFAULTS)
/** Not its chord size: a link leaves it out for the walk's own. */
export const WALK_KEPT: readonly (keyof WalkSearch & string)[] = PLAYING

// The chromatic walk: the chords, root and direction, then the Player's own params.
export const CHROMATIC_DEFAULTS: ChromaticSearch = {
  chords: chordsParam(CHROMATIC.chords),
  root: noteParam(note('C')),
  direction: CHROMATIC.direction,
  ...PLAYER_DEFAULTS,
}
const isDirection = isOneOf(CHROMATIC_DIRECTIONS)
export function readChromaticSearch(raw: Raw): ChromaticSearch {
  const chords = readChords(raw.chords)
  const root = readNote(raw.root)
  return {
    chords: chordsParam(chords),
    root: noteParam(root ?? note('C')),
    direction: valueOr(isDirection, raw.direction, CHROMATIC_DEFAULTS.direction),
    ...practiceView(raw),
    ...figures(raw),
  }
}
export const chromaticSearch = routeSearch(readChromaticSearch, CHROMATIC_DEFAULTS)
export const CHROMATIC_KEPT: readonly (keyof ChromaticSearch & string)[] = ['direction', ...PLAYING]

// A progression: its numerals and key, then the Player's own params; an unread line is its own.
export const PROGRESSION_PLAYER_DEFAULTS: ProgressionSearch = {
  ...PLAYER_DEFAULTS,
  p: PROGRESSION.numerals,
  key: C_MAJOR_PARAM,
}
export function readProgressionPlayerSearch(raw: Raw): ProgressionSearch {
  const key = readKey(raw.key)
  return {
    p: readNumerals(raw.p, PROGRESSION_PLAYER_DEFAULTS.p),
    key: key ? keyParam(key) : PROGRESSION_PLAYER_DEFAULTS.key,
    ...practiceView(raw),
    ...figures(raw),
    chordSize: chordSize(raw),
    walk: walk(raw),
  }
}
export const progressionPlayerSearch = routeSearch(
  readProgressionPlayerSearch,
  PROGRESSION_PLAYER_DEFAULTS,
)
/** Not its numerals, key or chord size: the Progressions tool names them, its triads by leaving the size out. */
export const PROGRESSION_KEPT: readonly (keyof ProgressionSearch & string)[] = ['walk', ...PLAYING]

// An exercise: the Player's own params, its swing absent for the exercise's own, then its choices,
// each absent for the exercise's own (the page reads them against the exercise).
export const EXERCISE_DEFAULTS: ExerciseSearch = {
  mode: PLAYER_DEFAULTS.mode,
  speedTraining: false,
  hands: PLAYER_DEFAULTS.hands,
}
const when = <T>(guard: (value: unknown) => value is T, raw: unknown): T | undefined =>
  guard(raw) ? raw : undefined
export function readExerciseSearch(raw: Raw): ExerciseSearch {
  const root = readNote(raw.root)
  const { swing: _swing, ...view } = practiceView(raw)
  return {
    ...view,
    swing: typeof raw.swing === 'boolean' ? raw.swing : undefined,
    root: root ? noteParam(root) : undefined,
    kind: when(isScaleKind, raw.kind),
    octaves: when(isOctaves, raw.octaves),
    start: wholeIn(raw.start, 0, 6, undefined),
    fingering: when(isFingering, raw.fingering),
    quality: when(isArpeggioQuality, raw.quality),
    inversion: when(isInversion, raw.inversion),
    figure: when(isFigureId, raw.figure),
    voicing: when(isVoicing, raw.voicing),
    from: when(isChordTone, raw.from),
    tonality: when(isTonality, raw.tonality),
  }
}
export const exerciseSearch = routeSearch(readExerciseSearch, EXERCISE_DEFAULTS)
/** How the learner plays, not what: a link that names an exercise's choices leaves its own out. */
export const EXERCISE_KEPT: readonly (keyof ExerciseSearch & string)[] = [
  'tempo',
  'hands',
  'mode',
  'swing',
  'speedTraining',
]

// The score editor: whether its takes are open.
export const EDIT_DEFAULTS: EditSearch = { record: false }
export const readEditSearch = (raw: Raw): EditSearch => ({ record: raw.record === true })
export const editSearch = routeSearch(readEditSearch, EDIT_DEFAULTS)
