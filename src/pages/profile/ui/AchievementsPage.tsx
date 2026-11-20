import { useParams } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { isMilestoneId, levelOf, useProgress } from '@/entities/progress'
import { useProfileFigures } from '@/features/track-achievements'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { useDayName } from '../model/format'
import { ProfileList } from './ProfileList'
import { useMilestones } from '../model/use-milestones'
import { MilestoneRow } from './AchievementsPreview'
import { MilestoneMark } from './marks'

/**
 * Achievements (B1): Personal records (Level, Longest streak, Practice time, Best accuracy, Songs
 * learned, Days practised), then the Milestones, earned once each.
 */
export function AchievementsPage() {
  const { t } = useTranslation('account')
  const recordsId = useId()
  const milestonesId = useId()
  const figures = useProfileFigures()
  const milestones = useMilestones()
  const records = [
    [t('profile.achievements.level'), String(levelOf(figures.practiceSeconds))],
    [
      t('profile.achievements.longestStreak'),
      t('profile.achievements.days', { count: figures.bestStreak }),
    ],
    [
      t('profile.achievements.bestAccuracy'),
      figures.bestAccuracy > 0
        ? t('profile.achievements.percent', { percent: figures.bestAccuracy })
        : '—',
    ],
    [t('profile.achievements.daysPractised'), String(figures.daysPractised)],
  ] as const
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader column title={t('profile.achievements.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <section aria-labelledby={recordsId} className="flex flex-col gap-2">
          <h2 id={recordsId} className="px-4 caps">
            {t('profile.achievements.records')}
          </h2>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {records.map(([label, value]) => (
              <div key={label} className="flex min-w-0 flex-col-reverse gap-0.5 card px-4 py-3">
                <dt className="text-[0.8125rem] leading-[normal] text-pretty text-muted-foreground">
                  {label}
                </dt>
                <dd className="font-sans text-2xl leading-[normal] font-bold text-balance tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby={milestonesId} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id={milestonesId} className="font-sans text-xl font-bold">
              {t('profile.achievements.milestones')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('profile.achievements.milestonesSay')}
            </p>
          </div>
          <ProfileList page>
            {milestones.map((milestone) => (
              <MilestoneRow key={milestone.id} {...milestone} />
            ))}
          </ProfileList>
        </section>
      </div>
    </div>
  )
}

/** One milestone (B1): its picture, its name, the day it was earned or not yet, How to earn it. */
export function AchievementPage() {
  const { t } = useTranslation('account')
  const { achievementId } = useParams({ from: '/shell/profile/achievements/$achievementId' })
  const earned = useProgress((state) => state.earned)
  const dayName = useDayName()
  if (!isMilestoneId(achievementId)) return null
  const day = earned[achievementId] ?? null
  const name = t(`profile.achievements.names.${achievementId}`)
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader column title={name} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <section className="flex flex-col items-center gap-2 text-center">
          <MilestoneMark earned={day !== null} size="hero" />
          <p className="font-sans text-[1.625rem]/tight font-bold text-balance">{name}</p>
          <p className="text-[0.9375rem] text-muted-foreground">
            {day
              ? t('profile.achievements.earned', { date: dayName(day) })
              : t('profile.achievements.notEarned')}
          </p>
        </section>
        <section aria-labelledby="achievement-how" className="flex flex-col gap-1.5">
          <h2 id="achievement-how" className="px-1 caps">
            {t('profile.achievements.how')}
          </h2>
          <p className="card p-4 text-pretty">{t(`profile.achievements.ways.${achievementId}`)}</p>
        </section>
      </div>
    </div>
  )
}
