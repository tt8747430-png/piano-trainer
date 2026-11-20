import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { MilestoneId } from '@/entities/progress'
import { RowLink } from '@/shared/ui'
import { ProfileList } from './ProfileList'
import { ProfileSection } from './ProfileSection'
import { useDayName } from '../model/format'
import { useMilestones } from '../model/use-milestones'
import { MilestoneMark } from './marks'

/** A milestone as a row: its picture, its name, its day or Not earned yet; a link to its page. */
export function MilestoneRow({ id, day }: { id: MilestoneId; day: string | null }) {
  const { t } = useTranslation('account')
  const dayName = useDayName()
  return (
    <RowLink
      mark={<MilestoneMark earned={day !== null} />}
      title={
        day ? (
          t(`profile.achievements.names.${id}`)
        ) : (
          <span className="text-muted-foreground">{t(`profile.achievements.names.${id}`)}</span>
        )
      }
      detail={
        day
          ? t('profile.achievements.earned', { date: dayName(day) })
          : t('profile.achievements.notEarned')
      }
      render={<Link to="/profile/achievements/$achievementId" params={{ achievementId: id }} />}
    />
  )
}

/**
 * The Profile's achievements (ACH9): three, the earned first, newest first, then those still to
 * earn, each with its lock; then See all.
 */
export function AchievementsPreview() {
  const { t } = useTranslation('account')
  const milestones = useMilestones()
  const shown = [
    ...milestones
      .filter((milestone) => milestone.day !== null)
      .toSorted((a, b) => (b.day ?? '').localeCompare(a.day ?? '')),
    ...milestones.filter((milestone) => milestone.day === null),
  ].slice(0, 3)
  return (
    <ProfileSection
      fold="achievements"
      title={t('profile.achievements.title')}
      to="/profile/achievements"
    >
      <ProfileList>
        {shown.map((milestone) => (
          <MilestoneRow key={milestone.id} {...milestone} />
        ))}
      </ProfileList>
    </ProfileSection>
  )
}
