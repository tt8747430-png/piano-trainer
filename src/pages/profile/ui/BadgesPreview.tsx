import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { badgesOf, type Badge } from '@/entities/progress'
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
