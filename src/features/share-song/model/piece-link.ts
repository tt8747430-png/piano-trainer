/** How a piece is played, as a link keeps it: the key's tonic as a URL writes it (`F#`), and Simplify. */
export interface PlayedAs {
  readonly key: string
  readonly simple: boolean
}

/**
 * A piece of the app's as a link to itself (ADR 0107): its Player in the key it is played and as
 * simplified. Both are said, the song's own key and Simplify off too, so the link never takes the
 * key or Simplify its opener last kept for the song (ADR 0022).
 */
export function pieceLink(piece: string, { key, simple }: PlayedAs): string {
  const search = new URLSearchParams({ key, simple: String(simple) })
  return `/play/${encodeURIComponent(piece)}?${search}`
}
