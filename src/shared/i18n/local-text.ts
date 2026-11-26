import { isRecord } from '@/shared/lib'
import { LOCALES, type Locale } from './locale'

/** Content text a learner reads, in every interface language (notes, names, section details). */
export type LocalText = Readonly<Record<Locale, string>>

/** Whether a value read from storage or the server is text in every language, blank or not. */
export const isLocalText = (value: unknown): value is LocalText =>
  isRecord(value) && LOCALES.every((locale) => typeof value[locale] === 'string')

/** Text in every language, none of it blank. */
export const isWrittenText = (value: unknown): value is LocalText =>
  isLocalText(value) && LOCALES.every((locale) => value[locale].trim() !== '')

export const localText = (text: LocalText, locale: Locale): string => text[locale]
