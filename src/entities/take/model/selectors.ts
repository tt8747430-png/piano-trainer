import type { PieceId } from '@/entities/piece'
import type { TakesState } from './store'
import { NOTES_ROOM, type FreeTake, type Take, type TakeId } from './types'

/** A piece's takes, the newest first. */
export const selectTakesOf = (state: TakesState, pieceId: PieceId): Take[] =>
  state.takes.filter((take) => take.pieceId === pieceId).reverse()

export const selectTake = (state: TakesState, id: TakeId): Take | undefined =>
  state.takes.find((take) => take.id === id)

/** The Recorder's free recordings, the newest first (R29 B11). */
export const selectFreeTakes = (state: TakesState): FreeTake[] => state.free.toReversed()

/** A free recording by its id. */
export const selectFreeTake = (state: TakesState, id: TakeId): FreeTake | undefined =>
  state.free.find((take) => take.id === id)

/** How many more notes the takes and free recordings have room for (`NOTES_ROOM` in all). */
export const selectRoomLeft = (state: TakesState): number =>
  Math.max(
    0,
    NOTES_ROOM - [...state.takes, ...state.free].reduce((sum, take) => sum + take.notes.length, 0),
  )
