import type { PieceId } from './types'

/** Where in a piece something is wrong, counting from 1 as a reader does. */
export interface ContentPosition {
  readonly section?: number
  readonly line?: number
  readonly bar?: number
  readonly chord?: number
  readonly note?: number
}

const ORDER = ['section', 'line', 'bar', 'chord', 'note'] as const

const where = (position: ContentPosition): string =>
  ORDER.flatMap((part) => (position[part] === undefined ? [] : [`${part} ${position[part]}`])).join(
    ', ',
  )

/** Content that cannot ship: `bz10 · section 2, line 1, bar 3: unknown chord symbol "Qm"`. */
export class ContentError extends Error {
  override readonly name = 'ContentError'
  readonly pieceId: PieceId
  readonly position: ContentPosition

  constructor(pieceId: PieceId, position: ContentPosition, problem: string) {
    const place = where(position)
    super(`${pieceId}${place ? ` · ${place}` : ''}: ${problem}`)
    this.pieceId = pieceId
    this.position = position
  }
}
