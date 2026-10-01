import {
  AudioWaveform,
  Blend,
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  KeyboardMusic,
  Layers,
  ListMusic,
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
 * The tile each of Learn's pages wears on every row that leads to it, so a lesson's link, a key's page
 * and Learn's own lists show a page alike.
 */
export const LEARN_TILES = {
  lesson: { icon: BookOpenText, paint: 'grass' },
  chords: { icon: KeyboardMusic, paint: 'sand' },
  scales: { icon: ChartNoAxesColumnIncreasing, paint: 'sky' },
  keys: { icon: CircleDot, paint: 'lilac' },
  intervals: { icon: Ruler, paint: 'yellow' },
  tensions: { icon: Layers, paint: 'grass' },
  patterns: { icon: AudioWaveform, paint: 'yellow' },
  chordFinder: { icon: ScanSearch, paint: 'sky' },
  reharmonise: { icon: Blend, paint: 'lilac' },
  passingChords: { icon: Waypoints, paint: 'yellow' },
  progressions: { icon: ListMusic, paint: 'grass' },
} as const satisfies Readonly<Record<string, Tile>>
