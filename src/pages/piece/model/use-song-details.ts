import { NO_DETAILS, useLibrary, type SongDetails } from '@/entities/library'
import type { PieceId } from '@/entities/piece'

/** A song's details as the library keeps them, none where it keeps none. */
export function useSongDetails(id: PieceId): SongDetails {
  return useLibrary((state) => state.songDetails[id]) ?? NO_DETAILS
}
