import { withoutSteps, type ProgressState, type ProgressStore } from '@/entities/progress'
import type { StepId } from '@/entities/step'

/** What a reset forgot of some steps: when each was learned and which of its sections were read. */
export interface ForgottenSteps {
  readonly learned: ProgressState['learned']
  readonly read: ProgressState['read']
}

/** Forgets a lesson's or a course's progress: these steps not learned, none of their sections read. */
export function resetSteps(store: ProgressStore, ids: readonly StepId[]): ForgottenSteps {
  const state = store.getState()
  const learned: Partial<Record<StepId, string>> = {}
  const read: Partial<Record<StepId, readonly number[]>> = {}
  for (const id of ids) {
    const when = state.learned[id]
    if (when !== undefined) learned[id] = when
    const sections = state.read[id]
    if (sections !== undefined) read[id] = sections
  }
  store.setState(withoutSteps(state, ids))
  return { learned, read }
}

/** Undo: what a reset forgot, back as it was. */
export function restoreSteps(store: ProgressStore, forgotten: ForgottenSteps): void {
  store.setState((state) => ({
    ...state,
    learned: { ...state.learned, ...forgotten.learned },
    read: { ...state.read, ...forgotten.read },
  }))
}
