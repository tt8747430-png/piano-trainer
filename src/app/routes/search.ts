import type { SearchSchemaInput } from '@tanstack/react-router'
import { isStepId, LEVELS, type Level, type StepId } from '@/entities/path'
import { isLeftFigureId, isPatternId, isRightFigureId, type PatternId } from '@/entities/pattern'
import { CHORD_SIZES, isCollectionId, type CollectionId } from '@/entities/piece'
import { PRACTICE_MODES } from '@/features/practice'
import { THEORY_QUIZZES, type TheoryQuiz } from '@/features/quiz'
import type { PlayerSearch } from '@/pages/player'
import type { SongsFilter } from '@/pages/songs'
import { isOneOf, readNote, valueOr, wholeIn } from '@/shared/lib'
import {
  CHORD_QUALITIES,
  chordRootSpelling,
  lastInversion,
  note,
  noteParam,
  pitchClassOf,
  SCALE_KINDS,
  scaleRootSpelling,
  type ChordFamily,
  type ScaleKind,
} from '@/shared/lib/music'
import { HANDS, PRACTICE_RHYTHM_IDS, TEMPO_RANGE } from '@/shared/lib/schedule'
import type { ChordView } from '@/widgets/chord-explorer'
import type { ScaleView } from '@/widgets/scale-explorer'

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
const isQuality = isOneOf(CHORD_QUALITIES)
const isScaleKind = isOneOf(SCALE_KINDS)
const isChordSize = isOneOf(CHORD_SIZES)
const isCollection = (value: unknown): value is CollectionId | 'all' =>
  value === 'all' || isCollectionId(value)
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

// Theory → Chords
export type ChordsStepId = `chords:${ChordFamily}`
export type ChordsSearch = ChordView & { readonly step?: ChordsStepId }
export const CHORDS_DEFAULTS: ChordsSearch = {
  root: noteParam(note('C')),
  quality: 'maj',
  inversion: 0,
  hands: 'rh',
}
const isChordHands = isOneOf<ChordView['hands']>(['rh', 'both'])
const isChordsStep = (value: unknown): value is ChordsStepId =>
  isStepId(value) && value.startsWith('chords:')
export function validateChordsSearch(input: Input<ChordsSearch>): ChordsSearch {
  const raw: Raw = input
  const quality = valueOr(isQuality, raw.quality, CHORDS_DEFAULTS.quality)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(chordRootSpelling(pitchClassOf(root), quality)) : CHORDS_DEFAULTS.root,
    quality,
    inversion: wholeIn(raw.inversion, 0, lastInversion(quality), CHORDS_DEFAULTS.inversion),
    hands: valueOr(isChordHands, raw.hands, CHORDS_DEFAULTS.hands),
    step: isChordsStep(raw.step) ? raw.step : undefined,
  }
}

// Theory → Scales
export type ScaleStepId = `scale:${ScaleKind}`
export type ScalesSearch = ScaleView & { readonly step?: ScaleStepId }
export const SCALES_DEFAULTS: ScalesSearch = {
  root: noteParam(note('C')),
  kind: 'major',
  fingers: 'none',
  rhythm: 'even',
  tempo: 80,
  hands: 'rh',
  chords: 3,
}
const isScaleFingers = isOneOf<ScaleView['fingers']>(['none', 'rh', 'lh'])
const isScaleChords = isOneOf<ScaleView['chords']>([3, 4])
const isScaleStep = (value: unknown): value is ScaleStepId =>
  isStepId(value) && value.startsWith('scale:')
export function validateScalesSearch(input: Input<ScalesSearch>): ScalesSearch {
  const raw: Raw = input
  const kind = valueOr(isScaleKind, raw.kind, SCALES_DEFAULTS.kind)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(scaleRootSpelling(pitchClassOf(root), kind)) : SCALES_DEFAULTS.root,
    kind,
    fingers: valueOr(isScaleFingers, raw.fingers, SCALES_DEFAULTS.fingers),
    rhythm: valueOr(isOneOf(PRACTICE_RHYTHM_IDS), raw.rhythm, SCALES_DEFAULTS.rhythm),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, SCALES_DEFAULTS.tempo),
    hands: valueOr(isHands, raw.hands, SCALES_DEFAULTS.hands),
    chords: valueOr(isScaleChords, raw.chords, SCALES_DEFAULTS.chords),
    step: isScaleStep(raw.step) ? raw.step : undefined,
  }
}

// Theory → Quiz
export interface QuizSearch {
  readonly mode: TheoryQuiz
}
export const QUIZ_DEFAULTS: QuizSearch = { mode: 'build-chord' }
export function validateQuizSearch(input: Input<QuizSearch>): QuizSearch {
  const raw: Raw = input
  return { mode: valueOr(isOneOf(THEORY_QUIZZES), raw.mode, QUIZ_DEFAULTS.mode) }
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
export const PLAYER_DEFAULTS: PlayerSearch = { hands: 'both', mode: 'listen' }
export function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw: Raw = input
  const key = readNote(raw.key)
  return {
    key: key ? noteParam(key) : undefined,
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    mode: valueOr(isOneOf(PRACTICE_MODES), raw.mode, PLAYER_DEFAULTS.mode),
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
    chordSize: isChordSize(raw.chordSize) ? raw.chordSize : undefined,
  }
}
