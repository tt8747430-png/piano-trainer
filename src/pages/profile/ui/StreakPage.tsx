import { Flame } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { practiceRecord, selectDays, streak, useProgress } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PracticeCalendar, useToday } from '@/widgets/practice-days'

/**
 * Streak (B1, memory-palaces'): the day streak large with its flame and what keeps it, the month's
 * calendar (‹ › to the months before; practised days filled, today ringed), then the longest
 * streak and the days practised this month.
 */
export function StreakPage() {
  const { t } = useTranslation('account')
  const days = useProgress(selectDays)
  const progress = useProgress((state) => state)
  const today = useToday()
  const run = streak(days, today)
  const record = useMemo(() => practiceRecord(progress), [progress])
  const thisMonth = days.filter((day) => day.slice(0, 7) === today.slice(0, 7)).length
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('profile.streakPage.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <section className="flex flex-col items-center gap-2 pt-2 text-center">
          <Flame
            aria-hidden
            className={cn(
              'size-16',
              run > 0 ? 'fill-paint-full-sand text-paint-full-sand' : 'text-muted-foreground',
            )}
          />
          <p className="font-display text-4xl font-semibold tabular-nums">
            {t('profile.streakPage.days', { count: run })}
          </p>
          <p className="max-w-sm text-pretty text-muted-foreground">
            {run > 0 ? t('profile.streakPage.keep') : t('profile.streakPage.start')}
          </p>
        </section>
        <PracticeCalendar title={t('profile.streakPage.calendar')} browse />
        <dl className="grid grid-cols-2 gap-2">
          {[
            [t('profile.streakPage.longest'), record.bestStreak],
            [t('profile.streakPage.month'), thisMonth],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col-reverse gap-1 card px-4 py-3">
              <dt className="text-sm text-pretty text-muted-foreground">{label}</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
