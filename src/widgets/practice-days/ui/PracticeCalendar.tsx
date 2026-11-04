import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { dateOfDay, monthOf, selectDays, streak, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { RoundButton } from '@/shared/ui'
import { useToday } from '../model/use-today'

/**
 * This month's days practised (the Profile's Activity, as Noji's and Quizlet's): a calendar, a week a
 * row from Monday, each day practised filled, today ringed; over it its month's name and, while a run
 * of days goes on, whether today has kept it (the run's length is the Profile's first figure).
 */
export function PracticeCalendar({
  title,
  browse = false,
}: {
  title: string
  /** ‹ › to the months before (the Streak page's); this month alone where false. */
  browse?: boolean
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const headingId = useId()
  const days = useProgress(selectDays)
  const today = useToday()
  // Months back from today's: 0 is this month; never one after it.
  const [shift, setShift] = useState(0)
  const weeks = monthOf(days, today, shift)
  const run = streak(days, today)
  const practisedToday = days.includes(today)
  const shown = dateOfDay(today)
  shown.setDate(1)
  shown.setMonth(shown.getMonth() + shift)
  const month = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(shown)
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  const narrow = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
  // A Monday to Sunday week for the column names: 5–11 January 2026.
  const weekdays = Array.from({ length: 7 }, (_, i) => narrow.format(new Date(2026, 0, 5 + i, 12)))
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {title}
      </h2>
      <div className="flex flex-col gap-3 card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p
            aria-live={browse ? 'polite' : undefined}
            className="font-display text-lg font-semibold first-letter:uppercase"
          >
            {month}
          </p>
          {browse ? (
            <span className="ml-auto flex gap-1">
              <RoundButton
                label={t('days.previous')}
                icon={ChevronLeft}
                onClick={() => setShift((n) => n - 1)}
              />
              <RoundButton
                label={t('days.next')}
                icon={ChevronRight}
                disabled={shift === 0}
                onClick={() => setShift((n) => Math.min(0, n + 1))}
              />
            </span>
          ) : null}
          {!browse && run > 0 ? (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame aria-hidden className="size-4 shrink-0 text-paint-full-sand" />
              {practisedToday ? t('days.done') : t('days.keep')}
            </p>
          ) : null}
        </div>
        <table className="w-full table-fixed text-center">
          <thead>
            <tr>
              {weekdays.map((name, i) => (
                <th
                  key={i}
                  scope="col"
                  aria-hidden
                  className="pb-1 text-xs font-normal text-muted-foreground"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, w) => (
              <tr key={w}>
                {week.map((cell, d) => (
                  <td key={d} className="p-0.5">
                    {cell ? (
                      <span
                        className={cn(
                          'mx-auto grid size-9 place-items-center rounded-pill text-sm tabular-nums',
                          cell.practised
                            ? 'bg-learned font-semibold text-learned-foreground'
                            : 'text-foreground',
                          cell.today && 'ring-2 ring-ring/50',
                        )}
                      >
                        <span aria-hidden>{dateOfDay(cell.day).getDate()}</span>
                        <span className="sr-only">
                          {t(cell.practised ? 'days.practised' : 'days.missed', {
                            day: long.format(dateOfDay(cell.day)),
                          })}
                        </span>
                      </span>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
