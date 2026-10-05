import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { useLocale, type Locale } from '@/shared/i18n'
import { clockTime } from '../model/clock-time'

/** One formatter a language: a take is named by the day and time it was made. */
const formatters = new Map<Locale, Intl.DateTimeFormat>()
function madeFormat(locale: Locale): Intl.DateTimeFormat {
  const known = formatters.get(locale)
  if (known) return known
  const format = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  formatters.set(locale, format)
  return format
}

/** A take's name: when it was made, and under it its length and tempo. */
export function TakeName({ id, take }: { id?: string; take: Take }) {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  return (
    <p className="flex flex-col">
      <span id={id} className="font-semibold">
        {madeFormat(locale).format(take.made)}
      </span>
      <span className="text-sm text-muted-foreground tabular-nums">
        {t('recorder.detail', { length: clockTime(take.length), tempo: take.tempo })}
      </span>
    </p>
  )
}
