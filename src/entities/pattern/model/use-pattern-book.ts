import { useMemo } from 'react'
import { patternBook, type PatternBook } from './book'
import { usePatterns } from './context'
import type { PatternsState } from './store'

const selectOwn = (state: PatternsState) => state.own

/** The pattern book over the learner's own patterns: a new book only when they change. */
export function usePatternBook(): PatternBook {
  const own = usePatterns(selectOwn)
  return useMemo(() => patternBook(own), [own])
}
