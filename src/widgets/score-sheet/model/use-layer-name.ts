import { createContext, use, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, useStaffTitle, type StaffName } from '@/entities/piece'
import type { Layer } from '@/features/score-editor'
import { isSingleStaff, staffPlace } from '@/shared/lib/notation'

/**
 * A row the editor writes named for a reader, as a score names its staves (ADR 0091, 0097): the chord
 * symbols, a single staff by its own name (else its place's, "Staff 2"), the piano's upper and lower
 * staves. Never a hand: the hands are the Player's.
 */
export function useLayerName(
  staves: readonly { readonly name?: StaffName }[],
): (layer: Layer) => string {
  const { t } = useTranslation('editor')
  const names = useStaffNames(staves)
  const title = useStaffTitle()
  return useCallback(
    (layer) =>
      isSingleStaff(layer)
        ? title(names[staffPlace(layer)], staffPlace(layer))
        : t(`layers.${layer}`),
    [t, names, title],
  )
}

/** The sheet's rows named for its printed things' buttons (a clef's, a staff's name), within `ScoreSheet`. */
export const LayerNames = createContext<(layer: Layer) => string>((layer) => layer)

/** A row's name on the sheet, as `ScoreSheet` names its draft's. */
export const useSheetLayerName = (): ((layer: Layer) => string) => use(LayerNames)
