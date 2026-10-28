import {
  AudioLines,
  BookOpen,
  CalendarCheck,
  Dumbbell,
  Footprints,
  Hand,
  HandHelping,
  Library,
  Lightbulb,
  Music2,
  Piano,
  Timer,
  TrendingDown,
  TrendingUp,
  Waves,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

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
  'mastering-chords': Piano,
  'improvising-with-chords': Lightbulb,
  'called-to-play': BookOpen,
  'called-to-play-2': BookOpen,
  'seven-types': BookOpen,
  gorshkov: BookOpen,
}

/** A course's icon; the courses' test holds every course to one. */
export const courseIcon = (id: string): LucideIcon => COURSE_ICON[id] ?? BookOpen
