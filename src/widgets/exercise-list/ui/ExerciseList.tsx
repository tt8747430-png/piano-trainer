import { Hand, Waypoints, Zap, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { exercisesIn, type ExerciseGroup } from '@/entities/exercise'
import { RowGroup, type Paint } from '@/shared/ui'
import { ExerciseRow } from './ExerciseRow'

/** The groups the Exercises page lists, in its order: a scale's and a chord's exercises open from their own pages. */
const LISTED = ['technique', 'barryHarris', 'jonny'] as const satisfies readonly ExerciseGroup[]

/** Each group's tile: technique yellow, the masters' ideas lilac. */
const GROUP_TILE = {
  technique: { icon: Hand, paint: 'yellow' },
  barryHarris: { icon: Waypoints, paint: 'lilac' },
  jonny: { icon: Zap, paint: 'lilac' },
} as const satisfies Record<(typeof LISTED)[number], { icon: LucideIcon; paint: Paint }>

/** The listed exercises, a titled group each, every row opening its exercise in the Player. */
export function ExerciseList() {
  const { t } = useTranslation('practice')
  return (
    <div className="flex flex-col gap-8">
      {LISTED.map((group) => (
        <RowGroup key={group} title={t(`groups.${group}`)}>
          {exercisesIn(group).map((exercise) => (
            <li key={exercise.id}>
              <ExerciseRow exercise={exercise} {...GROUP_TILE[group]} />
            </li>
          ))}
        </RowGroup>
      ))}
    </div>
  )
}
