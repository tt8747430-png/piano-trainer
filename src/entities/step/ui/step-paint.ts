import type { Paint } from '@/shared/ui'
import type { Stage } from '../model/types'

/** What a step is, as its paint and its name say: a lesson (a journey's or a course's), a chord family, a scale, a study, a song. */
export type StepKind = 'lesson' | 'chords' | 'scale' | 'study' | 'song'

/**
 * Each kind of step in its own paint (DESIGN: chords sand, scale sky, study grass, song yellow; a
 * lesson sand as Learn's rows wear it),
 * wherever a step or a piece of its kind is shown: a step's tile, the Continue card's band, a row
 * that leads to it.
 */
export const STEP_PAINT: Readonly<Record<StepKind, Paint>> = {
  lesson: 'sand',
  chords: 'sand',
  scale: 'sky',
  study: 'grass',
  song: 'yellow',
}

/** Each stage's paint, worn by its journey's and its courses' cards and pages (DESIGN: one meaning per paint). */
export const STAGE_PAINT: Readonly<Record<Stage, Paint>> = {
  beginner: 'sky',
  intermediate: 'grass',
  advanced: 'lilac',
  professional: 'sand',
}
