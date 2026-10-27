import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { qualitiesIn } from '@/shared/lib/music'
import { qualityParams } from '@/shared/lib'
import type { Step } from '../model/types'

type LinkedStep = Exclude<Step, { readonly kind: 'piece' }>

/**
 * A step's way to where it is done: a lesson's page (a journey's or a course's), or a chord or scale step's explorer
 * with the step panel open. A piece's way is its caller's: its page on its shelf, or the Player.
 */
export function StepLink({
  step,
  ...props
}: { step: LinkedStep } & Omit<ComponentProps<'a'>, 'href'>) {
  switch (step.kind) {
    case 'lesson':
      return <Link to="/lessons/$lessonId" params={{ lessonId: step.lessonId }} {...props} />
    case 'course-lesson':
      return (
        <Link
          to="/courses/$courseId/$lessonId"
          params={{ courseId: step.courseId, lessonId: step.lessonId }}
          {...props}
        />
      )
    case 'scale':
      return (
        <Link
          to="/practice/scales"
          search={{ kind: step.scale, step: `scale:${step.scale}` }}
          {...props}
        />
      )
    case 'chords': {
      const [quality] = qualitiesIn(step.family)
      return (
        <Link
          to="/practice/chords"
          search={{ ...(quality ? qualityParams(quality) : {}), step: `chords:${step.family}` }}
          {...props}
        />
      )
    }
  }
}
