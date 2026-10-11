import type { ProgressState } from './types'

/** How many practised days are kept: a year's, with room for a leap day. */
export const DAYS_KEPT = 366

const twoDigits = (n: number) => String(n).padStart(2, '0')

/** A day on the learner's own calendar, as the days are kept: `2026-10-11`. */
export const localDay = (date: Date): string =>
  `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`

/** The day `count` days after `day` (before, if negative), by the calendar, whatever the clocks do. */
function dayAfter(day: string, count: number): string {
  const [year = 0, month = 1, date = 1] = day.split('-').map(Number)
  return localDay(new Date(year, month - 1, date + count))
}

/** The progress with `day` practised: each day once, oldest first, the latest DAYS_KEPT. */
export function withDay(state: ProgressState, day: string): ProgressState {
  if (state.days.includes(day)) return state
  return { ...state, days: [...state.days, day].sort().slice(-DAYS_KEPT) }
}

/**
 * The days practised in a row up to `today`, or up to yesterday while today is not yet practised: a
 * streak lasts the day after, for today to keep it.
 */
export function streak(days: readonly string[], today: string): number {
  const practised = new Set(days)
  let day = practised.has(today) ? today : dayAfter(today, -1)
  let count = 0
  while (practised.has(day)) {
    count += 1
    day = dayAfter(day, -1)
  }
  return count
}

/** The seven days up to `today`, oldest first, each practised or not. */
export function lastWeek(
  days: readonly string[],
  today: string,
): { readonly day: string; readonly practised: boolean }[] {
  const practised = new Set(days)
  return Array.from({ length: 7 }, (_, i) => {
    const day = dayAfter(today, i - 6)
    return { day, practised: practised.has(day) }
  })
}
