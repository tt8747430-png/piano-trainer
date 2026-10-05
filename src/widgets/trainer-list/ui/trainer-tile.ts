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
import type { TrainerId } from '@/features/trainer'
import type { Paint } from '@/shared/ui'

/** Each trainer's tile: what it asks about drawn on it, answered by ear in grass, read in yellow. */
export const TRAINER_TILE: Readonly<Record<TrainerId, { icon: LucideIcon; paint: Paint }>> = {
  'build-chord': { icon: KeyboardMusic, paint: 'sand' },
  'name-chord': { icon: Music2, paint: 'sand' },
  'chord-role': { icon: Music2, paint: 'yellow' },
  'build-scale': { icon: ChartNoAxesColumnIncreasing, paint: 'sky' },
  'key-signatures': { icon: Hash, paint: 'yellow' },
  'key-degrees': { icon: ListOrdered, paint: 'yellow' },
  'intervals-by-ear': { icon: Ear, paint: 'grass' },
  'chords-by-ear': { icon: Waves, paint: 'grass' },
  'scales-by-ear': { icon: Speech, paint: 'grass' },
  'reading-notes': { icon: BookOpenText, paint: 'yellow' },
  gaps: { icon: Target, paint: 'lilac' },
}
