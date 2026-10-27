import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * A bar's name in the learner's language, as a sheet or a chart names its button: its number, then
 * what it holds (its chords) where it holds anything; a bar of no chord its number alone (ADR 0114).
 */
export function useBarName(): (n: number, holds: string) => string {
  const { t } = useTranslation('music')
  return useCallback(
    (n, holds) =>
      holds === '' ? t('sheet.bar', { n }) : t('sheet.barChords', { n, chords: holds }),
    [t],
  )
}
