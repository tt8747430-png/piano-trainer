import {
  withSongCredit,
  withSongFacts,
  type OwnSongId,
  type PiecesStore,
  type SongCredit,
  type SongFacts,
} from '@/entities/piece'
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

/**
 * Writes who wrote an own song (R32-C, its Details' Music, Words or Arranger): the line its score
 * prints, the same on its page; an empty line takes the credit away.
 */
export function setSongCredit(
  store: PiecesStore,
  id: OwnSongId,
  field: SongCredit,
  text: string,
): void {
  store.setState((state) => ({
    songs: state.songs.map((song) => (song.id === id ? withSongCredit(song, field, text) : song)),
  }))
}
