/** Content text a learner reads, in both languages (notes, names, section details). */
export interface LocalText {
  readonly en: string
  readonly ru: string
}

export const localText = (text: LocalText, locale: keyof LocalText): string => text[locale]
