import { useTranslation } from 'react-i18next'
import { dateOfDay, localDay, selectHistory, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { BackButton, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { useToday } from '@/widgets/practice-days'
import { usePracticeTime } from '../model/format'
import { byDay, useHistoryDay, useRunLines } from '../model/runs'
import { RunRow } from './HistoryPreview'

const DAYS = 30

/**
 * The last 30 days as a chart (canvas 160): the time practised and how it compares with the 30
 * days before, then one bar a day against a scale of minutes, today in the strong sand.
 */
function MonthChart() {
  const { t } = useTranslation('account')
  const locale = useLocale()
  const seconds = useProgress((state) => state.seconds)
  const today = useToday()
  const time = usePracticeTime()
  const dayOf = (back: number) => localDay(dateOfDay(today, -back))
  const month = Array.from({ length: DAYS }, (_, i) => {
    const day = dayOf(DAYS - 1 - i)
    return { day, seconds: seconds[day] ?? 0 }
  })
  const total = month.reduce((sum, day) => sum + day.seconds, 0)
  const before = Array.from({ length: DAYS }, (_, i) => seconds[dayOf(DAYS + i)] ?? 0).reduce(
    (sum, s) => sum + s,
    0,
  )
  const change = total - before
  const most = Math.max(...month.map((day) => day.seconds))
  // The scale's top: the next whole half hour above the most practised day, at least 30 minutes.
  const top = Math.max(30, Math.ceil(most / 60 / 30) * 30)
  const short = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
  const named = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <div className="flex flex-col gap-3 card px-4 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="flex flex-col gap-0.5">
          <span className="text-[1.375rem] leading-tight font-bold tabular-nums">
            {time(total)}
          </span>
          <span className="text-sm text-muted-foreground">{t('profile.history.month')}</span>
        </p>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">
          {change === 0
            ? t('profile.history.same')
            : t(change > 0 ? 'profile.history.more' : 'profile.history.less', {
                time: time(Math.abs(change)),
              })}
        </p>
      </div>
      <div className="flex gap-2">
        <div
          aria-hidden
          className="flex h-30 flex-none flex-col justify-between text-right text-[0.6875rem] text-muted-foreground tabular-nums"
        >
          <span>{t('profile.history.minutes', { m: top })}</span>
          <span>{top / 2}</span>
          <span>0</span>
        </div>
        <ol
          aria-label={t('profile.history.chart')}
          className="relative flex h-30 min-w-0 flex-1 items-end gap-0.5 shadow-[inset_0_-1px_0_var(--color-border)]"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-1/2 border-t border-dashed border-border"
          />
          {month.map(({ day, seconds: played }) => {
            const minutes = Math.round(played / 60)
            return (
              <li
                key={day}
                aria-label={`${named.format(dateOfDay(day))}: ${time(played)}`}
                title={`${short.format(dateOfDay(day))} · ${time(played)}`}
                className={cn(
                  'relative min-w-0 flex-1',
                  day === today ? 'bg-paint-full-sand' : 'bg-paint-full-sand/45',
                )}
                style={{ height: `${Math.min(100, (minutes / top) * 100)}%` }}
              />
            )
          })}
        </ol>
      </div>
      <div
        aria-hidden
        className="flex justify-between pl-11 text-[0.6875rem] text-muted-foreground"
      >
        <span>{short.format(dateOfDay(month[0]?.day ?? today))}</span>
        <span>{short.format(dateOfDay(month[DAYS / 2]?.day ?? today))}</span>
        <span>{t('profile.history.today')}</span>
      </div>
    </div>
  )
}

/**
 * Practice history (canvas 160): the last 30 days as a chart, then every run kept, by day, newest
 * first; each row opens its results. Where it is kept, said truly at its foot.
 */
export function HistoryPage() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  const runs = useProgress(selectHistory)
  const lines = useRunLines()
  const dayName = useHistoryDay(useToday())
  const days = byDay(runs)
    .map(({ day, runs: kept }) => ({ day, lines: lines(kept) }))
    .filter(({ lines: shown }) => shown.length > 0)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('profile.history.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <MonthChart />
        {days.length === 0 ? (
          <SettingsGroup>
            <p className="py-1 text-pretty text-muted-foreground">{t('profile.history.none')}</p>
          </SettingsGroup>
        ) : (
          days.map(({ day, lines: shown }) => (
            <SettingsGroup key={day} title={dayName(day)} flush>
              {shown.map((line) => (
                <RunRow key={line.id} {...line} />
              ))}
            </SettingsGroup>
          ))
        )}
        <p className="text-center text-sm text-pretty text-muted-foreground">
          {t(account ? 'profile.history.keptEverywhere' : 'profile.history.kept')}
        </p>
      </div>
    </div>
  )
}
