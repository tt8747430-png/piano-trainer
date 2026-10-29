import type { ProgressState } from './types'

/** How many practised days are kept: a year's, with room for a leap day. */
export const DAYS_KEPT = 366

const twoDigits = (n: number) => String(n).padStart(2, '0')

/** A day on the learner's own calendar, as the days are kept: `2026-10-11`. */
export const localDay = (date: Date): string =>
  `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`

/** A kept day as a date at noon on the learner's calendar, `count` days after it: clear of any clock change. */
export function dateOfDay(day: string, count = 0): Date {
  const [year = 0, month = 1, date = 1] = day.split('-').map(Number)
  return new Date(year, month - 1, date + count, 12)
}

/** The day `count` days after `day` (before, if negative), by the calendar, whatever the clocks do. */
const dayAfter = (day: string, count: number): string => localDay(dateOfDay(day, count))

const isDay = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)

/** The days as they are kept: those that read as days, each once, oldest first, the latest DAYS_KEPT. */
export const keptDays = (days: readonly unknown[]): readonly string[] =>
  [...new Set(days.filter(isDay))].sort().slice(-DAYS_KEPT)

/** The progress with `day` practised. */
export const withDay = (state: ProgressState, day: string): ProgressState =>
  state.days.includes(day) ? state : { ...state, days: keptDays([...state.days, day]) }

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

/** A day of a month's calendar: its date, whether it was practised, whether it is today. */
export interface CalendarDay {
  readonly day: string
  readonly practised: boolean
  readonly today: boolean
}

/**
 * Today's month as a calendar, a week a row from Monday, each day practised or not; the places before
 * its 1st and after its last day empty (null).
 */
export function monthOf(
  days: readonly string[],
  today: string,
): readonly (readonly (CalendarDay | null)[])[] {
  const practised = new Set(days)
  const first = dateOfDay(today)
  first.setDate(1)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const cells: (CalendarDay | null)[] = Array.from({ length: lead }, () => null)
  for (let date = 1; date <= length; date += 1) {
    const day = localDay(new Date(first.getFullYear(), first.getMonth(), date, 12))
    cells.push({ day, practised: practised.has(day), today: day === today })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7))
}
