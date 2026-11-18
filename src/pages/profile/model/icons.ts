import { Cable, GraduationCap, Mic, Music, Target, Upload, type LucideIcon } from 'lucide-react'
import type { MilestoneId } from '@/entities/progress'

/** Each milestone's glyph, as its notice wears it in Notifications. */
export const MILESTONE_ICON: Readonly<Record<MilestoneId, LucideIcon>> = {
  'first-song': Music,
  'first-lesson': GraduationCap,
  'first-recording': Mic,
  'first-published': Upload,
  'first-midi': Cable,
  'perfect-take': Target,
}
