import type { Locale } from './locale'

/** Content text a learner reads, in every interface language (notes, names, section details). */
export type LocalText = Readonly<Record<Locale, string>>

export const localText = (text: LocalText, locale: Locale): string => text[locale]
