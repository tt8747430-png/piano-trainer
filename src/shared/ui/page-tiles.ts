import {
  AudioWaveform,
  Disc3,
  Gauge,
  BookOpenText,
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
import { ScaleIcon } from './icons/ScaleIcon'
import { PAGE_PICTURES } from './page-pictures'
import type { PagePicture } from './PagePictures'
import type { Paint } from './paint'

/**
 * A row's tile: the icon on it and the paint it is printed in; and where the page has one, its
 * picture, which a library row's head and a card show in the icon's place (the canvas's `pic`).
 */
export interface Tile {
  readonly icon: LucideIcon
  readonly paint: Paint
  readonly picture?: PagePicture
}

/**
 * The tile each page wears on every row that leads to it, so a lesson's link, the Player's Setup,
 * Practice's own lists and Search show a page alike. A view a lesson opens has its own: a key's (the
 * Key view of Scales), a chord's tensions.
 */
export const PAGE_TILES = {
  lesson: { icon: BookOpenText, paint: 'sand' },
  course: { icon: GraduationCap, paint: 'sky' },
  chords: { icon: KeyboardMusic, paint: 'sand', picture: PAGE_PICTURES.keys },
  scales: { icon: ScaleIcon, paint: 'sky', picture: PAGE_PICTURES.staff },
  key: { icon: CircleDot, paint: 'lilac' },
  // Two notes and the leap between them (the board's arc).
  intervals: { icon: Spline, paint: 'grass', picture: PAGE_PICTURES.arc },
  tensions: { icon: Layers, paint: 'grass' },
  patterns: { icon: AudioWaveform, paint: 'lilac', picture: PAGE_PICTURES.roll },
  progressions: { icon: ListMusic, paint: 'yellow', picture: PAGE_PICTURES.roman },
  // The Chord player (R29 CP1): a chord sheet played by a band.
  chordPlayer: { icon: SquarePlay, paint: 'yellow', picture: PAGE_PICTURES.chart },
  chordFinder: { icon: ScanSearch, paint: 'plain', picture: PAGE_PICTURES.lens },
  exercises: { icon: Dumbbell, paint: 'grass', picture: PAGE_PICTURES.drill },
  quiz: { icon: ListChecks, paint: 'lilac' },
  // The Metronome (ADR 0052): a steady beat to practise to.
  metronome: { icon: Metronome, paint: 'plain', picture: PAGE_PICTURES.metro },
  // The tools (R29 B11): the circle and the Tuner.
  circleOfFifths: { icon: Disc3, paint: 'plain', picture: PAGE_PICTURES.circle },
  tuner: { icon: Gauge, paint: 'plain', picture: PAGE_PICTURES.needle },
  // A folder of the library (ADR 0106): songs, in their order.
  folder: { icon: Folder, paint: 'yellow' },
} as const satisfies Readonly<Record<string, Tile>>
