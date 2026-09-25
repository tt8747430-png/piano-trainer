import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceById } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import type { PathStep } from '../model/types'

export type StepKind = 'chords' | 'scale' | 'exercise' | 'song' | 'progression'

export interface StepTitle {
  readonly primary: string
  readonly secondary?: string
  readonly kind: StepKind
}

/** A step's name in the learner's locale, and what kind of step it is. */
export function useStepTitle(): (step: PathStep) => StepTitle {
  const { t } = useTranslation('theory')
  const locale = useLocale()
  return useCallback(
    (step) => {
      switch (step.kind) {
        case 'chords':
          return { primary: t(`family.${step.family}`), kind: 'chords' }
        case 'scale':
          return { primary: t(`scaleKind.${step.scale}`), kind: 'scale' }
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
