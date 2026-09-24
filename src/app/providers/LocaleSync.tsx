import { useLayoutEffect } from 'react'
import { selectLocale, useSettings } from '@/entities/settings'
import { i18n } from '@/shared/i18n'

/** Keeps i18next and <html lang> on the learner's saved language. Renders nothing. */
export function LocaleSync() {
  const locale = useSettings(selectLocale)

  useLayoutEffect(() => {
    void i18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }, [locale])

  return null
}
