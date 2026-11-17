import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { badgesOf, nextMilestone, type Badge } from '@/entities/progress'
import { useProfileFigures } from '@/features/track-achievements'
import { ProgressBar, RowLink, SettingsGroup } from '@/shared/ui'
import { useBadgeStanding } from '../model/use-badge-standing'
import { BadgeMark } from './marks'
import { ProfileSection } from './ProfileSection'

/** The badge as a row: its picture, its name, where the learner stands; a link to its page. */
export function BadgeRow({ badge }: { badge: Badge }) {
  const { t } = useTranslation('account')
  const standing = useBadgeStanding()
  return (
    <RowLink
      mark={<BadgeMark id={badge.id} tier={badge.tier} />}
      title={t(`profile.badges.names.${badge.id}`)}
      detail={standing(badge)}
      render={<Link to="/profile/badges/$badgeId" params={{ badgeId: badge.id }} />}
    >
      {/* How near the next tier is as a picture; the line above says it in words. */}
      {badge.next !== null ? (
        <span className="mt-1 flex">
          <ProgressBar done={badge.have} total={badge.next} />
        </span>
      ) : null}
    </RowLink>
  )
}

/** The nearest tier still to earn (Quizlet's "Almost there"), a link to its badge's page. */
export function NextMilestone() {
  const { t } = useTranslation('account')
  const figures = useProfileFigures()
  const next = useMemo(() => nextMilestone(figures), [figures])
  if (!next) return null
  return (
    <Link
      to="/profile/badges/$badgeId"
      params={{ badgeId: next.id }}
      className="flex items-center gap-4 card px-4 py-3.5 transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3"
    >
      {/* The goal as a ring (the Profile board's RING): how far along, the count in its middle. */}
      <svg viewBox="0 0 48 48" aria-hidden className="size-13 shrink-0">
        <circle cx={24} cy={24} r={20} fill="none" strokeWidth={5} className="stroke-muted" />
        {next.goal > next.left ? (
          <circle
            cx={24}
            cy={24}
            r={20}
            fill="none"
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${((next.goal - next.left) / next.goal) * 100} 100`}
            transform="rotate(-90 24 24)"
            className="stroke-played"
          />
        ) : null}
        <text
          x={24}
          y={28}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          className="fill-foreground font-sans"
        >
          {next.goal - next.left}/{next.goal}
        </text>
      </svg>
      <span className="sr-only">
        {t('profile.badges.locked', { have: next.goal - next.left, goal: next.goal })}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[0.8125rem] font-semibold text-eyebrow">
          {t('profile.badges.next')}
        </span>
        <span className="font-semibold text-pretty">{t(`profile.badges.names.${next.id}`)}</span>
        <span className="text-[0.8125rem] text-pretty text-muted-foreground">
          {t(`profile.badges.goals.${next.id}`, { count: next.goal })}
        </span>
      </span>
    </Link>
  )
}

/** The Profile's badges: the first three, furthest along first, then See all. */
export function BadgesPreview() {
  const { t } = useTranslation('account')
  const figures = useProfileFigures()
  const badges = useMemo(
    () =>
      badgesOf(figures).toSorted(
        (a, b) => b.earned - a.earned || b.have / (b.next ?? 1) - a.have / (a.next ?? 1),
      ),
    [figures],
  )
  return (
    <ProfileSection title={t('profile.badges.title')} to="/profile/badges">
      <SettingsGroup flush>
        {badges.slice(0, 3).map((badge) => (
          <BadgeRow key={badge.id} badge={badge} />
        ))}
      </SettingsGroup>
    </ProfileSection>
  )
}
