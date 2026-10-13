import {
  ArrowDownUp,
  AudioWaveform,
  Blend,
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  Dumbbell,
  KeyboardMusic,
  Layers,
  ListChecks,
  ListMusic,
  Piano,
  Ruler,
  ScanSearch,
  Waypoints,
  type LucideIcon,
} from 'lucide-react'
import type { Paint } from './paint'

/** A row's tile: the icon on it and the paint it is printed in. */
export interface Tile {
  readonly icon: LucideIcon
  readonly paint: Paint
}

/**
 * The tile each page wears on every row that leads to it, so a lesson's link, the Player's Setup,
 * Practice's own lists and Search show a page alike. A view a lesson opens has its own: a key's (the
 * Key view of Scales), a chord's tensions.
 */
export const PAGE_TILES = {
  lesson: { icon: BookOpenText, paint: 'sand' },
  chords: { icon: KeyboardMusic, paint: 'sand' },
  scales: { icon: ChartNoAxesColumnIncreasing, paint: 'sky' },
  key: { icon: CircleDot, paint: 'lilac' },
  intervals: { icon: Ruler, paint: 'yellow' },
  tensions: { icon: Layers, paint: 'grass' },
  patterns: { icon: AudioWaveform, paint: 'yellow' },
  chordFinder: { icon: ScanSearch, paint: 'sky' },
  reharmonise: { icon: Blend, paint: 'lilac' },
  passingChords: { icon: Waypoints, paint: 'yellow' },
  transpose: { icon: ArrowDownUp, paint: 'grass' },
  progressions: { icon: ListMusic, paint: 'grass' },
  freePlay: { icon: Piano, paint: 'sky' },
  exercises: { icon: Dumbbell, paint: 'sand' },
  quiz: { icon: ListChecks, paint: 'lilac' },
} as const satisfies Readonly<Record<string, Tile>>
