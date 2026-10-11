import { localDay, withDay, type ProgressStore } from '@/entities/progress'

/** Records that the learner practised today, on their own calendar: once a day, saved once. */
export function recordDay(store: ProgressStore, now: Date): void {
  store.setState((state) => withDay(state, localDay(now)))
}
