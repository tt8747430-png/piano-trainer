import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { StaffId, StaffLabels } from '@/shared/lib/notation'

/**
 * The names a score's staves are printed with at its first line's head, in the learner's language
 * (ADR 0094): the tune's where its staff is drawn, the piano's where one of its two is.
 */
export function useStaffLabels(staves: readonly StaffId[]): StaffLabels {
  const { t } = useTranslation('music')
  const melody = staves.includes('melody')
  const piano = staves.some((staff) => staff !== 'melody')
  return useMemo(
    () => ({
      ...(melody ? { melody: t('sheet.staves.melody') } : {}),
      ...(piano ? { piano: t('sheet.staves.piano') } : {}),
    }),
    [t, melody, piano],
  )
}
