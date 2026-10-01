import { withRun, type ProgressStore, type RunKey, type RunResult } from '@/entities/progress'

/** Records a trainer's run at a level: one run more, its accuracy and streak against the bests. */
export function recordRun(store: ProgressStore, key: RunKey, run: RunResult): void {
  store.setState((state) => withRun(state, key, run))
}
