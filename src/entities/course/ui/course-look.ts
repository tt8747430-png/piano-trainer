import type { Paint } from '@/shared/ui'
import type { Shelf } from '../model/types'

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
