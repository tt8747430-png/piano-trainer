import {
  AudioLines,
  BookOpen,
  CalendarCheck,
  Dumbbell,
  Footprints,
  Hand,
  HandHelping,
  Library,
  ListChecks,
  Lightbulb,
  Music2,
  Timer,
  TrendingDown,
  TrendingUp,
  Waves,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { KeysIcon, type Paint } from '@/shared/ui'
import type { Shelf } from '../model/types'

/** Each course's icon, its card's and its page's; a method book's an open book. */
export const COURSE_ICON: Readonly<Record<string, LucideIcon>> = {
  'introduction-to-the-piano': Footprints,
  'playing-with-both-hands': HandHelping,
  'intro-to-music-reading': Music2,
  'rhythm-basics': Timer,
  'intermediate-piano-playing': Hand,
  'the-sustain-pedal': AudioLines,
  'how-to-practise': CalendarCheck,
  'first-exercises-for-both-hands': Dumbbell,
  'major-scales': TrendingUp,
  'minor-scales': TrendingDown,
  'music-reading-training': Library,
  'major-arpeggios': Waves,
  'minor-arpeggios': Workflow,
  'mastering-chords': KeysIcon,
  'improvising-with-chords': Lightbulb,
  'my-practice-plan': ListChecks,
  'called-to-play': BookOpen,
  'called-to-play-2': BookOpen,
  'seven-types': BookOpen,
  gorshkov: BookOpen,
}

/** A course's icon; the courses' test holds every course to one. */
export const courseIcon = (id: string): LucideIcon => COURSE_ICON[id] ?? BookOpen

/**
 * Each shelf's paint, a course's cover and tile on it (the canvas's COURSECARD: its name printed on
 * its shelf's paint, as a book's cover): one paint a shelf, so a shelf reads as one row of books.
 */
export const SHELF_PAINT: Readonly<Record<Shelf, Paint>> = {
  beginner: 'grass',
  intermediate: 'sky',
  technique: 'sand',
  chords: 'yellow',
  'method-books': 'lilac',
}
