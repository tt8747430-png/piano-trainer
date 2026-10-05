import { describe, expect, it } from 'vitest'
import {
  ARPEGGIO_QUALITIES,
  EXERCISES,
  exerciseChoice,
  type ExerciseParams,
} from '@/entities/exercise'
import { noteParam, pitchClass, plainSpelling, SCALE_KINDS } from '@/shared/lib/music'
import { notate, ticksOf } from '@/shared/lib/notation'
import { arrangeExercise } from './exercise'

const RULES = EXERCISES
const ROOTS = Array.from({ length: 12 }, (_, pc) => noteParam(plainSpelling(pitchClass(pc), false)))

/** Every voice of every measure fills its bar. */
function expectWritten(performance: Parameters<typeof notate>[0]) {
  const score = notate(performance)
  for (const measure of score.measures)
    for (const voices of [measure.staves.treble, measure.staves.bass])
      for (const voice of voices) {
        const ticks = voice.events.reduce(
          (sum, event) => sum + ticksOf(event.duration, score.meter),
          0,
        )
        expect(ticks).toBe(measure.ticks)
      }
}

describe('arrangeExercise', () => {
  it.each(RULES.map((exercise) => [exercise.id, exercise] as const))(
    'writes %s in every root, each note on the piano',
    (_id, exercise) => {
      for (const root of ROOTS) {
        const performance = arrangeExercise(exercise.id, exerciseChoice(exercise, { root }))
        expect(performance.notes.length).toBeGreaterThan(0)
        for (const n of performance.notes) {
          expect(n.midi).toBeGreaterThanOrEqual(21)
          expect(n.midi).toBeLessThanOrEqual(108)
        }
        expectWritten(performance)
      }
    },
  )

  const WIDEST: [string, ExerciseParams][] = [
    ...SCALE_KINDS.map((kind): [string, ExerciseParams] => ['scale', { kind, octaves: 4 }]),
    ...SCALE_KINDS.map((kind): [string, ExerciseParams] => ['thirds', { kind, octaves: 2 }]),
    ...SCALE_KINDS.map((kind): [string, ExerciseParams] => ['contrary', { kind, octaves: 2 }]),
    ...ARPEGGIO_QUALITIES.map((quality): [string, ExerciseParams] => [
      'arpeggio',
      { quality, inversion: 3, octaves: 4 },
    ]),
  ]

  it.each(WIDEST)('writes %s at its widest, %j, in every root', (id, params) => {
    const exercise = RULES.find((rule) => rule.id === id)
    if (!exercise) throw new Error(id)
    for (const root of ROOTS) {
      const performance = arrangeExercise(
        exercise.id,
        exerciseChoice(exercise, { ...params, root }),
      )
      for (const n of performance.notes) {
        expect(n.midi).toBeGreaterThanOrEqual(21)
        expect(n.midi).toBeLessThanOrEqual(108)
      }
      expectWritten(performance)
    }
  })
})
