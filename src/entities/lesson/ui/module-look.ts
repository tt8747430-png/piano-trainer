import { BookOpen, Church, KeyboardMusic, Layers, Library, type LucideIcon } from 'lucide-react'
import type { Paint } from '@/shared/ui'
import type { LessonModule } from '../model/types'

/**
 * Each module as Learn draws it, its card and its course page alike: the paint its wash and band wear
 * and its icon. The subjects each a paint of their own; the method books one, the book's yellow;
 * Gorshkov's, a course of sheets, sand.
 */
export const MODULE_LOOK: Readonly<Record<LessonModule, { paint: Paint; icon: LucideIcon }>> = {
  fundamentals: { paint: 'sky', icon: KeyboardMusic },
  accompaniment: { paint: 'grass', icon: Layers },
  gospel: { paint: 'lilac', icon: Church },
  'called-to-play': { paint: 'yellow', icon: BookOpen },
  'called-to-play-2': { paint: 'yellow', icon: BookOpen },
  'seven-types': { paint: 'yellow', icon: BookOpen },
  gorshkov: { paint: 'sand', icon: Library },
}
