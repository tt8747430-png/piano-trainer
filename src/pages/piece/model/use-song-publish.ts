import { useMemo } from 'react'
import type { SongGenre } from '@/entities/library'
import { entryTitles, isDegreePiece, isOwnSongId, musicOf, type Piece } from '@/entities/piece'
import { usePublish, type PublishItem } from '@/features/publish'
import { useLocale } from '@/shared/i18n'
import { useSongDetails } from './use-song-details'

/** A genre as Publish's tag for it, the word Explore's chips find it by (R72). */
const GENRE_TAG = {
  hymn: 'Hymn',
  worship: 'Worship',
  christmas: 'Christmas',
  folk: 'Folk',
  classical: 'Classical',
  pop: 'Pop',
  jazz: 'Jazz',
  children: 'Children',
  study: 'Study',
} as const satisfies Record<SongGenre, string>

/**
 * A song's place in the Public library (ADR 0116): an own song written as a chart may be published,
 * held as a save holds an own song, its title beside its music (read back by `readSharedSong`);
 * `item` is null for any other. A first publish starts with the song's genre and tags as the library
 * files them.
 */
export function useSongPublish(piece: Piece) {
  const locale = useLocale()
  const title = entryTitles(piece, locale).primary
  const own = isOwnSongId(piece.id) ? piece.id : null
  const details = useSongDetails(piece.id)
  const item = useMemo((): PublishItem | null => {
    if (!own || isDegreePiece(piece)) return null
    const music = musicOf(piece)
    return {
      kind: 'song',
      sourceId: own,
      title,
      meta: { key: music.key, meter: music.meter },
      body: { title, ...music },
      ...(music.header?.composer ? { composer: music.header.composer } : {}),
      tags: [...(details.genre ? [GENRE_TAG[details.genre]] : []), ...details.tags],
    }
  }, [own, piece, title, details])
  return { item, title, publishing: usePublish(item) }
}
