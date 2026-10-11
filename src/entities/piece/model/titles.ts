import type { Locale } from '@/shared/i18n'

interface EntryTitles {
  readonly primary: string
  /** The printed title, under the one in the learner's language. */
  readonly secondary?: string
}

/**
 * A title in the learner's language over the printed one, where it has one (spec §8): English
 * shows a Russian song's English title, Russian a hymn's Russian; otherwise the printed title alone.
 */
export function entryTitles(
  entry: { readonly title: string; readonly titleEn?: string; readonly titleRu?: string },
  locale: Locale,
): EntryTitles {
  const translated = locale === 'en' ? entry.titleEn : entry.titleRu
  return translated ? { primary: translated, secondary: entry.title } : { primary: entry.title }
}
