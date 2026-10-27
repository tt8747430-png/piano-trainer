import { pieceKey, type Piece } from '@/entities/piece'
import type { RememberedView } from '@/entities/views'
import { readNote } from '@/shared/lib'
import { noteParam } from '@/shared/lib/music'

/**
 * How a piece is played, as its page shares it (ADR 0107): the key and Simplify its Player last kept
 * (ADR 0038, 0105), else its own key, as written.
 */
export function playedAs(
  piece: Piece,
  remembered: RememberedView | undefined,
): { key: string; simple: boolean } {
  const tonic = readNote(remembered?.key) ?? pieceKey(piece).tonic
  return { key: noteParam(tonic), simple: remembered?.simple === true }
}
