import {
  AudioLines,
  BookOpen,
  Church,
  Footprints,
  Layers,
  Library,
  Lightbulb,
  ListMusic,
  Music2,
  Palette,
  Piano,
  Sparkles,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { Paint } from '@/shared/ui'
import type { Stage } from '../model/types'

/** Each stage's paint, worn by its courses' cards and pages (DESIGN: one meaning per paint). */
export const STAGE_PAINT: Readonly<Record<Stage, Paint>> = {
  beginner: 'sky',
  intermediate: 'grass',
  advanced: 'lilac',
  professional: 'sand',
}

/** Each course's icon, its card's and its page's; a method book's an open book. */
export const COURSE_ICON: Readonly<Record<string, LucideIcon>> = {
  'first-steps': Footprints,
  'reading-music': Music2,
  'scales-and-keys': Waves,
  'chord-basics': Piano,
  'called-to-play': BookOpen,
  accompaniment: Layers,
  'sixths-and-sevenths': ListMusic,
  'called-to-play-2': BookOpen,
  'seven-types': BookOpen,
  progressions: AudioLines,
  gorshkov: Library,
  gospel: Church,
  modes: Palette,
  'jazz-harmony': Sparkles,
  improvisation: Lightbulb,
}

/** A course's icon; the curriculum's test holds every course to one. */
export const courseIcon = (id: string): LucideIcon => COURSE_ICON[id] ?? BookOpen
export const COURSE_ICON_IDS = Object.keys(COURSE_ICON)
