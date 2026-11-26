import { useMemo } from 'react'
import type { BookPattern, PatternBook } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'
import { patternSample, type PatternSample } from './pattern-sample'

/** A pattern's sample, over a bar of C or the first line of `over`, written again only when one changes. */
export function usePatternSample(
  pattern: BookPattern,
  book: PatternBook,
  over?: Piece,
): PatternSample {
  return useMemo(() => patternSample(pattern, book, over), [pattern, book, over])
}
