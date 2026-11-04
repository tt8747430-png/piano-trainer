import { isDegreePiece, isOwnSongId, musicOf, type Piece } from '@/entities/piece'
import type { RememberedView } from '@/entities/views'
import { SONG_VERSIONS, type SongVersion } from '@/features/practice'
import { isOneOf } from '@/shared/lib'
import { TRANSPOSITION_RANGE } from '@/shared/lib/music'

const isSongVersion: (value: unknown) => value is SongVersion = isOneOf(SONG_VERSIONS)
import type { PlayedAs } from './piece-link'
import type { SongToShare } from './use-share-song'

/**
 * How a piece is played, as its page shares it (ADR 0107): how far its Player last moved it and
 * Simplify (ADR 0038, 0105, R29 T), else as written.
 */
export function playedAs(_piece: Piece, remembered: RememberedView | undefined): PlayedAs {
  const transpose = remembered?.transpose
  const read =
    typeof transpose === 'number' &&
    Number.isInteger(transpose) &&
    transpose >= TRANSPOSITION_RANGE.min &&
    transpose <= TRANSPOSITION_RANGE.max
  return {
    transpose: read ? transpose : 0,
    version: isSongVersion(remembered?.version) ? remembered.version : 'original',
  }
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
