import type { Take } from '@/entities/take'
import { useLocale, type Locale } from '@/shared/i18n'

/** One formatter a language: a take is named by the day and time it was made. */
const formatters = new Map<Locale, Intl.DateTimeFormat>()
function madeFormat(locale: Locale): Intl.DateTimeFormat {
  const known = formatters.get(locale)
  if (known) return known
  const format = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  formatters.set(locale, format)
  return format
}

/** When a take was made, as its name reads until the learner gives it one. */
export function useTakeMade(take: Take): string {
  return madeFormat(useLocale()).format(take.made)
}

/** A take's name: the learner's, else when it was made. */
export function useTakeTitle(take: Take): string {
  const made = useTakeMade(take)
  return take.name ?? made
}
