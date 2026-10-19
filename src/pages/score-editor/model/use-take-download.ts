import { entryTitles, useRepertoire } from '@/entities/piece'
import { midiFile, takeFileName, type Take } from '@/entities/take'
import { useLocale } from '@/shared/i18n'
import { downloadFile } from '@/shared/lib'

/** A take saved as a MIDI file named for its song, as the takes' sheet names it, from the take's own page. */
export function useTakeDownload(take: Take): () => void {
  const locale = useLocale()
  const entry = useRepertoire().entry(take.pieceId)
  const title = entry ? entryTitles(entry, locale).primary : take.pieceId
  return () => downloadFile(midiFile(take), takeFileName(title, take.made), 'audio/midi')
}
