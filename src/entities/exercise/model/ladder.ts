import { keyParam } from '@/shared/lib/music'
import type { Exercise } from './types'
import type { ExerciseChoice } from './choice'

/**
 * The tempo ladder an exercise climbs, ♩ = 60 to 132 in steps of 12: a rung up once four passes in a
 * row are clean, a rung down after a slip.
 */
export const TEMPO_LADDER = [60, 72, 84, 96, 108, 120, 132] as const
export type Rung = (typeof TEMPO_LADDER)[number]

/** The rung a tempo has reached: the highest at or under it (the bottom rung under the ladder). */
export const rungOf = (tempo: number): Rung =>
  TEMPO_LADDER.findLast((rung) => rung <= tempo) ?? TEMPO_LADDER[0]

/** The next rung up from a tempo (the top stays the top). */
export const rungAbove = (tempo: number): Rung => TEMPO_LADDER.find((rung) => rung > tempo) ?? TOP

/** The ladder's top rung. */
const TOP: Rung = 132

/**
 * What an exercise's last tempo is kept under, the tempo reached in each key apart (A41): the
 * exercise, for Hanon the number (each of his an exercise of its own), then the key (`hanon:5:G`,
 * `five-finger:Ebm`), minor only where the exercise is played in minor.
 */
export function tempoKey(
  exercise: Exercise,
  choice: Pick<ExerciseChoice, 'hanon' | 'root' | 'tonality'>,
): string {
  const key = keyParam({
    tonic: choice.root,
    minor: exercise.fields.tonality === true && choice.tonality === 'minor',
  })
  return `${exercise.fields.hanon ? `${exercise.id}:${choice.hanon}` : exercise.id}:${key}`
}
