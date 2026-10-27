import { useMemo } from 'react'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { usePieceHeadings, type Piece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { sectionLessons } from './section-lessons'

/**
 * A song's sections and their lessons (ADR 0111), read from the piece as the Player plays it, its
 * repeats taken, so each lesson's bars are the bars the Player loops; with each section's heading.
 */
export function useSongLessons(piece: Piece) {
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true }),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  const count = headings.length
  const sections = useMemo(
    () =>
      Array.from({ length: count }, (_, section) => sectionLessons(performance, piece.id, section)),
    [performance, piece.id, count],
  )
  return { performance, headings, sections }
}
