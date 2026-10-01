import {
  isLeftFigureId,
  isPatternId,
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
import type { ChromaticSearch, PlayerSearch, ProgressionSearch, WalkSearch } from '@/pages/player'
import { isOneOf, readNote, valueOr, wholeIn } from '@/shared/lib'
import {
  keyParam,
  note,
  noteParam,
  pitchClassOf,
  qualityRootSpelling,
  scaleRootSpelling,
} from '@/shared/lib/music'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import type { SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import {
  C_MAJOR_PARAM,
  isChordSize,
  isHands,
  isInversion,
  isScaleKind,
  readKey,
  readNumerals,
  routeSearch,
  type Input,
  type Raw,
} from './read-search'

// The Player, over whatever it plays: a piece, a walk of a scale's chords, the chromatic walk, a progression.

const isPlayerPattern = (value: unknown): value is PatternChoice =>
  value === 'chart' || isPatternId(value)
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

function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw: Raw = input
  const key = readNote(raw.key)
  return {
    ...practiceView(raw),
    key: key ? noteParam(key) : undefined,
    ...figures(raw),
    chordSize: chordSize(raw),
  }
}
export const playerSearch = routeSearch(validatePlayerSearch, PLAYER_DEFAULTS)

// Walk the chords: the scale, then the Player's own params.
export const WALK_DEFAULTS: WalkSearch = {
  root: noteParam(note('C')),
  kind: 'major',
  ...PLAYER_DEFAULTS,
}
function validateWalkSearch(input: Input<WalkSearch>): WalkSearch {
  const raw: Raw = input
  const kind = valueOr(isScaleKind, raw.kind, WALK_DEFAULTS.kind)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(scaleRootSpelling(pitchClassOf(root), kind)) : WALK_DEFAULTS.root,
    kind,
    ...practiceView(raw),
    ...figures(raw),
    chordSize: chordSize(raw),
  }
}
export const walkSearch = routeSearch(validateWalkSearch, WALK_DEFAULTS)

// The chromatic walk: the chords, root and direction, then the Player's own params.
export const CHROMATIC_DEFAULTS: ChromaticSearch = {
  chords: chordsParam(CHROMATIC.chords),
  root: noteParam(note('C')),
  direction: CHROMATIC.direction,
  ...PLAYER_DEFAULTS,
}
const isDirection = isOneOf(CHROMATIC_DIRECTIONS)
function validateChromaticSearch(input: Input<ChromaticSearch>): ChromaticSearch {
  const raw: Raw = input
  const chords = readChords(raw.chords)
  const root = readNote(raw.root)
  return {
    chords: chordsParam(chords),
    root: noteParam(root ? qualityRootSpelling(pitchClassOf(root), chords[0]) : note('C')),
    direction: valueOr(isDirection, raw.direction, CHROMATIC_DEFAULTS.direction),
    ...practiceView(raw),
    ...figures(raw),
  }
}
export const chromaticSearch = routeSearch(validateChromaticSearch, CHROMATIC_DEFAULTS)

// A progression: its numerals and key, then the Player's own params; an unread line is its own.
export const PROGRESSION_PLAYER_DEFAULTS: ProgressionSearch = {
  ...PLAYER_DEFAULTS,
  p: PROGRESSION.numerals,
  key: C_MAJOR_PARAM,
}
function validateProgressionPlayerSearch(input: Input<ProgressionSearch>): ProgressionSearch {
  const raw: Raw = input
  const key = readKey(raw.key)
  return {
    p: readNumerals(raw.p, PROGRESSION_PLAYER_DEFAULTS.p),
    key: key ? keyParam(key) : PROGRESSION_PLAYER_DEFAULTS.key,
    ...practiceView(raw),
    ...figures(raw),
    chordSize: chordSize(raw),
  }
}
export const progressionPlayerSearch = routeSearch(
  validateProgressionPlayerSearch,
  PROGRESSION_PLAYER_DEFAULTS,
)
