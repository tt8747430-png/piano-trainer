import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { dateOfDay, lastWeek, selectDays, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useToday } from '@/widgets/practice-days'
import { usePracticeTime } from '../model/format'

/**
 * The last seven days as a picture (canvas 128): "Last 7 days" and, at the right, the time
 * practised and the days of seven; then one bar a day, its height the minutes played against the
 * week's most, today in copper, a day not played a flat line, each day's letter under it. The
 * whole card opens Streak, the month's calendar.
 */
export function WeekCard() {
  const { t } = useTranslation('account')
  const locale = useLocale()
  const days = useProgress(selectDays)
  const seconds = useProgress((state) => state.seconds)
  const today = useToday()
  const time = usePracticeTime()
  const week = useMemo(
    () =>
      lastWeek(days, today).map(({ day, practised }) => ({
        day,
        practised,
        seconds: seconds[day] ?? 0,
      })),
    [days, seconds, today],
  )
  const total = week.reduce((sum, day) => sum + day.seconds, 0)
  const played = week.filter((day) => day.practised).length
  const most = Math.max(...week.map((day) => day.seconds))
  const letter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
  const named = new Intl.DateTimeFormat(locale, { weekday: 'long' })
  return (
    <Link
      to="/profile/streak"
      className="group flex flex-col gap-2.5 card px-4 pt-3.5 pb-3 transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[0.9375rem] font-bold">{t('profile.week.title')}</p>
        <p className="text-[0.8125rem] text-muted-foreground tabular-nums">
          {t('profile.week.summary', { time: time(total), days: played })}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {/* A week with no day practised says what fills it, over the flat days. A day practised
            with no timed minutes (an exercise run, the keys played) still counts in "n of 7 days". */}
        <div className="relative">
          {played === 0 ? (
            <p className="absolute inset-x-0 top-5 text-center text-sm text-pretty text-muted-foreground">
              {t('profile.week.empty')}
            </p>
          ) : null}
          <ol className="grid h-18 grid-cols-7 items-end gap-2">
            {week.map((day) => (
              <li
                key={day.day}
                aria-label={t('profile.week.day', {
                  day: named.format(dateOfDay(day.day)),
                  time: time(day.seconds),
                })}
                className="flex h-full items-end"
              >
                <span
                  aria-hidden
                  className={cn(
                    'w-full rounded-[6px]',
                    // A day practised with no timed minutes is a stub in the paint, not a bare day.
                    day.seconds > 0
                      ? 'min-h-1'
                      : day.practised
                        ? 'h-1 bg-played/50'
                        : 'h-1 bg-muted',
                    day.seconds > 0 && (day.day === today ? 'bg-played' : 'bg-played/50'),
                  )}
                  style={day.seconds > 0 ? { height: `${(day.seconds / most) * 100}%` } : undefined}
                />
              </li>
            ))}
          </ol>
        </div>
        <ol
          aria-hidden
          className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground"
        >
          {week.map((day) => (
            <li key={day.day} className={cn(day.day === today && 'font-semibold text-foreground')}>
              {letter.format(dateOfDay(day.day))}
            </li>
          ))}
        </ol>
      </div>
    </Link>
  )
}
