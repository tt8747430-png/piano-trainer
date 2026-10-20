import { entryTitles, useRepertoire } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'

/** The title of the song a take was played over, as Songs lists it; its id where it is gone. */
export function useSongTitle(pieceId: string): string {
  const locale = useLocale()
  const entry = useRepertoire().entry(pieceId)
  return entry ? entryTitles(entry, locale).primary : pieceId
}
