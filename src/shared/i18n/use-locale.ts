import { useTranslation } from 'react-i18next'
import { isLocale, type Locale } from './locale'

/**
 * The locale the interface speaks now. It follows i18next rather than the settings store, so text
 * from `t()` and from `localText()` always agree; LocaleSync moves i18next before paint.
 */
export function useLocale(): Locale {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  return isLocale(language) ? language : 'en'
}
