import { isPiece, type Collection, type Piece } from '../model/types'
import bozheSpasibo from './bozhe-spasibo'
import calledToPlay from './called-to-play'
import exercises from './exercises'
import hymns from './hymns'
import progressions from './progressions'

export { BOOKS } from './books'

/** In the order Songs lists them. */
export const COLLECTIONS: readonly Collection[] = [
  bozheSpasibo,
  calledToPlay,
  exercises,
  hymns,
  progressions,
]

/** Every piece that opens in the Player, in catalog order. */
export const PIECES: readonly Piece[] = COLLECTIONS.flatMap(
  (collection) => collection.entries,
).filter(isPiece)
