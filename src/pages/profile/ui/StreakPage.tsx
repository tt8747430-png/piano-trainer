import { Flame } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { practiceRecord, RESTS_KEPT, selectDays, streakOf, useProgress } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { BackButton, GroupRow, GroupRows, InfoTip, ScreenHeader } from '@/shared/ui'
import { PracticeCalendar, useToday } from '@/widgets/practice-days'

/**
 * Streak (B1, memory-palaces'; its board P9_STREAK): the flame in its round wash beside the day
 * streak and what keeps it, the month's calendar (‹ › to the months before; practised days filled,
 * today ringed, a day rested ringed in the day's paint), then the longest streak, the days practised
 * this month and the rest days kept, each earned by seven days in a row (two at most), as value rows.
 */
export function StreakPage() {
  const { t } = useTranslation('account')
  const days = useProgress(selectDays)
  const progress = useProgress((state) => state)
  const today = useToday()
  const { count: run, rests } = streakOf(days, today)
  const record = useMemo(() => practiceRecord(progress), [progress])
  const thisMonth = days.filter((day) => day.slice(0, 7) === today.slice(0, 7)).length
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('profile.streakPage.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <section className="flex items-center gap-4 p-1">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-paint-sand text-on-paint-sand">
            <Flame aria-hidden className={cn('size-8', run > 0 && 'fill-current')} />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-sans text-[1.75rem]/tight font-bold tracking-[-0.01em]">
              {t('profile.streakPage.days', { count: run })}
            </span>
            <span className="text-[0.9375rem]/snug text-pretty text-muted-foreground">
              {run > 0 ? t('profile.streakPage.keep') : t('profile.streakPage.start')}
            </span>
          </span>
        </section>
        <PracticeCalendar title={t('profile.streakPage.calendar')} />
        <GroupRows label={t('profile.streakPage.title')} surface="sheet">
          <GroupRow label={t('profile.streakPage.longest')}>
            <span className="text-muted-foreground">
              {t('profile.achievements.days', { count: record.bestStreak })}
            </span>
          </GroupRow>
          <GroupRow label={t('profile.streakPage.month')}>
            <span className="text-muted-foreground">
              {t('profile.achievements.days', { count: thisMonth })}
            </span>
          </GroupRow>
          <GroupRow
            label={
              <span className="flex items-center gap-1.5">
                {t('profile.streakPage.rests')}
                <InfoTip name={t('profile.streakPage.rests')}>
                  {t('profile.streakPage.restsInfo')}
                </InfoTip>
              </span>
            }
          >
            <span className="text-muted-foreground tabular-nums">
              {t('profile.streakPage.restsOf', { count: rests, max: RESTS_KEPT })}
            </span>
          </GroupRow>
        </GroupRows>
      </div>
    </div>
  )
}
