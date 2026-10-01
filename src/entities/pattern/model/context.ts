import { useMemo } from 'react'
import { createStoreContext } from '@/shared/lib'
import { patternBook, type PatternBook } from './book'
import type { PatternsState } from './store'

const context = createStoreContext<PatternsState>('Patterns')

export const PatternsStoreProvider = context.Provider
export const usePatterns = context.useSelector
export const usePatternsStoreApi = context.useStoreApi

const selectOwn = (state: PatternsState) => state.own

/** The pattern book over the learner's own patterns: a new book only when they change. */
export function usePatternBook(): PatternBook {
  const own = usePatterns(selectOwn)
  return useMemo(() => patternBook(own), [own])
}
