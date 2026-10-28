import { isStepId, type StepId } from '@/entities/step'
import {
  isCardSide,
  isDrill,
  isLevelParam,
  isRounds,
  isTimeLimit,
  type TrainerView,
} from '@/features/trainer'
import { valueOr } from '@/shared/lib'
import { parseNoteInOctave, PIANO } from '@/shared/lib/music'
import { routeSearch, type Input, type Raw } from './read-search'

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
