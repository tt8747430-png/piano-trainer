import type { TFunction } from 'i18next'
import type { Locale } from '@/shared/i18n'
import type { MenuAction } from '@/shared/ui'

/** Each language named in itself. */
export const LANGUAGE_NAMES: Readonly<Record<Locale, string>> = { en: 'English', ru: 'Русский' }

/**
 * The language a document is written in (round 24), as the draft's menu's first group: English and
 * Русский, each named in itself, the one written in checked. The document opens anew on the other.
 */
export function languageActions(
  value: Locale,
  onChange: (locale: Locale) => void,
  t: TFunction<'learn'>,
): MenuAction[] {
  return (['en', 'ru'] as const).map((locale) => ({
    key: `language-${locale}`,
    group: t('edit.doc.language'),
    label: LANGUAGE_NAMES[locale],
    checked: locale === value,
    onSelect: () => onChange(locale),
  }))
}
