import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonById, lessonsIn, useModuleName } from '@/entities/lesson'
import { entryTitles, pieceById } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import type { PathStep } from '../model/types'

export type StepKind = 'lesson' | 'chords' | 'scale' | 'study' | 'song'

interface StepTitle {
  readonly primary: string
  readonly secondary?: string
  readonly kind: StepKind
}

/** A step's name in the learner's locale, and what kind of step it is. */
export function useStepTitle(): (step: PathStep) => StepTitle {
  const { t } = useTranslation(['music', 'learn'])
  const locale = useLocale()
  const moduleName = useModuleName()
  return useCallback(
    (step) => {
      switch (step.kind) {
        case 'lesson': {
          const lesson = lessonById(step.lessonId)
          if (!lesson) return { primary: step.lessonId, kind: 'lesson' }
          const inModule = lessonsIn(lesson.module)
          return {
            primary: localText(lesson.title, locale),
            // Where it is read: its module and its number in it, as Learn and its page say.
            secondary: `${moduleName(lesson.module)} · ${t('learn:place', {
              n: inModule.indexOf(lesson) + 1,
              total: inModule.length,
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
    [t, locale, moduleName],
  )
}
