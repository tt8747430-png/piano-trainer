import { useMemo, type ReactNode } from 'react'
import {
  selectChosenInversions,
  useDiagramInversions,
  useDiagramInversionsStoreApi,
} from '@/entities/diagram-inversion'
import type { PieceId } from '@/entities/piece'
import { chooseDiagramInversion } from '../model/choose-diagram-inversion'
import { PieceInversionsContext, type PieceInversionChoice } from '../model/use-piece-inversions'

/**
 * The piece whose chords the diagrams under it draw (ADR 0108): every diagram of a chord in it, on
 * any of its screens, in the inversion the learner chose for that chord in that piece.
 */
export function PieceInversions({ pieceId, children }: { pieceId: PieceId; children: ReactNode }) {
  const store = useDiagramInversionsStoreApi()
  const chosen = useDiagramInversions(selectChosenInversions(pieceId))
  const value = useMemo(
    (): PieceInversionChoice => ({
      chosen,
      choose: (symbol, inversion) => chooseDiagramInversion(store, pieceId, symbol, inversion),
    }),
    [chosen, store, pieceId],
  )
  return <PieceInversionsContext value={value}>{children}</PieceInversionsContext>
}
