import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { isInversion, readChordSymbol } from '@/shared/lib/music'
import { latestPieces, type ChosenInversions, type PieceInversions } from './chosen'

export const DIAGRAM_INVERSIONS_STORAGE_KEY = 'pt-diagram-inversions'
export const DIAGRAM_INVERSIONS_VERSION = 1

/** The inversion the learner chose for each chord's diagram, piece by piece (ADR 0101). */
export interface DiagramInversionsState {
  readonly pieces: PieceInversions
}

export type DiagramInversionsStore = StoreApi<DiagramInversionsState>

export const createDiagramInversionsStore = (saving: SavingOptions = {}): DiagramInversionsStore =>
  createSavedStore(
    {
      key: DIAGRAM_INVERSIONS_STORAGE_KEY,
      version: DIAGRAM_INVERSIONS_VERSION,
      initial: { pieces: {} },
      read: sanitize,
    },
    saving,
  )

/** A saved piece's chords whose symbols read and whose inversions are ones. */
function chosenOf(saved: unknown): ChosenInversions {
  if (!isRecord(saved)) return {}
  return Object.fromEntries(
    Object.entries(saved).flatMap(([symbol, inversion]) =>
      readChordSymbol(symbol) !== null && isInversion(inversion) ? [[symbol, inversion]] : [],
    ),
  )
}

/** Stored JSON is untrusted: a piece is kept with the chords of it that read, the latest within the caps. */
function sanitize(persisted: unknown): DiagramInversionsState {
  const saved = savedObject<DiagramInversionsState>(persisted).pieces
  return {
    pieces: latestPieces(
      Object.entries(isRecord(saved) ? saved : {}).flatMap(([pieceId, chords]) => {
        const chosen = chosenOf(chords)
        return pieceId !== '' && Object.keys(chosen).length > 0 ? [[pieceId, chosen] as const] : []
      }),
    ),
  }
}
