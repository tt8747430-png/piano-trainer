import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { selectAllAnswers, selectPractised, useProgress } from '@/entities/progress'
import { myGaps } from '@/features/trainer'
import { OPEN_PLAINLY } from '@/shared/lib'
import { ButtonLink } from '@/shared/ui'
import { TRAINER_TILE } from './trainer-tile'

const Icon = TRAINER_TILE.gaps.icon

/**
 * My gaps, the trainer that checks across every other, from the Quiz page's bar: how many skills it
 * holds to check after its name, behind the gap's dot.
 */
export function GapsLink() {
  const { t } = useTranslation(['practice', 'quiz'])
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  const gaps = useMemo(() => myGaps(answers, practised).length, [answers, practised])
  return (
    <ButtonLink
      variant="outline"
      render={
        <Link
          to="/practice/trainers/$trainerId"
          params={{ trainerId: 'gaps' }}
          state={OPEN_PLAINLY}
        />
      }
    >
      <Icon data-icon="inline-start" aria-hidden />
      {t('quiz:trainers.gaps')}
      {gaps > 0 ? (
        <>
          {' '}
          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground tabular-nums">
            <span aria-hidden className="size-2.5 rounded-full bg-attention" />
            {t('practice:gaps', { count: gaps })}
          </span>
        </>
      ) : null}
    </ButtonLink>
  )
}
