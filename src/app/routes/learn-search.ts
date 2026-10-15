import type { LearnView } from '@/widgets/curriculum'
import { readText, valueOr } from '@/shared/lib'
import { routeSearch, type Raw } from './read-search'

// Learn's view (ADR 0053): what its header's toggle shows, and the journey on the Lessons.
const isShown = (value: unknown): value is LearnView['view'] =>
  value === 'lessons' || value === 'courses'

export const LEARN_DEFAULTS: LearnView = { view: 'lessons', journey: '' }
export function readLearnSearch(raw: Raw): LearnView {
  return {
    view: valueOr(isShown, raw.view, LEARN_DEFAULTS.view),
    journey: readText(raw.journey, LEARN_DEFAULTS.journey),
  }
}
export const learnSearch = routeSearch(readLearnSearch, LEARN_DEFAULTS)
export const LEARN_KEPT = ['view', 'journey'] as const satisfies readonly (keyof LearnView)[]
