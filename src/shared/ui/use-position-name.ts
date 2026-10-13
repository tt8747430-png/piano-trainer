import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { HandPosition } from '@/shared/lib/music'
import { INVERSION_NAMES } from './inversion-names'

/** A hand's position as the screen names it: Root to 3rd, or From the 9th for a rootless hand. */
export function usePositionName(): (position: HandPosition) => string {
  const { t } = useTranslation('music')
  return useCallback(
    (position) =>
      'inversion' in position
        ? t(`inversion.${INVERSION_NAMES[position.inversion] ?? 'root'}`)
        : t(`position.from.${position.from}`),
    [t],
  )
}
