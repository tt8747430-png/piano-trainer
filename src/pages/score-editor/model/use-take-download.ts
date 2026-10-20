import { midiFile, takeFileName, type Take } from '@/entities/take'
import { downloadFile } from '@/shared/lib'
import { useSongTitle } from './use-song-title'

/** A take saved as a MIDI file named for its song, as the takes' sheet names it, from the take's own page. */
export function useTakeDownload(take: Take): () => void {
  const title = useSongTitle(take.pieceId)
  return () => downloadFile(midiFile(take), takeFileName(title, take.made), 'audio/midi')
}
