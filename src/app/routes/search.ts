import type { SearchSchemaInput } from '@tanstack/react-router'
import { isStepId, LEVELS, type Level, type StepId } from '@/entities/path'
import { isLeftFigureId, isPatternId, isRightFigureId, type PatternId } from '@/entities/pattern'
import { CHORD_SIZES, isSongCollectionId, type CollectionId } from '@/entities/piece'
import { isLoopParam, PRACTICE_MODES } from '@/features/practice'
import type { PlayerSearch } from '@/pages/player'
import type { SongsFilter } from '@/pages/songs'
import { isOneOf, readNote, valueOr, wholeIn } from '@/shared/lib'
import {
  CHORD_NOTES,
  CHORD_QUALITIES,
  chordRootSpelling,
  FINGERINGS,
  fingeringsOf,
  lastInversion,
  lastStackInversion,
  note,
  noteParam,
  ownFingering,
  pitchClassOf,
  SCALE_KINDS,
  scaleHasChords,
  scaleIntervals,
  scaleRootSpelling,
  type ChordFamily,
  type Fingering,
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

// Learn → Chords
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
    inversion: wholeIn(raw.inversion, 0, lastStackInversion(chords), SCALES_DEFAULTS.inversion),
    keysPlay: valueOr(isKeysPlay, raw.keysPlay, SCALES_DEFAULTS.keysPlay),
    arpeggio: raw.arpeggio === true,
    step: isScaleStep(raw.step) ? raw.step : undefined,
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
export function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw: Raw = input
  const key = readNote(raw.key)
  return {
    mode: valueOr(isOneOf(PRACTICE_MODES), raw.mode, PLAYER_DEFAULTS.mode),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
    speedTraining: raw.speedTraining === true,
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    swing: raw.swing === true,
    loop: isLoopParam(raw.loop) ? raw.loop : undefined,
    key: key ? noteParam(key) : undefined,
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
    chordSize: isChordSize(raw.chordSize) ? raw.chordSize : undefined,
  }
}
