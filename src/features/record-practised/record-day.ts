import { localDay, withDay, type ProgressStore } from '@/entities/progress'

/**
 * Records that the learner practised today, on their own calendar. Once today is kept nothing is
 * written: a save is written on every setState, and this runs on every round answered.
 */
export function recordDay(store: ProgressStore, now: Date): void {
  const day = localDay(now)
  if (store.getState().days.includes(day)) return
  store.setState((state) => withDay(state, day))
}
