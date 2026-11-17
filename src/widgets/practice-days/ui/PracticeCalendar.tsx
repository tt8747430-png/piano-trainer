import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { dateOfDay, monthOf, selectDays, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useToday } from '../model/use-today'

/** The month's arrows, the board's CAL: bare 44 circles at the card's sides. */
const ARROW =
  'grid size-11 place-items-center rounded-pill text-foreground transition-colors duration-150 ease-out hover:bg-muted disabled:text-muted-foreground/50 disabled:hover:bg-transparent'

/**
 * The Streak page's month (the board's CAL): ‹ the month › in one row, then a week a row from
 * Monday; a day practised filled in its paint, a day rested in the streak ringed in it, today ringed
 * in copper, the days still to come quiet. ‹ › go to the months before, never past today's.
 */
export function PracticeCalendar({ title }: { title: string }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const headingId = useId()
  const days = useProgress(selectDays)
  const today = useToday()
  // Months back from today's: 0 is this month; never one after it.
  const [shift, setShift] = useState(0)
  const weeks = monthOf(days, today, shift)
  const shown = dateOfDay(today)
  shown.setDate(1)
  shown.setMonth(shown.getMonth() + shift)
  const month = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(shown)
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  const narrow = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
  // A Monday to Sunday week for the column names: 5–11 January 2026.
  const weekdays = Array.from({ length: 7 }, (_, i) => narrow.format(new Date(2026, 0, 5 + i, 12)))
  return (
    <section aria-labelledby={headingId} className="card px-3 pt-2 pb-3.5">
      <h2 id={headingId} className="sr-only">
        {title}
      </h2>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label={t('days.previous')}
          title={t('days.previous')}
          className={ARROW}
          onClick={() => setShift((n) => n - 1)}
        >
          <ChevronLeft aria-hidden className="size-5.5" />
        </button>
        <p aria-live="polite" className="text-[1.0625rem] font-bold first-letter:uppercase">
          {month}
        </p>
        <button
          type="button"
          aria-label={t('days.next')}
          title={t('days.next')}
          disabled={shift === 0}
          className={ARROW}
          onClick={() => setShift((n) => Math.min(0, n + 1))}
        >
          <ChevronRight aria-hidden className="size-5.5" />
        </button>
      </div>
      <table className="w-full table-fixed border-separate border-spacing-1 text-center">
        <thead>
          <tr>
            {weekdays.map((name, i) => (
              <th
                key={i}
                scope="col"
                aria-hidden
                className="pb-1 text-xs font-semibold text-muted-foreground"
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
                <td key={d} className="p-0">
                  {cell ? (
                    <span
                      className={cn(
                        'mx-auto grid aspect-square w-full max-w-13 place-items-center rounded-pill text-[0.9375rem] tabular-nums',
                        cell.practised && 'bg-practised-day',
                        cell.rested && 'ring-2 ring-practised-day ring-inset',
                        cell.today && 'ring-2 ring-played',
                        cell.day > today && 'text-muted-foreground/60',
                      )}
                    >
                      <span aria-hidden>{dateOfDay(cell.day).getDate()}</span>
                      <span className="sr-only">
                        {t(
                          cell.practised
                            ? 'days.practised'
                            : cell.rested
                              ? 'days.rested'
                              : 'days.missed',
                          { day: long.format(dateOfDay(cell.day)) },
                        )}
                      </span>
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
