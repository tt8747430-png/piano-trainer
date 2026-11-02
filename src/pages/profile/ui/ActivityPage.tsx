import { CalendarDays, Flame, Trophy } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { practiceRecord, selectDays, streak, useProgress } from '@/entities/progress'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PracticeCalendar, useToday } from '@/widgets/practice-days'

/**
 * The learner's Activity (round 26, Noji's page of its own, opened from the Profile): their days at
 * the piano in figures, the run going on, the longest and every day practised, then the month's
 * calendar.
 */
export function ActivityPage() {
  const { t } = useTranslation('account')
  const days = useProgress(selectDays)
  const progress = useProgress((state) => state)
  const today = useToday()
  const record = useMemo(() => practiceRecord(progress), [progress])
  const figures = [
    { label: t('profile.streak'), value: streak(days, today), icon: Flame },
    { label: t('profile.bestStreak'), value: record.bestStreak, icon: Trophy },
    { label: t('profile.days'), value: record.daysPractised, icon: CalendarDays },
  ] as const
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('profile.activity')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <dl
          aria-label={t('profile.figures')}
          className="grid grid-cols-3 divide-x divide-border card py-4"
        >
          {figures.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex min-w-0 flex-col-reverse items-center gap-1.5 px-2 text-center"
            >
              <dt className="text-xs text-pretty text-muted-foreground sm:text-sm">{label}</dt>
              <dd className="flex items-center gap-1.5 font-display text-2xl leading-none font-semibold tabular-nums">
                <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <PracticeCalendar title={t('profile.month')} />
      </div>
    </div>
  )
}
