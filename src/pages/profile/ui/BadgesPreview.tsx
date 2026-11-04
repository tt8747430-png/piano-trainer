import { Link } from '@tanstack/react-router'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { badgesOf, nextMilestone, type Badge } from '@/entities/progress'
import { useProfileFigures } from '@/features/track-achievements'
import { ProgressMeter, RowLink, SettingsGroup } from '@/shared/ui'
import { useBadgeStanding } from '../model/use-badge-standing'
import { BadgeMark } from './marks'

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
      {badge.next !== null ? (
        <ProgressMeter
          done={badge.have}
          total={badge.next}
          count={t('profile.badges.locked', { have: badge.have, goal: badge.next })}
          said={t(`profile.badges.names.${badge.id}`)}
        />
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
      className="flex flex-col gap-2 card p-4 transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3"
    >
      <span className="text-sm font-semibold">{t('profile.badges.almost')}</span>
      <span className="text-pretty">
        {t('profile.badges.left', {
          count: next.left,
          badge: t(`profile.badges.names.${next.id}`),
        })}
      </span>
      <ProgressMeter
        done={next.goal - next.left}
        total={next.goal}
        count={t('profile.badges.locked', { have: next.goal - next.left, goal: next.goal })}
        said={t(`profile.badges.names.${next.id}`)}
      />
    </Link>
  )
}

/** The Profile's badges: the first three, furthest along first, then See all. */
export function BadgesPreview() {
  const { t } = useTranslation('account')
  const headingId = useId()
  const figures = useProfileFigures()
  const badges = useMemo(
    () =>
      badgesOf(figures).toSorted(
        (a, b) => b.earned - a.earned || b.have / (b.next ?? 1) - a.have / (a.next ?? 1),
      ),
    [figures],
  )
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('profile.badges.title')}
      </h2>
      <SettingsGroup flush>
        {badges.slice(0, 3).map((badge) => (
          <BadgeRow key={badge.id} badge={badge} />
        ))}
        <RowLink title={t('profile.badges.seeAll')} render={<Link to="/profile/badges" />} />
      </SettingsGroup>
    </section>
  )
}
