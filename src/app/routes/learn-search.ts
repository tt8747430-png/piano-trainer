import { LESSON_CATEGORIES, type LessonCategory } from '@/entities/lesson'
import { isPatternRef, type PatternRef } from '@/entities/pattern'
import { isStepId } from '@/entities/path'
import type { LearnFilter } from '@/pages/learn'
import { isOneOf, partsParams, readAlterations, readNote, valueOr, wholeIn } from '@/shared/lib'
import {
  ADDED_TONES,
  buildChord,
  BUILT_SIZES,
  builtRootSpelling,
  CHORD_NOTES,
  type ChordFamily,
  circleKey,
  type Fingering,
  FINGERINGS,
  fingeringsOf,
  fitParts,
  keyParam,
  lastInversion,
  note,
  noteParam,
  ownFingering,
  parseKey,
  pitchClassOf,
  qualityRootSpelling,
  rootSpelling,
  scaleHasChords,
  scaleIntervals,
  type ScaleKind,
  scaleRootSpelling,
  SEVENTHS,
  TENSION_CHORDS,
  TRIADS,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, TEMPO_RANGE } from '@/shared/lib/schedule'
import type { ChordView } from '@/widgets/chord-explorer'
import type { IntervalView } from '@/widgets/interval-explorer'
import type { KeyView } from '@/widgets/key-explorer'
import type { ScaleView } from '@/widgets/scale-explorer'
import type { TensionView } from '@/widgets/tension-explorer'
import {
  C_MAJOR_PARAM,
  isHands,
  isLevel,
  isScaleKind,
  routeSearch,
  type Input,
  type Raw,
} from './read-search'

// Learn: its lessons' filter, and the references.

const isLessonCategory = isOneOf<LessonCategory | 'any'>([...LESSON_CATEGORIES, 'any'])
export const LEARN_DEFAULTS: LearnFilter = { level: 'any', category: 'any' }
export function readLearnSearch(raw: Raw): LearnFilter {
  return {
    level: valueOr(isLevel, raw.level, LEARN_DEFAULTS.level),
    category: valueOr(isLessonCategory, raw.category, LEARN_DEFAULTS.category),
  }
}
export const learnSearch = routeSearch(readLearnSearch, LEARN_DEFAULTS)

// Chords
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
export function readChordsSearch(raw: Raw): ChordsSearch {
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
export const chordsSearch = routeSearch(readChordsSearch, CHORDS_DEFAULTS)
/** A link names a chord; the hands it is shown in are the learner's. */
export const CHORDS_KEPT: readonly (keyof ChordsSearch & string)[] = ['hands']

// Scales
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
const isRhythm = isOneOf(PRACTICE_RHYTHM_IDS)

/** A fingering the run may take and does not take by itself; else none, so the URL leaves it out. */
function chosenFingering(kind: ScaleKind, start: number, raw: unknown): Fingering | undefined {
  return isFingering(raw) &&
    raw !== ownFingering(kind, start) &&
    fingeringsOf(kind, start).includes(raw)
    ? raw
    : undefined
}
export function readScalesSearch(raw: Raw): ScalesSearch {
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
    rhythm: valueOr(isRhythm, raw.rhythm, SCALES_DEFAULTS.rhythm),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, SCALES_DEFAULTS.tempo),
    hands: valueOr(isHands, raw.hands, SCALES_DEFAULTS.hands),
    chords,
    inversion: wholeIn(raw.inversion, 0, lastInversion(chords), SCALES_DEFAULTS.inversion),
    keysPlay: valueOr(isKeysPlay, raw.keysPlay, SCALES_DEFAULTS.keysPlay),
    arpeggio: raw.arpeggio === true,
    step: isScaleStep(raw.step) ? raw.step : undefined,
  }
}
export const scalesSearch = routeSearch(readScalesSearch, SCALES_DEFAULTS)
/** A link names a scale; how it is fingered, its rhythm, tempo and hands are the learner's. */
export const SCALES_KEPT: readonly (keyof ScalesSearch & string)[] = [
  'fingers',
  'rhythm',
  'tempo',
  'hands',
]

// Keys: a key as the circle spells it.
export const KEYS_DEFAULTS: KeyView = { key: C_MAJOR_PARAM, chords: 3, inversion: 0 }
const isKeyChords = isOneOf<KeyView['chords']>([3, 4])
export function readKeysSearch(raw: Raw): KeyView {
  const key = typeof raw.key === 'string' ? parseKey(raw.key) : null
  const chords = valueOr(isKeyChords, raw.chords, KEYS_DEFAULTS.chords)
  return {
    key: key ? keyParam(circleKey(pitchClassOf(key.tonic), key.minor)) : KEYS_DEFAULTS.key,
    chords,
    inversion: wholeIn(raw.inversion, 0, lastInversion(chords), KEYS_DEFAULTS.inversion),
  }
}
export const keysSearch = routeSearch(readKeysSearch, KEYS_DEFAULTS)

// Intervals: the root in the reference's one spelling for its pitch class.
export const INTERVALS_DEFAULTS: IntervalView = { root: noteParam(note('C')) }
export function readIntervalsSearch(raw: Raw): IntervalView {
  const read = readNote(raw.root)
  return {
    root: read ? noteParam(rootSpelling(pitchClassOf(read), false)) : INTERVALS_DEFAULTS.root,
  }
}
export const intervalsSearch = routeSearch(readIntervalsSearch, INTERVALS_DEFAULTS)

// Available tensions: the root spelled by the chord's one rule, as the Chords reference's.
const isTensionChord = isOneOf(TENSION_CHORDS)
export const TENSIONS_DEFAULTS: TensionView = { root: noteParam(note('C')), chord: 'd7' }
export function readTensionsSearch(raw: Raw): TensionView {
  const chord = valueOr(isTensionChord, raw.chord, TENSIONS_DEFAULTS.chord)
  const read = readNote(raw.root)
  return {
    root: read ? noteParam(qualityRootSpelling(pitchClassOf(read), chord)) : TENSIONS_DEFAULTS.root,
    chord,
  }
}
export const tensionsSearch = routeSearch(readTensionsSearch, TENSIONS_DEFAULTS)

/** A new pattern's search: the pattern it starts from (Make your own from it), if any. */
export interface NewPatternSearch {
  readonly from?: PatternRef
}
export const validateNewPatternSearch = (input: Input<NewPatternSearch>): NewPatternSearch => {
  const raw: Raw = input
  return { from: isPatternRef(raw.from) ? raw.from : undefined }
}
