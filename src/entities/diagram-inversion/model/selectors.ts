import type { PieceId } from '@/entities/piece'
import type { ChosenInversions } from './chosen'
import type { DiagramInversionsState } from './store'

/** A piece of no inversion chosen: one value, so a screen reading it stays still. */
const NONE: ChosenInversions = {}

/** The inversions chosen for a piece's chords, by symbol as played. */
export const selectChosenInversions =
  (pieceId: PieceId) =>
  (state: DiagramInversionsState): ChosenInversions =>
    state.pieces[pieceId] ?? NONE
