import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { OPEN_PLAINLY } from '@/shared/lib'
import { ButtonLink } from '@/shared/ui'
import { useGapsCount } from '../model/use-gaps-count'
import { TRAINER_TILE } from './trainer-tile'

const Icon = TRAINER_TILE.gaps.icon

/**
 * My gaps, the trainer that checks across every other, from the Quiz page's bar: a round icon button
 * as every bar's (A25), named My gaps, how many skills it holds to check in its name and as a dot on
 * it.
 */
export function GapsLink() {
  const { t } = useTranslation(['quiz', 'practice'])
  const gaps = useGapsCount()
  const label =
    gaps > 0
      ? `${t('quiz:trainers.gaps')}, ${t('practice:quiz.gaps', { count: gaps })}`
      : t('quiz:trainers.gaps')
  return (
    <ButtonLink
      variant="bar"
      size="icon"
      aria-label={label}
      title={label}
      className="relative"
      render={
        <Link to="/practice/quiz/$trainerId" params={{ trainerId: 'gaps' }} state={OPEN_PLAINLY} />
      }
    >
      <Icon aria-hidden />
      {gaps > 0 ? (
        <span
          aria-hidden
          className="absolute top-1.5 right-1.5 size-2.5 rounded-pill bg-attention ring-2 ring-background"
        />
      ) : null}
    </ButtonLink>
  )
}
