import type { Locale } from './locale'

/** A number shown to one decimal place, as the language writes it: `2.5` in English, `2,5` in Russian. */
export const formatDecimal = (locale: Locale, value: number): string =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    value,
  )

/** A whole percent (`50` for half), as the language writes it: `50%` in English, `50 %` in Russian. */
export const formatPercent = (locale: Locale, percent: number): string =>
  new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
    percent / 100,
  )
