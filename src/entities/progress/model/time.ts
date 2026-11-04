import type { FirstId, ProgressState } from './types'

/** The most silence a stretch of practice counts: a pause past it is a break, not practice. */
export const SILENCE_COUNTED_S = 30

/** A day's seconds at most: the clock never counts past a day. */
const DAY_S = 86_400

/** The progress with `seconds` more played on `day` (whole seconds, a day's at most). */
export function withPracticeTime(
  state: ProgressState,
  seconds: number,
  day: string,
): ProgressState {
  const added = Math.floor(seconds)
  if (added <= 0) return state
  const total = Math.min(DAY_S, (state.seconds[day] ?? 0) + added)
  return { ...state, seconds: { ...state.seconds, [day]: total } }
}

/** Every second practised, over the days kept. */
export const practiceSeconds = (state: ProgressState): number =>
  Object.values(state.seconds).reduce<number>((sum, each) => sum + (each ?? 0), 0)

/** The progress with `key` practised (Scale Master), on the day it first was. */
export const withKeyPractised = (state: ProgressState, key: string, day: string): ProgressState =>
  state.keys[key] ? state : { ...state, keys: { ...state.keys, [key]: day } }

/** The progress with a first (a song published, a minute on a connected piano) kept on its day, once. */
export const withFirst = (state: ProgressState, first: FirstId, day: string): ProgressState =>
  state.firsts[first] ? state : { ...state, firsts: { ...state.firsts, [first]: day } }
