import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectTrainerRecords, useProgress } from '@/entities/progress'
import type { TrainerId } from '@/features/trainer'
import { OPEN_PLAINLY } from '@/shared/lib'
import { RowGroup, RowLink } from '@/shared/ui'
import { TRAINER_TILE } from './trainer-tile'

/** The runs a trainer has, over all its levels. */
function runsOf(records: ReturnType<typeof selectTrainerRecords>, id: TrainerId): number {
  return Object.entries(records).reduce(
    (sum, [key, record]) => (key.startsWith(`${id}:`) ? sum + (record?.runs ?? 0) : sum),
    0,
  )
}

/** A topic's trainers under one heading: each row opens its trainer as it was left, saying how many runs it has. */
export function TrainerList({ trainers }: { trainers: readonly TrainerId[] }) {
  const { t } = useTranslation(['practice', 'quiz'])
  const records = useProgress(selectTrainerRecords)
  return (
    <RowGroup title={t('practice:quiz')}>
      {trainers.map((id) => {
        const runs = runsOf(records, id)
        return (
          <li key={id}>
            <RowLink
              title={t(`quiz:trainers.${id}`)}
              detail={runs > 0 ? t('quiz:record.runs', { count: runs }) : undefined}
              {...TRAINER_TILE[id]}
              render={
                <Link
                  to="/practice/trainers/$trainerId"
                  params={{ trainerId: id }}
                  state={OPEN_PLAINLY}
                />
              }
            />
          </li>
        )
      })}
    </RowGroup>
  )
}
