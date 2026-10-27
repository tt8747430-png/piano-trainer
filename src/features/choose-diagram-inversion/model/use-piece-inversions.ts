import { createContext, use } from 'react'
import type { ChosenInversions } from '@/entities/diagram-inversion'
import type { Inversion } from '@/shared/lib/music'

/** A piece's chosen inversions as its diagrams read them, and the way to choose one (ADR 0108). */
export interface PieceInversionChoice {
  /** The inversion chosen for each chord, by its symbol as played. */
  readonly chosen: ChosenInversions
  /** Draws a chord in an inversion from now on; the inversion it folds into forgets the choice. */
  choose(
    symbol: string,
    inversion: { readonly chosen: Inversion; readonly folded: Inversion },
  ): void
}

export const PieceInversionsContext = createContext<PieceInversionChoice | null>(null)

/**
 * The inversions of the piece round a screen's diagrams (`PieceInversions`); none for music that is
 * no piece (a walk, a progression, an exercise), whose diagrams fold and keep no choice.
 */
export const usePieceInversions = (): PieceInversionChoice | null => use(PieceInversionsContext)
