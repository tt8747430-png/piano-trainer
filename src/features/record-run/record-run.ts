import {
  withPlayedRun,
  withRun,
  type PlayedResult,
  type ProgressStore,
  type RunKey,
  type RunResult,
} from '@/entities/progress'

/** Records a trainer's run at a level: one run more against the bests, and the run in the history. */
export function recordRun(store: ProgressStore, key: RunKey, run: RunResult, at: Date): void {
  store.setState((state) => withRun(state, key, run, at))
}

/** Records a run played to its end in Wait mode: one attempt more at its key, and the run in the history. */
export function recordPlayedRun(
  store: ProgressStore,
  key: RunKey,
  run: PlayedResult,
  at: Date,
): void {
  store.setState((state) => withPlayedRun(state, key, run, at))
}
