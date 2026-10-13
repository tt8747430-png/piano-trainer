import { Hand, Waypoints, Zap, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { exercisesIn } from '@/entities/exercise'
import { RowGroup, type Paint } from '@/shared/ui'
import { LISTED_GROUPS, type ListedGroup } from '../model/listed-groups'
import { ExerciseRow } from './ExerciseRow'

/** Each group's tile: technique yellow, the masters' ideas lilac. */
const GROUP_TILE = {
  technique: { icon: Hand, paint: 'yellow' },
  barryHarris: { icon: Waypoints, paint: 'lilac' },
  jonny: { icon: Zap, paint: 'lilac' },
} as const satisfies Record<ListedGroup, { icon: LucideIcon; paint: Paint }>

/** The listed exercises, a titled group each, every row opening its exercise in the Player. */
export function ExerciseList() {
  const { t } = useTranslation('practice')
  return (
    <div className="flex flex-col gap-8">
      {LISTED_GROUPS.map((group) => (
        <RowGroup key={group} title={t(`exercises.groups.${group}`)}>
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
