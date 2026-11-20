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

/** Every so many days practised in a row earn a rest day (ruled 2026-11-07; Scale Runner's weekly freeze). */
const REST_EVERY = 7
/** How many rest days are kept for later at most. */
export const RESTS_KEPT = 2

/** The streak up to today: its days practised, the longest ever, the rest days kept for later, the days rested in it. */
export interface Streak {
  readonly count: number
  readonly best: number
  readonly rests: number
  readonly rested: readonly string[]
}

/**
 * The streak up to `today`: the days practised in a row, where a missed day is bridged by a rest
 * day earned by every REST_EVERY days practised (RESTS_KEPT at most), and today, not yet practised,
 * still keeps it for today to extend.
 */
export function streakOf(days: readonly string[], today: string): Streak {
  const practised = new Set(days)
  const first = keptDays(days)[0]
  let count = 0
  let best = 0
  let earned = 0
  let rests = 0
  let rested: string[] = []
  for (let day = first; day !== undefined && day <= today; day = dayAfter(day, 1)) {
    if (practised.has(day)) {
      count += 1
      best = Math.max(best, count)
      earned += 1
      if (earned % REST_EVERY === 0) rests = Math.min(RESTS_KEPT, rests + 1)
    } else if (day === today) {
      break
    } else if (rests > 0) {
      rests -= 1
      rested = [...rested, day]
    } else {
      count = 0
      earned = 0
      rested = []
    }
  }
  return { count, best, rests, rested }
}

/** The days practised in a row up to `today`, missed days bridged by rest days (`streakOf`). */
export const streak = (days: readonly string[], today: string): number =>
  streakOf(days, today).count

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

/** A day of a month's calendar: its date, whether it was practised or rested in the streak, whether it is today. */
export interface CalendarDay {
  readonly day: string
  readonly practised: boolean
  readonly rested: boolean
  readonly today: boolean
}

/**
 * Today's month as a calendar, a week a row from Monday, each day practised or not; the places before
 * its 1st and after its last day empty (null).
 */
export function monthOf(
  days: readonly string[],
  today: string,
  /** How many months before today's (negative) or after; today's own by default. */
  shift = 0,
): readonly (readonly (CalendarDay | null)[])[] {
  const practised = new Set(days)
  const rested = new Set(streakOf(days, today).rested)
  const first = dateOfDay(today)
  first.setDate(1)
  first.setMonth(first.getMonth() + shift)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const cells: (CalendarDay | null)[] = Array.from({ length: lead }, () => null)
  for (let date = 1; date <= length; date += 1) {
    const day = localDay(new Date(first.getFullYear(), first.getMonth(), date, 12))
    cells.push({
      day,
      practised: practised.has(day),
      rested: rested.has(day),
      today: day === today,
    })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7))
}
