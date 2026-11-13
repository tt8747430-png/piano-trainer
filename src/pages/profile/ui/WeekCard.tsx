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
 * week's most, today in the strong sand, a day not played a flat line, each day's letter under it. The
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
      className="group flex flex-col gap-4 card px-4 py-4 transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[0.9375rem] font-semibold">{t('profile.week.title')}</p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {t('profile.week.summary', { time: time(total), days: played })}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <ol className="grid h-16 grid-cols-7 items-end gap-2">
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
                  'w-full rounded-control',
                  day.seconds > 0 ? 'min-h-1' : 'h-0.5 rounded-none bg-hairline',
                  day.seconds > 0 &&
                    (day.day === today ? 'bg-paint-full-sand' : 'bg-paint-full-sand/45'),
                )}
                style={day.seconds > 0 ? { height: `${(day.seconds / most) * 100}%` } : undefined}
              />
            </li>
          ))}
        </ol>
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
