import { Link } from '@tanstack/react-router'
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Ear,
  Hash,
  KeyboardMusic,
  ListOrdered,
  Music2,
  Speech,
  Target,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectAllAnswers,
  selectPractised,
  selectTrainerRecords,
  useProgress,
} from '@/entities/progress'
import { myGaps, type TrainerId } from '@/features/trainer'
import { RowGroup, RowLink, type Paint } from '@/shared/ui'

interface TrainerRow {
  readonly id: TrainerId
  readonly icon: LucideIcon
  readonly paint: Paint
}

/** Practice's trainers in three groups, each with a tile of its kind: chords sand, scales sky, gaps lilac. */
const GROUPS = [
  {
    title: 'groups.theory',
    trainers: [
      { id: 'build-chord', icon: KeyboardMusic, paint: 'sand' },
      { id: 'name-chord', icon: Music2, paint: 'sand' },
      { id: 'build-scale', icon: ChartNoAxesColumnIncreasing, paint: 'sky' },
      { id: 'gaps', icon: Target, paint: 'lilac' },
    ],
  },
  {
    title: 'groups.ear',
    trainers: [
      { id: 'intervals-by-ear', icon: Ear, paint: 'grass' },
      { id: 'chords-by-ear', icon: Waves, paint: 'grass' },
      { id: 'scales-by-ear', icon: Speech, paint: 'grass' },
    ],
  },
  {
    title: 'groups.reading',
    trainers: [
      { id: 'reading-notes', icon: BookOpenText, paint: 'yellow' },
      { id: 'key-signatures', icon: Hash, paint: 'yellow' },
      { id: 'key-degrees', icon: ListOrdered, paint: 'yellow' },
      { id: 'chord-role', icon: Music2, paint: 'yellow' },
    ],
  },
] as const satisfies readonly { title: string; trainers: readonly TrainerRow[] }[]

/** The runs a trainer has, over all its levels. */
function runsOf(records: ReturnType<typeof selectTrainerRecords>, id: TrainerId): number {
  return Object.entries(records).reduce(
    (sum, [key, record]) => (key.startsWith(`${id}:`) ? sum + (record?.runs ?? 0) : sum),
    0,
  )
}

/** Practice's trainers: each row opens its trainer, saying how many gaps My gaps holds and each one's runs. */
export function TrainerList() {
  const { t } = useTranslation(['practice', 'quiz'])
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  const records = useProgress(selectTrainerRecords)
  const gaps = useMemo(() => myGaps(answers, practised).length, [answers, practised])
  const detail = (id: TrainerId) => {
    if (id === 'gaps') return gaps > 0 ? t('practice:gaps', { count: gaps }) : undefined
    const runs = runsOf(records, id)
    return runs > 0 ? t('quiz:record.runs', { count: runs }) : undefined
  }
  return (
    <>
      {GROUPS.map((group) => (
        <RowGroup key={group.title} title={t(`practice:${group.title}`)}>
          {group.trainers.map(({ id, icon, paint }) => (
            <li key={id}>
              <RowLink
                title={t(`quiz:trainers.${id}`)}
                detail={detail(id)}
                icon={icon}
                paint={paint}
                render={<Link to="/practice/trainers/$trainerId" params={{ trainerId: id }} />}
              />
            </li>
          ))}
        </RowGroup>
      ))}
    </>
  )
}
