import type { Locale } from '@/shared/i18n'
import type { Entry } from './types'

interface EntryTitles {
  readonly primary: string
  /** The printed title, under the one in the learner's language. */
  readonly secondary?: string
}

/**
 * A title in the learner's language over the printed one, where it has one (spec §8): English
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
