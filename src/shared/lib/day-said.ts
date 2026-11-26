import { formatLocale } from './format-locale'
const DAY = 86_400_000

/** One formatter per language and shape, made once: a long list formats each row without remaking it. */
const formats = new Map<string, Intl.DateTimeFormat>()
function said(at: string | number | Date, locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale} ${JSON.stringify(options)}`
  let format = formats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(formatLocale(locale), options)
    formats.set(key, format)
  }
  return format.format(new Date(at))
}

/** A date short, as a list's row or a chart's axis says it: "9 Nov" in English (en-GB). */
export const shortDateSaid = (at: string | number | Date, locale: string): string =>
  said(at, locale, { day: 'numeric', month: 'short' })

/** A day of the month named in a line of text: "9 November". */
export const monthDaySaid = (at: string | number | Date, locale: string): string =>
  said(at, locale, { day: 'numeric', month: 'long' })

/** A day named in full within its year, as a history heads it: "Monday, 9 November". */
export const weekdaySaid = (at: string | number | Date, locale: string): string =>
  said(at, locale, { weekday: 'long', day: 'numeric', month: 'long' })

/** A date in full, as a notice or a policy dates itself: "20 November 2026". */
export const dateSaid = (at: string | number | Date, locale: string): string =>
  said(at, locale, { dateStyle: 'long' })

/** A moment, as a version or a take is named by when it was made: "20 Nov 2026, 14:20". */
export const momentSaid = (at: string | number | Date, locale: string): string =>
  said(at, locale, { dateStyle: 'medium', timeStyle: 'short' })

/** A time of day as the language writes it, short: "14:20" in English (en-GB) and Russian. */
export const clockSaid = (at: string | number | Date, locale: string): string =>
  said(at, locale, { timeStyle: 'short' })

/**
 * A day as the library says it (the boards' "Today", "3 days ago", then "9 Nov"): within a week the
 * day in words, then the date; its first letter a capital where it opens a line, as it may.
 */
export function daySaid(at: string | number, locale: string, now: number, opens = true): string {
  const then = new Date(at)
  const days = Math.round(
    (new Date(now).setHours(0, 0, 0, 0) - new Date(then).setHours(0, 0, 0, 0)) / DAY,
  )
  const text =
    days < 7
      ? new Intl.RelativeTimeFormat(formatLocale(locale), { numeric: 'auto' }).format(-days, 'day')
      : shortDateSaid(then, locale)
  return opens ? text.charAt(0).toLocaleUpperCase(locale) + text.slice(1) : text
}
