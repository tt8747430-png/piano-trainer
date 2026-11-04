import { useMemo } from 'react'
import { entryTitles, isDegreePiece, isOwnSongId, musicOf, type Piece } from '@/entities/piece'
import { usePublish, type PublishItem } from '@/features/publish'
import type { PublicCategory } from '@/shared/api/public-library'
import { useLocale } from '@/shared/i18n'

/**
 * A song's place in the Public library (ADR 0116): an own song written as a chart may be published,
 * held as a save holds an own song, its title beside its music (read back by `readSharedSong`);
 * `item` is null for any other.
 */
export function useSongPublish(piece: Piece, category: PublicCategory | null = null) {
  const locale = useLocale()
  const title = entryTitles(piece, locale).primary
  const own = isOwnSongId(piece.id) ? piece.id : null
  const item = useMemo((): PublishItem | null => {
    if (!own || isDegreePiece(piece)) return null
    const music = musicOf(piece)
    return {
      kind: 'song',
      sourceId: own,
      title,
      meta: { key: music.key, meter: music.meter },
      body: { title, ...music },
      category,
    }
  }, [own, piece, title, category])
  return { item, title, publishing: usePublish(item) }
}
