import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { dateOfDay, lastWeek, selectDays, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useToday } from '@/widgets/practice-days'
import { usePracticeTime } from '../model/format'

/**
 * The last seven days as a picture (canvas 128): "Last 7 days", the time practised and the days of seven, then
 * one bar a day, its height the minutes played against the week's most (the value axis's one
 * line), today in the strong sand, a day not played a flat line, each day's letter under it. The
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
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-sm font-semibold text-muted-foreground">{t('profile.week.title')}</p>
          <p className="font-display text-xl font-semibold tabular-nums">
            {t('profile.week.summary', { time: time(total), days: played })}
          </p>
        </div>
        <ChevronRight aria-hidden className="mt-1 size-5 shrink-0 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        {most > 0 ? (
          <p className="text-xs text-muted-foreground tabular-nums">
            {t('profile.week.most', { time: time(most) })}
          </p>
        ) : null}
        <ol className="grid h-24 grid-cols-7 items-end gap-2 border-t border-dashed border-hairline">
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
                  'w-full rounded-t-[3px]',
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
