import type { PieceId } from '@/entities/piece'
import { takeId, type Played, type TakeId, type TakesStore } from '@/entities/take'
import type { Meter } from '@/shared/lib/music'

/** Where and when a take was made, and the click it was played to. */
export interface TakeMade {
  readonly pieceId: PieceId
  /** Milliseconds since the epoch. */
  readonly made: number
  readonly tempo: number
  readonly meter: Meter
}

/** Keeps what was played as the next take; hands back its id. */
export function saveTake(store: TakesStore, made: TakeMade, played: Played): TakeId {
  const { takes, nextTake } = store.getState()
  const id = takeId(nextTake)
  store.setState({ takes: [...takes, { id, ...made, ...played }], nextTake: nextTake + 1 })
  return id
}
