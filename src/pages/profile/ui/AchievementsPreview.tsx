import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { MilestoneId } from '@/entities/progress'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { SectionHead } from './SectionHead'
import { useDayName } from '../model/format'
import { useMilestones } from '../model/use-milestones'
import { MilestoneMark } from './marks'

/** A milestone as a row: its picture, its name, its day or Not earned yet; a link to its page. */
export function MilestoneRow({ id, day }: { id: MilestoneId; day: string | null }) {
  const { t } = useTranslation('account')
  const dayName = useDayName()
  return (
    <RowLink
      mark={<MilestoneMark id={id} earned={day !== null} />}
      title={t(`profile.achievements.names.${id}`)}
      detail={
        day
          ? t('profile.achievements.earned', { date: dayName(day) })
          : t('profile.achievements.notEarned')
      }
      render={<Link to="/profile/achievements/$achievementId" params={{ achievementId: id }} />}
    />
  )
}

/** The Profile's achievements: the earned ones first, three, then See all; none yet, said so. */
export function AchievementsPreview() {
  const { t } = useTranslation('account')
  const headingId = useId()
  const milestones = useMilestones()
  const earned = milestones.filter((milestone) => milestone.day !== null)
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <SectionHead
        id={headingId}
        title={t('profile.achievements.title')}
        to="/profile/achievements"
      />
      <SettingsGroup flush>
        {earned.length === 0 ? (
          <p className="px-4 py-3 text-pretty text-muted-foreground">
            {t('profile.achievements.none')}
          </p>
        ) : (
          earned.slice(0, 3).map((milestone) => <MilestoneRow key={milestone.id} {...milestone} />)
        )}
      </SettingsGroup>
    </section>
  )
}
