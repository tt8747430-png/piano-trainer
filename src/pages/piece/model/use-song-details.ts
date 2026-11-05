import { pieceStage } from '@/entities/course'
import { NO_DETAILS, useLibrary, type SongDetails } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import type { Stage } from '@/entities/step'

/** A song's details as the library keeps them, none where it keeps none. */
export function useSongDetails(id: PieceId): SongDetails {
  return useLibrary((state) => state.songDetails[id]) ?? NO_DETAILS
}

/** The level a song is read at: its courses' for a built-in song, the learner's for their own. */
export function useSongLevel(id: PieceId): Stage | null {
  const details = useSongDetails(id)
  return pieceStage(id) ?? details.level
}
