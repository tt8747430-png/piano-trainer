import { isPatternRef, isReferencePart, type PatternRef } from '@/entities/pattern'
import { isStepId } from '@/entities/path'
import { PROGRESSION } from '@/features/practice'
import {
  isOneOf,
  keyListParam,
  partsParams,
  readAdded,
  readAlterations,
  readKeyList,
  readNote,
  readText,
  valueOr,
  wholeIn,
} from '@/shared/lib'
import {
  buildChord,
  BUILT_SIZES,
  CHORD_NOTES,
  type ChordFamily,
  type Fingering,
  FINGERINGS,
  fingeringsOf,
  fitParts,
  keyMode,
  keyParam,
  lastInversion,
  note,
  noteParam,
  ownFingering,
  pitchClassOf,
  scaleHasChords,
  scaleIntervals,
  type ScaleKind,
  SEVENTHS,
  spellInKey,
  TRIADS,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, TEMPO_RANGE } from '@/shared/lib/schedule'
import type { ChordView } from '@/widgets/chord-explorer'
import type { FinderView } from '@/widgets/chord-finder'
import type { IntervalView } from '@/widgets/interval-explorer'
import type { PassingView } from '@/widgets/passing-chords'
import type { ProgressionsView } from '@/widgets/progressions'
import type { ReharmoniseView } from '@/widgets/reharmonise'
import type { ScaleShow, ScaleView } from '@/widgets/scale-explorer'
import type { AccompanimentView } from '@/widgets/subject-tabs'
import {
  C_MAJOR,
  C_MAJOR_PARAM,
  isChordSize,
  isHands,
  isScaleKind,
  readKey,
  readNumerals,
  routeSearch,
  type Input,
  type Raw,
} from './read-search'

// The pages Practice explores with: a chord, a scale and its key, intervals, tensions, and the pages that
// work a thing out (the chord of the keys played, a melody note's chords, passing chords, a progression).

// Chords
export type ChordsStepId = `chords:${ChordFamily}`
export type ChordsSearch = ChordView & { readonly step?: ChordsStepId }
export const CHORDS_DEFAULTS: ChordsSearch = {
  root: noteParam(note('C')),
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: '',
  alter: '',
  inversion: 0,
  hands: 'rh',
}
const isTriad = isOneOf(TRIADS)
const isBuiltSize = isOneOf(BUILT_SIZES)
const isSeventh = isOneOf(SEVENTHS)
const isChordHands = isOneOf<ChordView['hands']>(['rh', 'both'])
const isChordsStep = (value: unknown): value is ChordsStepId =>
  isStepId(value) && value.startsWith('chords:')
export function readChordsSearch(raw: Raw): ChordsSearch {
  const parts = fitParts({
    triad: valueOr(isTriad, raw.triad, CHORDS_DEFAULTS.triad),
    size: valueOr(isBuiltSize, raw.size, CHORDS_DEFAULTS.size),
    seventh: valueOr(isSeventh, raw.seventh, CHORDS_DEFAULTS.seventh),
    added: readAdded(raw.added),
    alterations: readAlterations(raw.alter),
  })
  const read = readNote(raw.root)
  const root = read ?? note('C')
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
  rhythm: 'even',
  tempo: 80,
  hands: 'rh',
  chords: 3,
  inversion: 0,
  keysPlay: 'chords',
  arpeggio: false,
}
/** The views a scale has: its run, its chords with seven notes, its key where it is a key's scale. */
const scaleShows = (kind: ScaleKind): readonly ScaleShow[] => [
  'scale',
  ...(scaleHasChords(kind) ? (['chords'] as const) : []),
  ...(keyMode(kind) === null ? [] : (['key'] as const)),
]
const isKeysPlay = isOneOf<ScaleView['keysPlay']>(['chords', 'notes'])
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
    root: root ? noteParam(root) : SCALES_DEFAULTS.root,
    kind,
    show: valueOr(isOneOf(scaleShows(kind)), raw.show, SCALES_DEFAULTS.show),
    start,
    fingering: chosenFingering(kind, start - 1, raw.fingering),
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
/** A link names a scale; its rhythm, tempo and hands are the learner's. */
export const SCALES_KEPT: readonly (keyof ScalesSearch & string)[] = ['rhythm', 'tempo', 'hands']

// Intervals: the root as the learner wrote it.
export const INTERVALS_DEFAULTS: IntervalView = { root: noteParam(note('C')) }
export function readIntervalsSearch(raw: Raw): IntervalView {
  const read = readNote(raw.root)
  return {
    root: read ? noteParam(read) : INTERVALS_DEFAULTS.root,
  }
}
export const intervalsSearch = routeSearch(readIntervalsSearch, INTERVALS_DEFAULTS)

/** A new pattern's search: the pattern it starts from (Make your own from it), if any. */
export interface NewPatternSearch {
  readonly from?: PatternRef
}
export const validateNewPatternSearch = (input: Input<NewPatternSearch>): NewPatternSearch => {
  const raw: Raw = input
  return { from: isPatternRef(raw.from) ? raw.from : undefined }
}

// Chord finder: the keys chosen, each once, lowest first.
export const FINDER_DEFAULTS: FinderView = { keys: '' }
export function readFinderSearch(raw: Raw): FinderView {
  return { keys: keyListParam(readKeyList(raw.keys)) }
}
export const finderSearch = routeSearch(readFinderSearch, FINDER_DEFAULTS)

// Reharmonise: a key, and a melody note spelled in it.
export const REHARMONISE_DEFAULTS: ReharmoniseView = {
  key: C_MAJOR_PARAM,
  note: noteParam(note('E')),
}
export function readReharmoniseSearch(raw: Raw): ReharmoniseView {
  const key = readKey(raw.key) ?? C_MAJOR
  const melody = readNote(raw.note) ?? note('E')
  return { key: keyParam(key), note: noteParam(spellInKey(pitchClassOf(melody), key)) }
}
export const reharmoniseSearch = routeSearch(readReharmoniseSearch, REHARMONISE_DEFAULTS)

// Passing chords: two chords kept as typed (a line says when one cannot be read), and a key.
/** The most of a chord symbol a field keeps: the longest the table writes, and some. */
const TYPED_CHORD = 16
export const PASSING_DEFAULTS: PassingView = { key: C_MAJOR_PARAM, from: 'C', to: 'F' }
export function readPassingSearch(raw: Raw): PassingView {
  const key = readKey(raw.key)
  return {
    key: key ? keyParam(key) : PASSING_DEFAULTS.key,
    from: readText(raw.from, PASSING_DEFAULTS.from).slice(0, TYPED_CHORD),
    to: readText(raw.to, PASSING_DEFAULTS.to).slice(0, TYPED_CHORD),
  }
}
export const passingSearch = routeSearch(readPassingSearch, PASSING_DEFAULTS)

// Progressions: numerals in a key at a chord size; an unread line is the Player's own.
export const PROGRESSIONS_DEFAULTS: ProgressionsView = {
  key: C_MAJOR_PARAM,
  p: PROGRESSION.numerals,
  size: 'triads',
}
export function readProgressionsSearch(raw: Raw): ProgressionsView {
  const key = readKey(raw.key)
  return {
    key: key ? keyParam(key) : PROGRESSIONS_DEFAULTS.key,
    p: readNumerals(raw.p, PROGRESSIONS_DEFAULTS.p),
    size: valueOr(isChordSize, raw.size, PROGRESSIONS_DEFAULTS.size),
  }
}
export const progressionsSearch = routeSearch(readProgressionsSearch, PROGRESSIONS_DEFAULTS)

// Accompaniment: the page of it shown, its first method book's unless the URL names another.
const ACCOMPANIMENT_DEFAULTS: AccompanimentView = { show: 'called-to-play' }
export function readAccompanimentSearch(raw: Raw): AccompanimentView {
  return { show: valueOr(isReferencePart, raw.show, ACCOMPANIMENT_DEFAULTS.show) }
}
export const accompanimentSearch = routeSearch(readAccompanimentSearch, ACCOMPANIMENT_DEFAULTS)
