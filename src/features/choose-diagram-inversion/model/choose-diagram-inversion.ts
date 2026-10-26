import { withChosen, type DiagramInversionsStore } from '@/entities/diagram-inversion'
import type { PieceId } from '@/entities/piece'
import type { Inversion } from '@/shared/lib/music'

/**
 * Draws a chord of a piece in an inversion wherever the piece shows its diagram (ADR 0101); the
 * inversion its notes fold into (`folded`) forgets the choice, so nothing is kept for the default.
 */
export function chooseDiagramInversion(
  store: DiagramInversionsStore,
  pieceId: PieceId,
  symbol: string,
  { chosen, folded }: { readonly chosen: Inversion; readonly folded: Inversion },
): void {
  const forget = chosen === folded
  if (forget && store.getState().pieces[pieceId]?.[symbol] === undefined) return
  store.setState((state) => ({
    pieces: withChosen(state.pieces, pieceId, symbol, forget ? null : chosen),
  }))
}
