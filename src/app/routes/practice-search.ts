import { isStage, isStepId, type StepId } from '@/entities/step'
import {
  isCardSide,
  isDrill,
  isLevelParam,
  isRounds,
  isTimeLimit,
  type TrainerView,
} from '@/features/trainer'
import { isHanonNumber, isHanonRhythm, isOctaves, isTonality } from '@/entities/exercise'
import type { ExercisePageSearch } from '@/pages/exercise'
import type { PracticeLibraryView, PracticeSort } from '@/widgets/practice-library'
import { readNote, readText, valueOr, wholeIn } from '@/shared/lib'
import { noteParam, parseNoteInOctave, PIANO } from '@/shared/lib/music'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { isHands, routeSearch, type Input, type Raw } from './read-search'

// The Check: the step it checks; none is not found, so nothing is left out of the URL.
interface CheckSearch {
  readonly of?: StepId
}
export function validateCheckSearch(input: Input<CheckSearch>): CheckSearch {
  const raw: Raw = input
  return { of: isStepId(raw.of) ? raw.of : undefined }
}

// A trainer: its level, drill and rounds, its time limit, then Custom's choices, each absent for its own.
const TRAINER_DEFAULTS: TrainerView = { rounds: 10 }
const list = (raw: unknown) =>
  typeof raw === 'string' && /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/.test(raw) ? raw : undefined
/** Notes as the URL writes them, ASCII `#` and `b` (`C.F#.Bb`). */
const notes = (raw: unknown) =>
  typeof raw === 'string' && /^[A-G](#|b)?(\.[A-G](#|b)?)*$/.test(raw) ? raw : undefined
const on = (raw: unknown) => (raw === true ? true : undefined)
const either = <T>(is: (value: unknown) => value is T, raw: unknown) => (is(raw) ? raw : undefined)
/** A note with its octave on the piano's keys; one off them is dropped. */
const noteInOctave = (raw: unknown) => {
  if (typeof raw !== 'string') return undefined
  const key = parseNoteInOctave(raw)?.midi
  return key !== undefined && key >= PIANO.from && key <= PIANO.to ? raw : undefined
}
export function readTrainerSearch(raw: Raw): TrainerView {
  return {
    level: isLevelParam(raw.level) ? raw.level : undefined,
    rounds: valueOr(isRounds, raw.rounds, TRAINER_DEFAULTS.rounds),
    drill: either(isDrill, raw.drill),
    show: either(isCardSide, raw.show),
    limit: either(isTimeLimit, raw.limit),
    chords: list(raw.chords),
    roots: notes(raw.roots),
    inversions: on(raw.inversions),
    scales: list(raw.scales),
    intervals: list(raw.intervals),
    ways: list(raw.ways),
    arpeggio: on(raw.arpeggio),
    kinds: list(raw.kinds),
    descending: on(raw.descending),
    from: noteInOctave(raw.from),
    to: noteInOctave(raw.to),
    accidentals: on(raw.accidentals),
  }
}
export const trainerSearch = routeSearch(readTrainerSearch, TRAINER_DEFAULTS)

// A Practice page's Settings (A24): the page its gear was pressed on, kept only for Back.
export const PRACTICE_SETTINGS_FROM = [
  'scales',
  'intervals',
  'progressions',
  'chord-finder',
] as const
export type PracticeSettingsFrom = (typeof PRACTICE_SETTINGS_FROM)[number]
export const isPracticeSettingsFrom = (value: unknown): value is PracticeSettingsFrom =>
  PRACTICE_SETTINGS_FROM.some((page) => page === value)
export interface PracticeSettingsSearch {
  readonly from?: PracticeSettingsFrom
}
export function validatePracticeSettingsSearch(
  input: Input<PracticeSettingsSearch>,
): PracticeSettingsSearch {
  const raw: Raw = input
  return { from: isPracticeSettingsFrom(raw.from) ? raw.from : undefined }
}

// An exercise's page (A41): the key, hands, octaves and tempo it is set to start at, each absent for
// the exercise's own.
const EXERCISE_PAGE_DEFAULTS: ExercisePageSearch = {}
export function readExercisePageSearch(raw: Raw): ExercisePageSearch {
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(root) : undefined,
    tonality: isTonality(raw.tonality) ? raw.tonality : undefined,
    hands: isHands(raw.hands) ? raw.hands : undefined,
    octaves: isOctaves(raw.octaves) ? raw.octaves : undefined,
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
    hanon: isHanonNumber(raw.hanon) ? raw.hanon : undefined,
    rhythm: isHanonRhythm(raw.rhythm) ? raw.rhythm : undefined,
    order: raw.order === 'chromatic' ? 'chromatic' : undefined,
    target: wholeIn(raw.target, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
  }
}
export const exercisePageSearch = routeSearch(readExercisePageSearch, EXERCISE_PAGE_DEFAULTS)

// A library of Practice's (R30-4: Exercises, Accompaniment, Progressions), as Songs' holds its
// filters: what is searched, the sort, the place open in its tree, the one level shown. A place is a
// word the page reads against its own books; one it does not have shows All.
export const PRACTICE_LIBRARY_DEFAULTS: PracticeLibraryView = {
  q: '',
  sort: 'group',
  place: 'all',
  stage: 'any',
}
const PRACTICE_SORTS: readonly string[] = [
  'group',
  'name',
  'level',
] satisfies readonly PracticeSort[]
const isPracticeSort = (value: unknown): value is PracticeSort =>
  typeof value === 'string' && PRACTICE_SORTS.includes(value)
export function readPracticeLibrarySearch(raw: Raw): PracticeLibraryView {
  return {
    q: readText(raw.q, PRACTICE_LIBRARY_DEFAULTS.q),
    sort: isPracticeSort(raw.sort) ? raw.sort : PRACTICE_LIBRARY_DEFAULTS.sort,
    place:
      typeof raw.place === 'string' && /^[a-z0-9-]{1,40}$/i.test(raw.place)
        ? raw.place
        : PRACTICE_LIBRARY_DEFAULTS.place,
    stage: isStage(raw.stage) ? raw.stage : PRACTICE_LIBRARY_DEFAULTS.stage,
  }
}
/** What a library remembers between visits: its place and its sort; the search and level are one visit's. */
export const PRACTICE_LIBRARY_KEPT = [
  'place',
  'sort',
] as const satisfies readonly (keyof PracticeLibraryView)[]
export const practiceLibrarySearch = routeSearch(
  readPracticeLibrarySearch,
  PRACTICE_LIBRARY_DEFAULTS,
)
