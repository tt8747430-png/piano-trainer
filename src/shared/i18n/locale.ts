import { isOneOf } from '@/shared/lib'

/** The interface languages; English is the fallback. */
export const LOCALES = ['en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

export const isLocale = isOneOf(LOCALES)
