import {
  BookOpenCheck,
  CalendarDays,
  Cable,
  Flame,
  Library,
  Mic,
  Music,
  Piano,
  Target,
  Upload,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'
import type { BadgeId, MilestoneId } from '@/entities/progress'

export const BADGE_ICON: Readonly<Record<BadgeId, LucideIcon>> = {
  streak: Flame,
  repertoire: Music,
  lessons: BookOpenCheck,
  scales: Piano,
  devotion: CalendarDays,
  library: Library,
}

export const MILESTONE_ICON: Readonly<Record<MilestoneId, LucideIcon>> = {
  'first-song': Music,
  'first-lesson': GraduationCap,
  'first-recording': Mic,
  'first-published': Upload,
  'first-midi': Cable,
  'perfect-take': Target,
}
