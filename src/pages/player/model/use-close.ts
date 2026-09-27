import type { Piece } from '@/entities/piece'
import { useGoBack } from '@/shared/lib'

/** Close: back where the learner came from, or to the piece's page on its shelf when opened directly. */
export function useClose(piece: Piece): () => void {
  const params = { pieceId: piece.id }
  const closeTo = {
    song: useGoBack({ to: '/songs/$pieceId', params }),
    study: useGoBack({ to: '/practice/studies/$pieceId', params }),
    progression: useGoBack({ to: '/practice/progressions/$pieceId', params }),
  }
  return closeTo[piece.kind]
}
