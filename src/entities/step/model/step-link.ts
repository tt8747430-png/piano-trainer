import type { RegisteredRouter, ValidateNavigateOptions } from '@tanstack/react-router'
import { qualitiesIn } from '@/shared/lib/music'
import { qualityParams, type Up } from '@/shared/lib'
import type { Step } from './types'

/** A step that opens a place of its own: a piece's way is its caller's (its shelf, or the Player). */
export type LinkedStep = Exclude<Step, { readonly kind: 'piece' }>

/** One link's options, checked against the router as a `<Link>`'s are. */
function opens<TOptions>(options: ValidateNavigateOptions<RegisteredRouter, TOptions>): Up
function opens(options: ValidateNavigateOptions): Up {
  return options
}

/**
 * Where a step is done: a lesson's page (a journey's or a course's), or a chord or scale step's
 * explorer with the step panel open. One answer for its link and for Search's Continue.
 */
export function stepLink(step: LinkedStep): Up {
  switch (step.kind) {
    case 'lesson':
      return opens({ to: '/lessons/$lessonId', params: { lessonId: step.lessonId } })
    case 'course-lesson':
      return opens({
        to: '/courses/$courseId/$lessonId',
        params: { courseId: step.courseId, lessonId: step.lessonId },
      })
    case 'scale':
      return opens({
        to: '/practice/scales',
        search: { kind: step.scale, step: `scale:${step.scale}` },
      })
    case 'chords': {
      const [quality] = qualitiesIn(step.family)
      return opens({
        to: '/practice/chords',
        search: { ...(quality ? qualityParams(quality) : {}), step: `chords:${step.family}` },
      })
    }
  }
}
