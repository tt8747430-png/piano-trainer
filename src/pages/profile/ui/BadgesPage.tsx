import { useParams } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { badgesOf, TIERS, useProgress, type BadgeId } from '@/entities/progress'
import { useProfileFigures } from '@/features/track-achievements'
import { cn } from '@/shared/lib'
import { BackButton, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { useDayName } from '../model/format'
import { useBadgeStanding } from '../model/use-badge-standing'
import { BadgeRow } from './BadgesPreview'
import { BadgeMark } from './marks'

/** Every badge (B1), each a row: its picture by tier, its name, "Silver, 2 of 4", a bar to the next. */
export function BadgesPage() {
  const { t } = useTranslation('account')
  const figures = useProfileFigures()
  const badges = useMemo(() => badgesOf(figures), [figures])
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('profile.badges.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <SettingsGroup flush>
          {badges.map((badge) => (
            <BadgeRow key={badge.id} badge={badge} />
          ))}
        </SettingsGroup>
      </div>
    </div>
  )
}

/**
 * One badge (B1): its picture large, its name and tier, How to earn it, then its four tiers, each
 * its goal and the day it was reached, how many are still to go, or Locked; and the learner's figure.
 */
export function BadgePage() {
  const { t } = useTranslation('account')
  const { badgeId } = useParams({ from: '/shell/profile/badges/$badgeId' })
  const figures = useProfileFigures()
  const earned = useProgress((state) => state.earned)
  const dayName = useDayName()
  const standing = useBadgeStanding()
  const badge = useMemo(
    () => badgesOf(figures).find((each) => each.id === badgeId),
    [figures, badgeId],
  )
  if (!badge) return null
  const id: BadgeId = badge.id
  const name = t(`profile.badges.names.${id}`)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={name} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <section className="flex flex-col items-center gap-2 text-center">
          <BadgeMark id={id} tier={badge.tier} size="hero" />
          <p className="font-display text-2xl font-semibold">{name}</p>
          <p className="text-muted-foreground">
            {badge.tier
              ? `${t(`profile.badges.tiers.${badge.tier}`)} · ${t('profile.badges.tierOf', { tier: badge.earned })}`
              : `${t('profile.badges.notStarted')} · ${standing(badge)}`}
          </p>
        </section>
        <section aria-labelledby="badge-how" className="flex flex-col gap-1.5">
          <h2 id="badge-how" className="px-3 font-sans text-sm font-semibold text-muted-foreground">
            {t('profile.badges.how')}
          </h2>
          <p className="card px-4 py-3 text-pretty">{t(`profile.badges.ways.${id}`)}</p>
        </section>
        <section aria-labelledby="badge-tiers" className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-2 px-3">
            <h2 id="badge-tiers" className="font-sans text-sm font-semibold text-muted-foreground">
              {t('profile.badges.tiersTitle')}
            </h2>
            <p className="text-sm font-semibold tabular-nums">
              {t('profile.badges.you', { have: badge.have })}
            </p>
          </div>
          <ol className="flex flex-col divide-y divide-border card px-4">
            {TIERS.map((tier, i) => {
              const goal = badge.tiers[i] ?? 0
              const reached = earned[`${id}:${i + 1}`]
              const isNext = i === badge.earned
              return (
                <li key={tier} className="flex min-h-14 items-center gap-3 py-2">
                  <BadgeMark id={id} tier={i < badge.earned ? tier : null} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-semibold">{t(`profile.badges.tiers.${tier}`)}</span>
                    <span className="text-sm text-pretty text-muted-foreground">
                      {t(`profile.badges.goals.${id}`, { count: goal })}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-right text-sm tabular-nums',
                      i < badge.earned ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {i < badge.earned
                      ? reached
                        ? t('profile.badges.reached', { date: dayName(reached) })
                        : t(`profile.badges.tiers.${tier}`)
                      : isNext
                        ? t('profile.badges.toGo', { count: goal - badge.have })
                        : t('profile.badges.lockedTier')}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}
