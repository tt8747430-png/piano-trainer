import { Link } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { dateOfDay, lastWeek, selectDays, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn, formatLocale } from '@/shared/lib'
import { useToday } from '@/widgets/practice-days'
import { usePracticeTime } from '../model/format'
import { ProfileSection } from './ProfileSection'

/** The steps the chart's two lines stand at, in minutes: the least whose second holds the week's most. */
const STEPS = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240] as const

/**
 * The last seven days as a picture under its own heading (WEEKL, WEEKLAP): "Last 7 days" with the time
 * practised and the days of seven at the right; in its card the minutes' scale at the left (0 and two
 * lines), one bar a day on it, today in copper and the days before in ember, a day not played a flat
 * stub, each day's letter under it. The plot is 72 tall on a phone and 150 on a laptop, where the
 * card stands as tall as the badges beside it and the chart fills it. The card opens Streak.
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
        minutes: (seconds[day] ?? 0) / 60,
      })),
    [days, seconds, today],
  )
  const total = week.reduce((sum, day) => sum + day.minutes * 60, 0)
  const played = week.filter((day) => day.practised).length
  const most = Math.max(...week.map((day) => day.minutes))
  const step = STEPS.find((each) => each * 2 >= most) ?? STEPS.at(-1) ?? 240
  const letter = new Intl.DateTimeFormat(formatLocale(locale), { weekday: 'narrow' })
  const named = new Intl.DateTimeFormat(formatLocale(locale), { weekday: 'long' })
  return (
    <ProfileSection
      fold="week"
      title={t('profile.week.title')}
      aside={
        <span className="text-subhead text-muted-foreground tabular-nums">
          {t('profile.week.summary', { time: time(total), days: played })}
        </span>
      }
    >
      <Link
        to="/profile/streak"
        aria-label={t('profile.week.title')}
        className="flex flex-col card px-4 pt-3.5 pb-3 transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3 lg:justify-center"
      >
        <div className="relative flex gap-2 [--chart-h:4.5rem] [--chart-top:calc(var(--chart-h)-0.5rem)] lg:[--chart-h:9.375rem] lg:[--chart-top:calc(var(--chart-h)-0.375rem)]">
          <div
            aria-hidden
            className="relative h-(--chart-h) w-5 shrink-0 text-right text-xs leading-3 text-muted-foreground tabular-nums"
          >
            <span className="absolute right-0 bottom-[calc(var(--chart-top)-6px)]">{step * 2}</span>
            <span className="absolute right-0 bottom-[calc(var(--chart-top)/2-6px)]">{step}</span>
            <span className="absolute right-0 -bottom-1.5">0</span>
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col gap-2">
            {/* A week with no day practised says what fills it, over the flat days' plot. */}
            {played === 0 ? (
              <p className="absolute inset-x-0 top-1 text-center text-sm text-pretty text-muted-foreground">
                {t('profile.week.empty')}
              </p>
            ) : null}
            <ol className="relative flex h-(--chart-h) items-end gap-2 shadow-[inset_0_-1px_0_var(--color-border)]">
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[calc(var(--chart-top)/2)] h-px bg-muted"
              />
              <span aria-hidden className="absolute inset-x-0 bottom-(--chart-top) h-px bg-muted" />
              {week.map((day) => (
                <li
                  key={day.day}
                  aria-label={t('profile.week.day', {
                    day: named.format(dateOfDay(day.day)),
                    time: time(day.minutes * 60),
                  })}
                  className="relative flex h-full flex-1 items-end"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'w-full rounded-t-[2px]',
                      day.minutes > 0
                        ? day.day === today
                          ? 'bg-played'
                          : 'bg-practised-day'
                        : day.practised
                          ? 'h-1 bg-practised-day'
                          : 'h-0.5 bg-muted',
                    )}
                    style={
                      day.minutes > 0
                        ? ({
                            height: `calc(var(--chart-top) * ${Math.min(1.1, day.minutes / (step * 2))})`,
                          } satisfies CSSProperties)
                        : undefined
                    }
                  />
                </li>
              ))}
            </ol>
            <ol aria-hidden className="flex gap-2 text-center text-xs text-muted-foreground">
              {week.map((day) => (
                <li
                  key={day.day}
                  className={cn('flex-1', day.day === today && 'font-semibold text-foreground')}
                >
                  {letter.format(dateOfDay(day.day))}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Link>
    </ProfileSection>
  )
}
