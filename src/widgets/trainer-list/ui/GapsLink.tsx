import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { OPEN_PLAINLY } from '@/shared/lib'
import { ButtonLink } from '@/shared/ui'
import { useGapsCount } from '../model/use-gaps-count'
import { GapsBadge } from './GapsBadge'
import { TRAINER_TILE } from './trainer-tile'

const Icon = TRAINER_TILE.gaps.icon

/**
 * My gaps, the trainer that checks across every other, from the Quiz page's bar: how many skills it
 * holds to check after its name, behind the gap's dot.
 */
export function GapsLink() {
  const { t } = useTranslation('quiz')
  const gaps = useGapsCount()
  return (
    <ButtonLink
      variant="outline"
      render={
        <Link to="/practice/quiz/$trainerId" params={{ trainerId: 'gaps' }} state={OPEN_PLAINLY} />
      }
    >
      <Icon data-icon="inline-start" aria-hidden />
      {t('trainers.gaps')} <GapsBadge count={gaps} />
    </ButtonLink>
  )
}
