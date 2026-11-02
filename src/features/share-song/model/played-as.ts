import { isDegreePiece, isOwnSongId, musicOf, pieceKey, type Piece } from '@/entities/piece'
import type { RememberedView } from '@/entities/views'
import { readNote } from '@/shared/lib'
import { noteParam } from '@/shared/lib/music'
import type { SongToShare } from './use-share-song'

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

/**
 * What a song's Share link carries (ADR 0107), its page's and its library row's alike: an own song
 * its music, under its title; one of the app's a link to itself as its Player last kept it. An own
 * song written in degrees has no link (null).
 */
export function songToShare(
  piece: Piece,
  title: string,
  remembered: RememberedView | undefined,
): SongToShare | null {
  if (!isOwnSongId(piece.id))
    return { kind: 'piece', id: piece.id, title, played: playedAs(piece, remembered) }
  return isDegreePiece(piece) ? null : { kind: 'own', song: { title, music: musicOf(piece) } }
}
