import { useParams } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { isMilestoneId, levelOf, useProgress } from '@/entities/progress'
import { useProfileFigures } from '@/features/track-achievements'
import { BackButton, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { useDayName, usePracticeTime } from '../model/format'
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
  const time = usePracticeTime()
  const milestones = useMilestones()
  const records = [
    [
      t('profile.achievements.level'),
      t('profile.achievements.levelValue', { level: levelOf(figures.practiceSeconds) }),
    ],
    [
      t('profile.achievements.longestStreak'),
      t('profile.achievements.days', { count: figures.bestStreak }),
    ],
    [t('profile.achievements.practiceTime'), time(figures.practiceSeconds)],
    [
      t('profile.achievements.bestAccuracy'),
      t('profile.achievements.percent', { percent: figures.bestAccuracy }),
    ],
    [t('profile.achievements.songsLearned'), String(figures.songsLearned)],
    [t('profile.achievements.daysPractised'), String(figures.daysPractised)],
  ] as const
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('profile.achievements.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <section aria-labelledby={recordsId} className="flex flex-col gap-2">
          <h2 id={recordsId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
            {t('profile.achievements.records')}
          </h2>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {records.map(([label, value]) => (
              <div key={label} className="flex min-w-0 flex-col-reverse gap-1 card px-4 py-3">
                <dt className="text-sm text-pretty text-muted-foreground">{label}</dt>
                <dd className="font-display text-xl font-semibold text-balance tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby={milestonesId} className="flex flex-col gap-2">
          <div className="flex flex-col px-3">
            <h2 id={milestonesId} className="font-sans text-sm font-semibold text-muted-foreground">
              {t('profile.achievements.milestones')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('profile.achievements.milestonesSay')}
            </p>
          </div>
          <SettingsGroup flush>
            {milestones.map((milestone) => (
              <MilestoneRow key={milestone.id} {...milestone} />
            ))}
          </SettingsGroup>
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
    <div className="flex flex-col gap-6">
      <ScreenHeader title={name} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <section className="flex flex-col items-center gap-2 text-center">
          <MilestoneMark id={achievementId} earned={day !== null} size="hero" />
          <p className="font-display text-2xl font-semibold">{name}</p>
          <p className="text-muted-foreground">
            {day
              ? t('profile.achievements.earned', { date: dayName(day) })
              : t('profile.achievements.notEarned')}
          </p>
        </section>
        <section aria-labelledby="achievement-how" className="flex flex-col gap-1.5">
          <h2
            id="achievement-how"
            className="px-3 font-sans text-sm font-semibold text-muted-foreground"
          >
            {t('profile.achievements.how')}
          </h2>
          <p className="card px-4 py-3 text-pretty">
            {t(`profile.achievements.ways.${achievementId}`)}
          </p>
        </section>
      </div>
    </div>
  )
}
