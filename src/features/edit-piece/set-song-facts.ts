import { withSongFacts, type OwnSongId, type PiecesStore, type SongFacts } from '@/entities/piece'
import type { Locale } from '@/shared/i18n'

/**
 * Writes what an own song's page says of it (round 28): its title, who wrote its music and words,
 * and what is said about it, the same in both languages (the learner writes in one). Its music is
 * left as it is.
 */
export function setSongFacts(
  store: PiecesStore,
  id: OwnSongId,
  facts: SongFacts,
  locale: Locale,
): void {
  store.setState((state) => ({
    songs: state.songs.map((song) =>
      song.id === id ? withSongFacts(song, facts, locale, true) : song,
    ),
  }))
}
