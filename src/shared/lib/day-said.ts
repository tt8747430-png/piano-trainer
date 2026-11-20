import { formatLocale } from './format-locale'
const DAY = 86_400_000

/**
 * A day as the library says it (the boards' "Today", "3 days ago", then "9 Nov"): within a week the
 * day in words, then the date; its first letter a capital where it opens a line, as it may.
 */
export function daySaid(at: string | number, locale: string, now: number, opens = true): string {
  const then = new Date(at)
  const days = Math.round(
    (new Date(now).setHours(0, 0, 0, 0) - new Date(then).setHours(0, 0, 0, 0)) / DAY,
  )
  const said =
    days < 7
      ? new Intl.RelativeTimeFormat(formatLocale(locale), { numeric: 'auto' }).format(-days, 'day')
      : new Intl.DateTimeFormat(formatLocale(locale), { day: 'numeric', month: 'short' }).format(
          then,
        )
  return opens ? said.charAt(0).toLocaleUpperCase(locale) + said.slice(1) : said
}
