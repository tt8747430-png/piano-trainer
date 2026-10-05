import {
  AudioWaveform,
  Footprints,
  Hand,
  Repeat,
  Spline,
  Waypoints,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { exercisesIn, type ExerciseGroup } from '@/entities/exercise'
import { RowGroup, type Paint } from '@/shared/ui'
import { ExerciseRow } from './ExerciseRow'

/** Each group's tile: scales sky, chords sand, the masters' ideas lilac, progressions grass, technique yellow. */
const GROUP_TILE = {
  scales: { icon: Spline, paint: 'sky' },
  arpeggios: { icon: AudioWaveform, paint: 'sky' },
  chords: { icon: Footprints, paint: 'sand' },
  barryHarris: { icon: Waypoints, paint: 'lilac' },
  jonny: { icon: Zap, paint: 'lilac' },
  progressions: { icon: Repeat, paint: 'grass' },
  technique: { icon: Hand, paint: 'yellow' },
} as const satisfies Record<ExerciseGroup, { icon: LucideIcon; paint: Paint }>

/** A topic's exercises, a titled group each, every row opening its exercise in the Player. */
export function ExerciseList({ groups }: { groups: readonly ExerciseGroup[] }) {
  const { t } = useTranslation('practice')
  return (
    <>
      {groups.map((group) => (
        <RowGroup key={group} title={t(`groups.${group}`)}>
          {exercisesIn(group).map((exercise) => (
            <li key={exercise.id}>
              <ExerciseRow exercise={exercise} {...GROUP_TILE[group]} />
            </li>
          ))}
        </RowGroup>
      ))}
    </>
  )
}
