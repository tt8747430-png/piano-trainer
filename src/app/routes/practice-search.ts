import { isStepId, type StepId } from '@/entities/path'
import { isLevelParam, isRounds, type TrainerView } from '@/features/trainer'
import { valueOr } from '@/shared/lib'
import { parseNoteInOctave } from '@/shared/lib/music'
import { routeSearch, type Input, type Raw } from './read-search'

// The Check: the step it checks; none is not found, so nothing is left out of the URL.
export interface CheckSearch {
  readonly of?: StepId
}
export function validateCheckSearch(input: Input<CheckSearch>): CheckSearch {
  const raw: Raw = input
  return { of: isStepId(raw.of) ? raw.of : undefined }
}

// A trainer: its level and rounds, then Custom's choices, each absent for its own.
export const TRAINER_DEFAULTS: TrainerView = { rounds: 10 }
const list = (raw: unknown) =>
  typeof raw === 'string' && /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/.test(raw) ? raw : undefined
const on = (raw: unknown) => (raw === true ? true : undefined)
const noteInOctave = (raw: unknown) =>
  typeof raw === 'string' && parseNoteInOctave(raw) ? raw : undefined
export function readTrainerSearch(raw: Raw): TrainerView {
  return {
    level: isLevelParam(raw.level) ? raw.level : undefined,
    rounds: valueOr(isRounds, raw.rounds, TRAINER_DEFAULTS.rounds),
    families: list(raw.families),
    scales: list(raw.scales),
    intervals: list(raw.intervals),
    ways: list(raw.ways),
    qualities: list(raw.qualities),
    arpeggio: on(raw.arpeggio),
    kinds: list(raw.kinds),
    descending: on(raw.descending),
    from: noteInOctave(raw.from),
    to: noteInOctave(raw.to),
    accidentals: on(raw.accidentals),
  }
}
export const trainerSearch = routeSearch(readTrainerSearch, TRAINER_DEFAULTS)
