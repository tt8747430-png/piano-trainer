import { BookOpen, Hand } from 'lucide-react'
import { PAGE_PICTURES, type Paint, type Tile } from '@/shared/ui'
import type { ExerciseGroup, ExerciseShelf } from '../model/types'

/**
 * Each shelf's tile on Practice (the canvas's `pic`): Finger technique a Hanon bar on sage, Jazz
 * vocabulary Barry Harris's 6° on lilac.
 */
export const SHELF_TILES: Readonly<Record<ExerciseShelf, Tile>> = {
  technique: { icon: Hand, paint: 'grass', picture: PAGE_PICTURES.drill },
  jazz: { icon: BookOpen, paint: 'lilac', picture: PAGE_PICTURES.sixdim },
}

/** The paint a source's rows wear their mark in: the drills sage, Barry Harris lilac, Piano With Jonny sky. */
export const GROUP_PAINT: Readonly<Partial<Record<ExerciseGroup, Paint>>> = {
  virtuoso: 'grass',
  fiveFinger: 'grass',
  barryHarris: 'lilac',
  jonny: 'sky',
}
