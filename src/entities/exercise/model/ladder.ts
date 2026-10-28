import type { Exercise } from './types'
import type { ExerciseChoice } from './choice'

/**
 * The tempo ladder an exercise climbs, ♩ = 60 to 132 in steps of 12: a rung up once four passes in a
 * row are clean, a rung down after a slip.
 */
export const TEMPO_LADDER = [60, 72, 84, 96, 108, 120, 132] as const
export type Rung = (typeof TEMPO_LADDER)[number]

/** The rung a tempo stands on, if it stands on one. */
export const rungOf = (tempo: number): Rung | null =>
  TEMPO_LADDER.find((rung) => rung === tempo) ?? null

/** The next rung up from a tempo (the top stays the top). */
export const rungAbove = (tempo: number): Rung => TEMPO_LADDER.find((rung) => rung > tempo) ?? TOP

/** The ladder's top rung. */
const TOP: Rung = 132

/**
 * What an exercise's last tempo is kept under: the exercise, and for Hanon the number, each of his
 * being an exercise of its own.
 */
export const tempoKey = (exercise: Exercise, choice: Pick<ExerciseChoice, 'hanon'>): string =>
  exercise.fields.hanon ? `${exercise.id}:${choice.hanon}` : exercise.id
