import { CirclePlay, Layers, type LucideIcon } from 'lucide-react'
import type { LessonLink } from '@/entities/lesson'
import { pieceById } from '@/entities/piece'
import { STEP_PAINT } from '@/entities/step'
import { PAGE_TILES, type Paint } from '@/shared/ui'

/** The tile of the page a lesson's link opens: the page's own, as its row shows it. */
export function linkTile(target: LessonLink): { icon: LucideIcon; paint: Paint } {
  switch (target.opens) {
    case 'chords':
    case 'scales':
    case 'key':
    case 'intervals':
    case 'tensions':
    case 'lesson':
    case 'progressions':
      return PAGE_TILES[target.opens]
    case 'between':
    case 'song-chords':
      return PAGE_TILES.progressions
    case 'harmonise':
      return PAGE_TILES.key
    case 'player':
      return { icon: CirclePlay, paint: PAGE_TILES.progressions.paint }
    case 'exercise':
      return { icon: Layers, paint: 'sky' }
    case 'quiz':
      return PAGE_TILES.quiz
    case 'piece':
      return { icon: CirclePlay, paint: STEP_PAINT[pieceById(target.piece)?.kind ?? 'song'] }
  }
}
