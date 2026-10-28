import { type SearchMiddleware, stripSearchParams } from '@tanstack/react-router'
import { isStepId } from '@/entities/step'
import { PROGRESSION } from '@/features/practice'
import {
  isOneOf,
  partsParams,
  readAdded,
  readAlterations,
  readNote,
  valueOr,
  wholeIn,
} from '@/shared/lib'
import {
  buildChord,
  BUILT_SIZES,
  CHORD_NOTES,
  chordInversions,
  type ChordFamily,
  type Fingering,
  FINGERINGS,
  fingeringsOf,
  fitParts,
  INVERSIONS,
  isInversion,
  keyFromParam,
  keyMode,
  keyParam,
  type KeyParam,
  lastInversion,
  note,
  noteParam,
  ownFingering,
  scaleHasChords,
  scaleIntervals,
  type ScaleKind,
  SEVENTHS,
  TRIADS,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, TEMPO_RANGE } from '@/shared/lib/schedule'
import type { ChordView } from '@/widgets/chord-explorer'
import { INTERVAL_WAYS, type IntervalWay } from '@/shared/lib/schedule'
import type { IntervalView } from '@/widgets/interval-explorer'
import type { ProgressionsView } from '@/widgets/progression-explorer'
import type { ScaleShow, ScaleView } from '@/widgets/scale-explorer'
import {
  C_MAJOR_PARAM,
  type Input,
  isChordSize,
  isHands,
  isLeadIn,
  isScaleKind,
  readKey,
  readNumerals,
  routeSearch,
  type Raw,
} from './read-search'

// Practice's explorers (ADR 0052), each a page that shows a thing on the keys: a chord, a scale and its
// key, the intervals over a root, a progression.

// Chords
type ChordsStepId = `chords:${ChordFamily}`
type ChordsSearch = ChordView & { readonly step?: ChordsStepId }
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
  const asked = wholeIn(raw.inversion, 0, INVERSIONS.length - 1, CHORDS_DEFAULTS.inversion)
  return {
    root: noteParam(root),
    ...partsParams(parts),
    inversion: chordInversions(buildChord(root, parts).tones).includes(asked)
      ? asked
      : CHORDS_DEFAULTS.inversion,
    hands: valueOr(isChordHands, raw.hands, CHORDS_DEFAULTS.hands),
    step: isChordsStep(raw.step) ? raw.step : undefined,
  }
}
export const chordsSearch = routeSearch(readChordsSearch, CHORDS_DEFAULTS)
/** A link names a chord; the hands it is shown in are the learner's. */
export const CHORDS_KEPT: readonly (keyof ChordsSearch & string)[] = ['hands']

// Scales
type ScaleStepId = `scale:${ScaleKind}`
type ScalesSearch = ScaleView & { readonly step?: ScaleStepId }
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
  const melody = readNote(raw.melody)
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
    onKeys: isOneOf<NonNullable<ScaleView['onKeys']>>(['notes', 'lh', 'rh'])(raw.onKeys)
      ? raw.onKeys
      : undefined,
    chords,
    inversion: wholeIn(raw.inversion, 0, lastInversion(chords), SCALES_DEFAULTS.inversion),
    keysPlay: valueOr(isKeysPlay, raw.keysPlay, SCALES_DEFAULTS.keysPlay),
    arpeggio: raw.arpeggio === true,
    melody: melody ? noteParam(melody) : undefined,
    onlyInKey: raw.onlyInKey === true ? true : undefined,
    step: isScaleStep(raw.step) ? raw.step : undefined,
  }
}
export const scalesSearch = routeSearch(readScalesSearch, SCALES_DEFAULTS)
/** A link names a scale; its rhythm, tempo and hands are the learner's. */
export const SCALES_KEPT: readonly (keyof ScalesSearch & string)[] = ['rhythm', 'tempo', 'hands']

// Intervals: the root as the learner wrote it, and how a row plays (both notes at once unless asked).
export const INTERVALS_DEFAULTS: IntervalView = { root: noteParam(note('C')), way: 'together' }
const isIntervalWay = (raw: unknown): raw is IntervalWay => INTERVAL_WAYS.some((way) => way === raw)
export function readIntervalsSearch(raw: Raw): IntervalView {
  const read = readNote(raw.root)
  return {
    root: read ? noteParam(read) : INTERVALS_DEFAULTS.root,
    way: valueOr(isIntervalWay, raw.way, INTERVALS_DEFAULTS.way),
  }
}
export const intervalsSearch = routeSearch(readIntervalsSearch, INTERVALS_DEFAULTS)

// Progressions: numerals in a key at a chord size, and what leads into each chord, where something
// does; an unread line is the Player's own.
export const PROGRESSIONS_DEFAULTS: ProgressionsView = {
  key: C_MAJOR_PARAM,
  p: PROGRESSION.numerals,
  size: 'triads',
  inversion: 0,
  nearest: true,
}
/** The line a key opens on with none of its own: the default progression's line in its mode. */
const openingLine = (key: KeyParam): string =>
  keyFromParam(key).minor ? PROGRESSION.minorNumerals : PROGRESSION.numerals
export function readProgressionsSearch(raw: Raw): ProgressionsView {
  const read = readKey(raw.key)
  const key = read ? keyParam(read) : PROGRESSIONS_DEFAULTS.key
  return {
    key,
    p: readNumerals(raw.p, openingLine(key)),
    size: valueOr(isChordSize, raw.size, PROGRESSIONS_DEFAULTS.size),
    inversion: valueOr(isInversion, raw.inversion, PROGRESSIONS_DEFAULTS.inversion),
    nearest: raw.nearest !== false,
    lead: isLeadIn(raw.lead) ? raw.lead : undefined,
    between:
      typeof raw.between === 'number' && Number.isInteger(raw.between) && raw.between > 0
        ? raw.between
        : undefined,
    inKey: raw.inKey === true ? true : undefined,
  }
}
/** Progressions' line left out of the URL only where its key opens on it. */
const stripOpeningLine: SearchMiddleware<ProgressionsView> = (context) => {
  const search = context.next(context.search)
  const opening = openingLine(readProgressionsSearch({ key: search.key }).key)
  return search.p === opening
    ? stripSearchParams<ProgressionsView>({ p: opening })({ search, next: (each) => each })
    : search
}
const { p: _line, ...PROGRESSIONS_STRIPPED } = PROGRESSIONS_DEFAULTS
export const progressionsSearch = {
  validateSearch: (input: Input<ProgressionsView>): ProgressionsView =>
    readProgressionsSearch(input),
  search: {
    middlewares: [stripSearchParams<ProgressionsView>(PROGRESSIONS_STRIPPED), stripOpeningLine],
  },
}
