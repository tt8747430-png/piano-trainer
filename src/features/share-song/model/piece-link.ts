import type { SongVersion } from '@/features/practice'

/** How a piece is played, as a link keeps it: how far it is moved (semitones), and its version. */
export interface PlayedAs {
  readonly transpose: number
  readonly version: SongVersion
}

/**
 * A piece of the app's as a link to itself (ADR 0107): its Player moved as it is played (an offset
 * from the key it is written in, R29 T) and as simplified. Both are said, no move and Simplify off
 * too, so the link never takes what its opener last kept for the song (ADR 0038).
 */
export function pieceLink(piece: string, { transpose, version }: PlayedAs): string {
  const search = new URLSearchParams({ transpose: String(transpose), version })
  return `/play/${encodeURIComponent(piece)}?${search}`
}
