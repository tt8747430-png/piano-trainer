import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { dateOfDay, monthOf, selectDays, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useToday } from '../model/use-today'

/**
 * This month's days practised (the Profile's Activity, as Noji's and Quizlet's): a calendar, a week a
 * row from Monday, each day practised filled, today ringed; its month's name over it.
 */
export function PracticeCalendar() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const headingId = useId()
  const days = useProgress(selectDays)
  const today = useToday()
  const weeks = monthOf(days, today)
  const month = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    dateOfDay(today),
  )
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  const narrow = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
  // A Monday to Sunday week for the column names: 5–11 January 2026.
  const weekdays = Array.from({ length: 7 }, (_, i) => narrow.format(new Date(2026, 0, 5 + i, 12)))
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('days.month')}
      </h2>
      <div className="flex flex-col gap-3 card p-4">
        <p className="font-display text-lg font-semibold first-letter:uppercase">{month}</p>
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
                          'mx-auto grid size-9 place-items-center rounded-full text-sm tabular-nums',
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
