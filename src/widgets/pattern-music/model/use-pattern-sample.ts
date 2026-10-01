import { useMemo } from 'react'
import type { BookPattern, PatternBook } from '@/entities/pattern'
import { patternSample, type PatternSample } from './pattern-sample'

/** A pattern's sample, written again only when the pattern or the book changes. */
export function usePatternSample(pattern: BookPattern, book: PatternBook): PatternSample {
  return useMemo(() => patternSample(pattern, book), [pattern, book])
}
