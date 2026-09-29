import type { SearchSchemaInput } from '@tanstack/react-router'
import { LESSON_CATEGORIES, type LessonCategory } from '@/entities/lesson'
import { isStepId, LEVELS, type Level, type StepId } from '@/entities/path'
import { isLeftFigureId, isPatternId, isRightFigureId, type PatternId } from '@/entities/pattern'
import { CHORD_SIZES, isSongCollectionId, type CollectionId } from '@/entities/piece'
import {
  CHROMATIC,
  CHROMATIC_DIRECTIONS,
  chordsParam,
  chromaticRoot,
  isLoopParam,
  PRACTICE_MODES,
  readChords,
} from '@/features/practice'
import type { LearnFilter } from '@/pages/learn'
import type { ChromaticSearch, PlayerSearch, WalkSearch } from '@/pages/player'
import type { SongsFilter } from '@/pages/songs'
import { isOneOf, keyListParam, readKeyList, readNote, valueOr, wholeIn } from '@/shared/lib'
import {
  ADDED_TONES,
  BUILT_SIZES,
  buildChord,
  builtRootSpelling,
  CHORD_NOTES,
  chordRootSpelling,
  FINGERINGS,
  fingeringsOf,
  fitParts,
  keyParam,
  lastInversion,
  note,
  noteParam,
  ownFingering,
  parseKey,
  partsParams,
  pitchClassOf,
  qualityIntervals,
  rootSpelling,
  readAlterations,
  SCALE_KINDS,
  scaleHasChords,
  scaleIntervals,
  scaleRootSpelling,
  SEVENTHS,
  spellInKey,
  tonicSpelling,
  TENSION_CHORDS,
  TRIADS,
  type ChordFamily,
  type Fingering,
  type ScaleKind,
} from '@/shared/lib/music'
import { HANDS, PRACTICE_RHYTHM_IDS, TEMPO_RANGE } from '@/shared/lib/schedule'
import type { ChordView } from '@/widgets/chord-explorer'
import type { FinderView } from '@/widgets/chord-finder'
import type { IntervalView } from '@/widgets/interval-explorer'
import type { KeyView } from '@/widgets/key-explorer'
import type { PassingView } from '@/widgets/passing-chords'
import type { ReharmoniseView } from '@/widgets/reharmonise'
import type { SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import type { ScaleView } from '@/widgets/scale-explorer'
import type { TensionView } from '@/widgets/tension-explorer'

/**
 * What the router hands a validator. Links may pass any subset of the params; each validator reads
 * the input as `Record<string, unknown>`, because a URL can hold anything in any of them.
 *
 * Every validator writes each of its params, an invalid optional one as `undefined`: the router lays
 * a route's search over the raw one from the URL, so a param left out would let the raw value through.
 */
type Input<S> = Partial<S> & SearchSchemaInput
type Raw = Readonly<Record<string, unknown>>

const isHands = isOneOf(HANDS)
const isScaleKind = isOneOf(SCALE_KINDS)
const isChordSize = isOneOf(CHORD_SIZES)
const isCollection = (value: unknown): value is CollectionId | 'all' =>
  value === 'all' || isSongCollectionId(value)
const isLevel = isOneOf<Level | 'any'>([...LEVELS, 'any'])
const isPlayerPattern = (value: unknown): value is PatternId | 'chart' =>
  value === 'chart' || isPatternId(value)

// Songs
export const SONGS_DEFAULTS: SongsFilter = { q: '', collection: 'all', level: 'any' }
export function validateSongsSearch(input: Input<SongsFilter>): SongsFilter {
  const raw: Raw = input
  return {
    q: typeof raw.q === 'string' ? raw.q : SONGS_DEFAULTS.q,
    collection: valueOr(isCollection, raw.collection, SONGS_DEFAULTS.collection),
    level: valueOr(isLevel, raw.level, SONGS_DEFAULTS.level),
  }
}

// Learn: its lessons' filter.
const isLessonCategory = isOneOf<LessonCategory | 'any'>([...LESSON_CATEGORIES, 'any'])
export const LEARN_DEFAULTS: LearnFilter = { level: 'any', category: 'any' }
export function validateLearnSearch(input: Input<LearnFilter>): LearnFilter {
  const raw: Raw = input
  return {
    level: valueOr(isLevel, raw.level, LEARN_DEFAULTS.level),
    category: valueOr(isLessonCategory, raw.category, LEARN_DEFAULTS.category),
  }
}

// Learn → Chords
export type ChordsStepId = `chords:${ChordFamily}`
export type ChordsSearch = ChordView & { readonly step?: ChordsStepId }
export const CHORDS_DEFAULTS: ChordsSearch = {
  root: noteParam(note('C')),
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: 'none',
  alter: '',
  inversion: 0,
  hands: 'rh',
}
const isTriad = isOneOf(TRIADS)
const isBuiltSize = isOneOf(BUILT_SIZES)
const isSeventh = isOneOf(SEVENTHS)
const isAddedTone = isOneOf(ADDED_TONES)
const isChordHands = isOneOf<ChordView['hands']>(['rh', 'both'])
const isChordsStep = (value: unknown): value is ChordsStepId =>
  isStepId(value) && value.startsWith('chords:')
export function validateChordsSearch(input: Input<ChordsSearch>): ChordsSearch {
  const raw: Raw = input
  const parts = fitParts({
    triad: valueOr(isTriad, raw.triad, CHORDS_DEFAULTS.triad),
    size: valueOr(isBuiltSize, raw.size, CHORDS_DEFAULTS.size),
    seventh: valueOr(isSeventh, raw.seventh, CHORDS_DEFAULTS.seventh),
    added: valueOr(isAddedTone, raw.added, CHORDS_DEFAULTS.added),
    alterations: readAlterations(raw.alter),
  })
  const read = readNote(raw.root)
  const root = read ? builtRootSpelling(pitchClassOf(read), parts) : note('C')
  const notes = buildChord(root, parts).tones.length
  return {
    root: noteParam(root),
    ...partsParams(parts),
    inversion: wholeIn(raw.inversion, 0, lastInversion(notes), CHORDS_DEFAULTS.inversion),
    hands: valueOr(isChordHands, raw.hands, CHORDS_DEFAULTS.hands),
    step: isChordsStep(raw.step) ? raw.step : undefined,
  }
}

// Learn → Scales
export type ScaleStepId = `scale:${ScaleKind}`
export type ScalesSearch = ScaleView & { readonly step?: ScaleStepId }
export const SCALES_DEFAULTS: ScalesSearch = {
  root: noteParam(note('C')),
  kind: 'major',
  show: 'scale',
  start: 1,
  fingers: 'none',
  rhythm: 'even',
  tempo: 80,
  hands: 'rh',
  chords: 3,
  inversion: 0,
  keysPlay: 'chords',
  arpeggio: false,
}
const isScaleShow = isOneOf<ScaleView['show']>(['scale', 'chords'])
const isKeysPlay = isOneOf<ScaleView['keysPlay']>(['chords', 'notes'])
const isScaleFingers = isOneOf<ScaleView['fingers']>(['none', 'rh', 'lh'])
const isChordNotes = isOneOf(CHORD_NOTES)
const isScaleStep = (value: unknown): value is ScaleStepId =>
  isStepId(value) && value.startsWith('scale:')
const isFingering = isOneOf(FINGERINGS)

/** A fingering the run may take and does not take by itself; else none, so the URL leaves it out. */
function chosenFingering(kind: ScaleKind, start: number, raw: unknown): Fingering | undefined {
  return isFingering(raw) &&
    raw !== ownFingering(kind, start) &&
    fingeringsOf(kind, start).includes(raw)
    ? raw
    : undefined
}
export function validateScalesSearch(input: Input<ScalesSearch>): ScalesSearch {
  const raw: Raw = input
  const kind = valueOr(isScaleKind, raw.kind, SCALES_DEFAULTS.kind)
  const root = readNote(raw.root)
  const start = wholeIn(raw.start, 1, scaleIntervals(kind).length, SCALES_DEFAULTS.start)
  const chords = scaleHasChords(kind)
    ? valueOr(isChordNotes, raw.chords, SCALES_DEFAULTS.chords)
    : SCALES_DEFAULTS.chords
  return {
    root: root ? noteParam(scaleRootSpelling(pitchClassOf(root), kind)) : SCALES_DEFAULTS.root,
    kind,
    show: scaleHasChords(kind)
      ? valueOr(isScaleShow, raw.show, SCALES_DEFAULTS.show)
      : SCALES_DEFAULTS.show,
    start,
    fingering: chosenFingering(kind, start - 1, raw.fingering),
    fingers: valueOr(isScaleFingers, raw.fingers, SCALES_DEFAULTS.fingers),
    rhythm: valueOr(isOneOf(PRACTICE_RHYTHM_IDS), raw.rhythm, SCALES_DEFAULTS.rhythm),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, SCALES_DEFAULTS.tempo),
    hands: valueOr(isHands, raw.hands, SCALES_DEFAULTS.hands),
    chords,
    inversion: wholeIn(raw.inversion, 0, lastInversion(chords), SCALES_DEFAULTS.inversion),
    keysPlay: valueOr(isKeysPlay, raw.keysPlay, SCALES_DEFAULTS.keysPlay),
    arpeggio: raw.arpeggio === true,
    step: isScaleStep(raw.step) ? raw.step : undefined,
  }
}

// Learn → Keys
export const KEYS_DEFAULTS: KeyView = {
  key: keyParam({ tonic: note('C'), minor: false }),
  chords: 3,
  inversion: 0,
}
const isKeyChords = isOneOf<KeyView['chords']>([3, 4])
export function validateKeysSearch(input: Input<KeyView>): KeyView {
  const raw: Raw = input
  const key = typeof raw.key === 'string' ? parseKey(raw.key) : null
  const chords = valueOr(isKeyChords, raw.chords, KEYS_DEFAULTS.chords)
  return {
    key: key
      ? keyParam({ tonic: tonicSpelling(pitchClassOf(key.tonic), key.minor), minor: key.minor })
      : KEYS_DEFAULTS.key,
    chords,
    inversion: wholeIn(raw.inversion, 0, lastInversion(chords), KEYS_DEFAULTS.inversion),
  }
}

// Learn → Intervals: the root in the reference's one spelling for its pitch class.
export const INTERVALS_DEFAULTS: IntervalView = { root: noteParam(note('C')) }
export function validateIntervalsSearch(input: Input<IntervalView>): IntervalView {
  const raw: Raw = input
  const read = readNote(raw.root)
  return {
    root: read ? noteParam(rootSpelling(pitchClassOf(read), false)) : INTERVALS_DEFAULTS.root,
  }
}

// Learn → Chord finder: the keys chosen, each once, lowest first.
export const FINDER_DEFAULTS: FinderView = { keys: '' }
export function validateFinderSearch(input: Input<FinderView>): FinderView {
  const raw: Raw = input
  return { keys: keyListParam(readKeyList(raw.keys)) }
}

// Learn → Reharmonise: a key, and a melody note spelled in it.
export const REHARMONISE_DEFAULTS: ReharmoniseView = {
  key: keyParam({ tonic: note('C'), minor: false }),
  note: noteParam(note('E')),
}
export function validateReharmoniseSearch(input: Input<ReharmoniseView>): ReharmoniseView {
  const raw: Raw = input
  const read = typeof raw.key === 'string' ? parseKey(raw.key) : null
  const key = read
    ? { tonic: tonicSpelling(pitchClassOf(read.tonic), read.minor), minor: read.minor }
    : { tonic: note('C'), minor: false }
  const melody = readNote(raw.note)
  return {
    key: keyParam(key),
    note: noteParam(spellInKey(pitchClassOf(melody ?? note('E')), key)),
  }
}

// Learn → Passing chords: two chords kept as typed (a line says when one cannot be read), and a key.
/** The most of a chord symbol a field keeps: the longest the table writes, and some. */
const TYPED_CHORD = 16
export const PASSING_DEFAULTS: PassingView = {
  key: keyParam({ tonic: note('C'), minor: false }),
  from: 'C',
  to: 'F',
}
const typedChord = (raw: unknown, fallback: string): string =>
  typeof raw === 'string' ? raw.slice(0, TYPED_CHORD) : fallback
export function validatePassingSearch(input: Input<PassingView>): PassingView {
  const raw: Raw = input
  const read = typeof raw.key === 'string' ? parseKey(raw.key) : null
  return {
    key: read
      ? keyParam({ tonic: tonicSpelling(pitchClassOf(read.tonic), read.minor), minor: read.minor })
      : PASSING_DEFAULTS.key,
    from: typedChord(raw.from, PASSING_DEFAULTS.from),
    to: typedChord(raw.to, PASSING_DEFAULTS.to),
  }
}

// Learn → Available tensions: the root spelled by the chord's one rule, as the Chords reference's.
const isTensionChord = isOneOf(TENSION_CHORDS)
export const TENSIONS_DEFAULTS: TensionView = { root: noteParam(note('C')), chord: 'd7' }
export function validateTensionsSearch(input: Input<TensionView>): TensionView {
  const raw: Raw = input
  const chord = valueOr(isTensionChord, raw.chord, TENSIONS_DEFAULTS.chord)
  const read = readNote(raw.root)
  return {
    root: read
      ? noteParam(chordRootSpelling(pitchClassOf(read), qualityIntervals(chord)))
      : TENSIONS_DEFAULTS.root,
    chord,
  }
}

// Check
export interface CheckSearch {
  readonly of?: StepId
}
export function validateCheckSearch(input: Input<CheckSearch>): CheckSearch {
  const raw: Raw = input
  return { of: isStepId(raw.of) ? raw.of : undefined }
}

// Player: key, tempo, pattern and chord size default to the piece's own, so their absence is the default.
export const PLAYER_DEFAULTS: PlayerSearch = {
  mode: 'listen',
  speedTraining: false,
  hands: 'both',
  swing: false,
}
/** The Player's own params: how it goes, whatever it plays. */
function practiceView(raw: Raw): PracticeView {
  return {
    mode: valueOr(isOneOf(PRACTICE_MODES), raw.mode, PLAYER_DEFAULTS.mode),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
    speedTraining: raw.speedTraining === true,
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    swing: raw.swing === true,
    loop: isLoopParam(raw.loop) ? raw.loop : undefined,
  }
}

/** The pattern, figures and chord size a Player's Setup chooses: any source's. */
function setupFigures(raw: Raw): Omit<SetupParams, 'key'> {
  return {
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
    chordSize: isChordSize(raw.chordSize) ? raw.chordSize : undefined,
  }
}

export function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw: Raw = input
  const key = readNote(raw.key)
  return { ...practiceView(raw), key: key ? noteParam(key) : undefined, ...setupFigures(raw) }
}

// Player → Walk the chords: the scale, then the Player's own params.
export const WALK_DEFAULTS: WalkSearch = {
  root: noteParam(note('C')),
  kind: 'major',
  ...PLAYER_DEFAULTS,
}
export function validateWalkSearch(input: Input<WalkSearch>): WalkSearch {
  const raw: Raw = input
  const kind = valueOr(isScaleKind, raw.kind, WALK_DEFAULTS.kind)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(scaleRootSpelling(pitchClassOf(root), kind)) : WALK_DEFAULTS.root,
    kind,
    ...practiceView(raw),
    ...setupFigures(raw),
  }
}

// Player → Chromatic walk: the chords, root and direction, then the Player's own params.
export const CHROMATIC_DEFAULTS: ChromaticSearch = {
  chords: chordsParam(CHROMATIC.chords),
  root: noteParam(note('C')),
  direction: CHROMATIC.direction,
  ...PLAYER_DEFAULTS,
}
const isDirection = isOneOf(CHROMATIC_DIRECTIONS)
export function validateChromaticSearch(input: Input<ChromaticSearch>): ChromaticSearch {
  const raw: Raw = input
  const chords = readChords(raw.chords)
  const root = readNote(raw.root)
  return {
    chords: chordsParam(chords),
    root: noteParam(root ? chromaticRoot(pitchClassOf(root), chords[0]) : note('C')),
    direction: valueOr(isDirection, raw.direction, CHROMATIC_DEFAULTS.direction),
    ...practiceView(raw),
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
  }
}
