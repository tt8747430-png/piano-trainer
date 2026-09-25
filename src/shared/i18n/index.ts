import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ru } from './locales/ru'

export const NAMESPACES = [
  'common',
  'path',
  'songs',
  'piece',
  'player',
  'theory',
  'quiz',
  'settings',
] as const

// Resources are bundled, so initialisation is synchronous: the first render already has text.
void i18n.use(initReactI18next).init({
  resources: { en, ru },
  lng: 'en',
  fallbackLng: 'en',
  ns: [...NAMESPACES],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  initAsync: false,
})

export { i18n }
export type { LocaleResources } from './types'
export { localText, type LocalText } from './local-text'
export { isLocale, LOCALES, type Locale } from './locale'
export { useLocale } from './use-locale'
export { useScaleName } from './use-scale-name'
