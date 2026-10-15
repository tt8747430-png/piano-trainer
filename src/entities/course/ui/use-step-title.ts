import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonById } from '@/entities/lesson'
import { entryTitles, pieceById } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { lessonPlace } from '../model/selectors'
import type { Step } from '../model/types'

export type StepKind = 'lesson' | 'chords' | 'scale' | 'study' | 'song'

interface StepTitle {
  readonly primary: string
  readonly secondary?: string
  readonly kind: StepKind
}

/** A step's name in the learner's locale, and what kind of step it is. */
export function useStepTitle(): (step: Step) => StepTitle {
  const { t } = useTranslation(['music', 'learn'])
  const locale = useLocale()
  return useCallback(
    (step) => {
      switch (step.kind) {
        case 'lesson': {
          const lesson = lessonById(step.lessonId)
          if (!lesson) return { primary: step.lessonId, kind: 'lesson' }
          const place = lessonPlace(lesson.id)
          return {
            primary: localText(lesson.title, locale),
            // Where it is read: its course and its number in it, as Learn and its page say.
            ...(place
              ? {
                  secondary: `${localText(place.course.title, locale)} · ${t('learn:place', {
                    n: place.n,
                    total: place.total,
                  })}`,
                }
              : {}),
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
