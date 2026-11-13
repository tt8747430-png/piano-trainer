import {
  AudioWaveform,
  Disc3,
  Gauge,
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  Dumbbell,
  GraduationCap,
  KeyboardMusic,
  Layers,
  ListChecks,
  ListMusic,
  Metronome,
  Folder,
  ScanSearch,
  Spline,
  SquarePlay,
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
  course: { icon: GraduationCap, paint: 'sky' },
  chords: { icon: KeyboardMusic, paint: 'sand' },
  scales: { icon: ChartNoAxesColumnIncreasing, paint: 'sky' },
  key: { icon: CircleDot, paint: 'lilac' },
  // Two notes and the leap between them (the board's arc).
  intervals: { icon: Spline, paint: 'grass' },
  tensions: { icon: Layers, paint: 'grass' },
  patterns: { icon: AudioWaveform, paint: 'lilac' },
  progressions: { icon: ListMusic, paint: 'yellow' },
  // The Chord player (R29 CP1): a chord sheet played by a band.
  chordPlayer: { icon: SquarePlay, paint: 'lilac' },
  chordFinder: { icon: ScanSearch, paint: 'sky' },
  exercises: { icon: Dumbbell, paint: 'sand' },
  quiz: { icon: ListChecks, paint: 'lilac' },
  // The Metronome (ADR 0052): a steady beat to practise to.
  metronome: { icon: Metronome, paint: 'grass' },
  // The tools (R29 B11): the circle and the Tuner.
  circleOfFifths: { icon: Disc3, paint: 'lilac' },
  tuner: { icon: Gauge, paint: 'grass' },
  // A folder of the library (ADR 0106): songs, in their order.
  folder: { icon: Folder, paint: 'yellow' },
} as const satisfies Readonly<Record<string, Tile>>
