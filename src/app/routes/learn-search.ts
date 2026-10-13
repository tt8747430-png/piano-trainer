import { isLearnTab, isLessonModule, LESSON_MODULES } from '@/entities/lesson'
import type { LearnView } from '@/pages/learn'
import { routeSearch, type Raw } from './read-search'

// Learn (ADR 0042): its tab, and the modules open in it, kept in Learn's order; none named is the
// module the learner is at, an empty list none.
export const LEARN_DEFAULTS: LearnView = { tab: 'subjects', open: undefined }

/** The modules the URL names, in Learn's order, an unknown one left out. */
function readOpen(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined
  const named = new Set(raw.split('.').filter(isLessonModule))
  return LESSON_MODULES.filter((module) => named.has(module)).join('.')
}

export const readLearnSearch = (raw: Raw): LearnView => ({
  tab: isLearnTab(raw.tab) ? raw.tab : LEARN_DEFAULTS.tab,
  open: readOpen(raw.open),
})
export const learnSearch = routeSearch(readLearnSearch, LEARN_DEFAULTS)
