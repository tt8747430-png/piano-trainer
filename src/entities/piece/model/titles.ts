import type { Locale } from '@/shared/i18n'

export interface EntryTitles {
  readonly primary: string
  /** The printed title, under an English one. */
  readonly secondary?: string
}

/** English shows the English title over the printed one; Russian shows the printed title (spec §8). */
export function entryTitles(
  entry: { readonly title: string; readonly titleEn?: string },
  locale: Locale,
): EntryTitles {
  return locale === 'en' && entry.titleEn
    ? { primary: entry.titleEn, secondary: entry.title }
    : { primary: entry.title }
}
