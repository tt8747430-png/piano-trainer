import type { Stage, Step } from '@/entities/step'
import type { LocalText } from '@/shared/i18n'

/** A node of a journey's chapter: a lesson to read, or a chord family or scale to check on Practice. */
export type JourneyStep = Extract<Step, { readonly kind: 'lesson' | 'chords' | 'scale' }>

/** A journey's chapter: one subject, its lessons in order and then what to check. */
export interface Chapter {
  readonly id: string
  readonly title: LocalText
  readonly steps: readonly JourneyStep[]
}

/**
 * A journey (ADR 0053): the Lessons of one level, beginner to professional, in chapters, as the
 * journey-app lays them out. Its lessons are its own: no course reads or links them.
 */
export interface Journey {
  readonly id: string
  readonly stage: Stage
  readonly title: LocalText
  /** What the journey makes of the learner, in a sentence. */
  readonly goal: LocalText
  readonly chapters: readonly Chapter[]
}
