import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { RowInterval } from '../model/interval-rows'

/**
 * A row's interval by name and short name: the reference's own, and the tritone by the name of each
 * spelling (augmented 4th, diminished 5th), where the reference calls both the tritone.
 */
export function useIntervalName(): (name: RowInterval) => { title: string; short: string } {
  const { t } = useTranslation(['music', 'practice'])
  return useCallback(
    (name) =>
      name === 'A4' || name === 'd5'
        ? {
            title: t(`practice:intervals.tritone.${name}.name`),
            short: t(`practice:intervals.tritone.${name}.short`),
          }
        : { title: t(`music:interval.${name}.name`), short: t(`music:interval.${name}.short`) },
    [t],
  )
}
