import { useTranslation } from 'react-i18next'
import { entryTitles, isOwnSongId, shownCredits, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'

/**
 * The line under a song's name at the head of its Settings and its Publish (canvas 133, THINGHEAD):
 * its other name or who wrote it, and Your song where it is the learner's.
 */
export function useSongByline(piece: Piece): string {
  const { t } = useTranslation('piece')
  const subtitle = entryTitles(piece, useLocale()).secondary
  const [writer] = shownCredits(piece)
  return [
    subtitle ?? (writer && 'names' in writer ? writer.names : undefined),
    isOwnSongId(piece.id) ? t('settings.yourSong') : undefined,
  ]
    .filter(Boolean)
    .join(' · ')
}
