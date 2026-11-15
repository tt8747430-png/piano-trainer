import type { Locale } from '@/shared/i18n'
import type { Entry } from './types'

interface EntryTitles {
  readonly primary: string
  /** The printed title, under the one in the learner's language. */
  readonly secondary?: string
}

/**
 * A title in the learner's language over the printed one, where it has one: English
 * shows a Russian song's English title, Russian a hymn's Russian; otherwise the printed title alone.
 * A study's title is a lesson's heading, its translation all of it: no printed one under it.
 */
export function entryTitles(
  entry: {
    readonly kind?: Entry['kind']
    readonly title: string
    readonly titleEn?: string
    readonly titleRu?: string
  },
  locale: Locale,
): EntryTitles {
  const translated = locale === 'en' ? entry.titleEn : entry.titleRu
  if (!translated) return { primary: entry.title }
  return entry.kind === 'study'
    ? { primary: translated }
    : { primary: translated, secondary: entry.title }
}

/**
 * What a search finds an entry by: every title it has, and the names its credits print ("getty"
 * finds Still, my soul, be still).
 */
export const entryWords = (entry: Entry): string[] => [
  entry.title,
  entry.titleEn ?? '',
  entry.titleRu ?? '',
  ...(entry.credits ?? []).flatMap((credit) => (credit.role === 'unknown' ? [] : [credit.names])),
]

/** The credit a row names as its author: who wrote the music, else who wrote it all. */
const AUTHOR_ROLES = ['music', 'words-and-music', 'authors'] as const

/** An entry's author as its rows name it under its title ("Beethoven"), where its credits print one. */
export const entryAuthor = (entry: Pick<Entry, 'credits'>): string | undefined =>
  AUTHOR_ROLES.flatMap((role) =>
    (entry.credits ?? []).flatMap((credit) =>
      credit.role === role && 'names' in credit ? [credit.names] : [],
    ),
  )[0]
