import { isStage, type Stage } from '@/entities/step'
import { isOneOf, isRecord } from '@/shared/lib'

/** What kind of music a song is, as a library files it (Apple Music's genres, a church's shelves). */
export const SONG_GENRES = [
  'hymn',
  'worship',
  'christmas',
  'folk',
  'classical',
  'pop',
  'jazz',
  'children',
  'study',
] as const
export type SongGenre = (typeof SONG_GENRES)[number]

/** The language a song's words are sung in; none, music without words. */
export const SONG_LANGUAGES = ['en', 'ru', 'uk', 'de', 'la', 'other'] as const
export type SongLanguage = (typeof SONG_LANGUAGES)[number]

/** The most tags a song carries, and the longest a tag is. */
export const MOST_TAGS = 12
export const TAG_MAX = 24

/**
 * A song's details in the learner's library (R30 S5), never printed: its level, genre, the language of
 * its words and its tags. What prints (who wrote it, its source, its copyright) is its score's.
 */
export interface SongDetails {
  /** Its level as the learner places it; a built-in song's courses place it already. */
  readonly level: Stage | null
  readonly genre: SongGenre | null
  readonly language: SongLanguage | null
  readonly tags: readonly string[]
}

export const NO_DETAILS: SongDetails = { level: null, genre: null, language: null, tags: [] }

const isGenre = isOneOf(SONG_GENRES)
const isLanguage = isOneOf(SONG_LANGUAGES)

/** A tag as it is kept: trimmed, its spaces one, lower case, at most `TAG_MAX` long; none if empty. */
export function tagOf(text: string): string | null {
  const tag = text.trim().replace(/\s+/g, ' ').toLocaleLowerCase().slice(0, TAG_MAX).trim()
  return tag === '' ? null : tag
}

/** The tags kept: each once, in the order given, at most `MOST_TAGS`. */
export function tagsOf(values: readonly unknown[]): string[] {
  const kept: string[] = []
  for (const value of values) {
    const tag = typeof value === 'string' ? tagOf(value) : null
    if (tag !== null && !kept.includes(tag)) kept.push(tag)
  }
  return kept.slice(0, MOST_TAGS)
}

/** Any value read as a song's details: what it says that is valid, none for the rest. */
export function sanitiseSongDetails(value: unknown): SongDetails {
  const saved = isRecord(value) ? value : {}
  return {
    level: isStage(saved.level) ? saved.level : null,
    genre: isGenre(saved.genre) ? saved.genre : null,
    language: isLanguage(saved.language) ? saved.language : null,
    tags: Array.isArray(saved.tags) ? tagsOf(saved.tags) : [],
  }
}

/** Whether the details say nothing: such a song's entry is dropped. */
export const isEmptyDetails = (details: SongDetails) =>
  details.level === null &&
  details.genre === null &&
  details.language === null &&
  details.tags.length === 0
