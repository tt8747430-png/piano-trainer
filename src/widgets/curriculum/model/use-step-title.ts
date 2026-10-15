import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { courseLesson } from '@/entities/course'
import { lessonById, lessonPlace } from '@/entities/lesson'
import { entryTitles, pieceById } from '@/entities/piece'
import type { Step, StepKind } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'

export interface StepTitle {
  readonly primary: string
  readonly secondary?: string
  readonly kind: StepKind
}

/** A step's name in the learner's locale, where it is read, and what kind of step it is. */
export function useStepTitle(): (step: Step) => StepTitle {
  const { t } = useTranslation(['music', 'learn'])
  const locale = useLocale()
  return useCallback(
    (step) => {
      switch (step.kind) {
        case 'lesson': {
          const lesson = lessonById(step.lessonId)
          const place = lessonPlace(step.lessonId)
          if (!lesson) return { primary: step.lessonId, kind: 'lesson' }
          return {
            primary: localText(lesson.title, locale),
            // Where it is read: its journey and its chapter.
            ...(place
              ? {
                  secondary: `${localText(place.journey.title, locale)} · ${localText(
                    place.chapter.title,
                    locale,
                  )}`,
                }
              : {}),
            kind: 'lesson',
          }
        }
        case 'course-lesson': {
          const place = courseLesson(step.courseId, step.lessonId)
          if (!place) return { primary: step.lessonId, kind: 'lesson' }
          return {
            primary: localText(place.lesson.title, locale),
            secondary: `${localText(place.course.title, locale)} · ${t('learn:place', {
              n: place.n,
              total: place.total,
            })}`,
            kind: 'lesson',
          }
        }
        case 'chords':
          return { primary: t(`music:family.${step.family}`), kind: 'chords' }
        case 'scale':
          return { primary: t(`music:scaleKind.${step.scale}`), kind: 'scale' }
        case 'piece': {
          const piece = pieceById(step.pieceId)
          if (!piece) return { primary: step.pieceId, kind: 'song' }
          return { ...entryTitles(piece, locale), kind: piece.kind }
        }
      }
    },
    [t, locale],
  )
}
