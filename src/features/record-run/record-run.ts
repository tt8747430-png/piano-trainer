import { withRun, type ProgressStore, type RunKey, type RunResult } from '@/entities/progress'

/** Records a trainer's run at a level: one run more against the bests, and the run in the history. */
export function recordRun(store: ProgressStore, key: RunKey, run: RunResult, at: Date): void {
  store.setState((state) => withRun(state, key, run, at))
}
