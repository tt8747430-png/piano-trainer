import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { dateOfDay, lastWeek, selectDays, streak, useProgress } from '@/entities/progress'
import { useLocale, type Locale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useToday } from '../model/use-today'

const formats = new Map<Locale, { short: Intl.DateTimeFormat; long: Intl.DateTimeFormat }>()
function formatsOf(locale: Locale) {
  const known = formats.get(locale)
  if (known) return known
  const made = {
    short: new Intl.DateTimeFormat(locale, { weekday: 'narrow' }),
    long: new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }),
  }
  formats.set(locale, made)
  return made
}

/**
 * The days practised: how many in a row up to today, and the last seven, today last. A run that ended
 * yesterday still counts, and says today keeps it going.
 */
export function PracticeDays() {
  const { t } = useTranslation('path')
  const locale = useLocale()
  const headingId = useId()
  const days = useProgress(selectDays)
  const today = useToday()
  const run = streak(days, today)
  const week = lastWeek(days, today)
  const practisedToday = week.at(-1)?.practised ?? false
  const { short, long } = formatsOf(locale)
  const note = run === 0 ? t('days.start') : practisedToday ? t('days.done') : t('days.keep')

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-wrap items-center gap-x-6 gap-y-3 card p-5"
    >
      <div className="flex min-w-0 flex-auto flex-col gap-1">
        <h2 id={headingId} className="text-sm font-semibold text-muted-foreground">
          {t('days.title')}
        </h2>
        {run > 0 ? (
          <p className="font-display text-2xl font-semibold">{t('days.inARow', { count: run })}</p>
        ) : null}
        <p className="text-muted-foreground">{note}</p>
      </div>
      <ol aria-label={t('days.week')} className="flex gap-2">
        {week.map(({ day, practised }, i) => {
          const date = dateOfDay(day)
          const name = long.format(date)
          return (
            <li key={day} className="flex flex-col items-center gap-1">
              <span
                aria-hidden
                className={cn(
                  'size-7 rounded-full border-2',
                  practised ? 'border-learned bg-learned' : 'border-input',
                  i === week.length - 1 && 'ring-2 ring-ring/40 ring-offset-2 ring-offset-card',
                )}
              />
              <span aria-hidden className="text-xs text-muted-foreground">
                {short.format(date)}
              </span>
              <span className="sr-only">
                {t(practised ? 'days.practised' : 'days.missed', { day: name })}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
