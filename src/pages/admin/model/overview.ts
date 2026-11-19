import type { AdminAccount, ErrorEntry } from '@/shared/api/admin'
import { groupErrors } from './group-errors'

/**
 * The Admin area's first page (the Admin board's Overview): the week's three figures, each with its
 * comparison, then what needs attention: the open reports, the week's errors, the unpublished drafts.
 */
export interface Overview {
  /** How many accounts, "50+" where the first page is full. */
  readonly accounts: string
  readonly newThisWeek: number
  readonly newLastWeek: number
  readonly activeThisWeek: number
  /** The week's active accounts as a share of all, none where the first page is full. */
  readonly activeShare: number | null
  readonly reports: number
  /** When the oldest open report was made, none with no report open. */
  readonly oldestReportAt: string | null
  readonly errorsThisWeek: number
  /** How many different errors the week's were. */
  readonly errorKinds: number
  readonly unpublished: number
}

const WEEK = 7 * 24 * 60 * 60 * 1000

/** The overview of what the Admin area's calls answered, the week counted back from `now`. */
export function overviewOf(
  {
    accounts,
    errors,
    reports,
    drafts,
  }: {
    accounts: readonly AdminAccount[]
    errors: readonly ErrorEntry[]
    reports: readonly { readonly reportedAt: string }[]
    drafts: readonly { readonly published: boolean }[]
  },
  now: Date,
  page = 50,
): Overview {
  const since = now.getTime() - WEEK
  const inWeek = (at: string | null) => at !== null && Date.parse(at) >= since
  const inWeekBefore = (at: string) => Date.parse(at) >= since - WEEK && Date.parse(at) < since
  const full = accounts.length >= page
  const active = accounts.filter((each) => inWeek(each.lastSignInAt)).length
  const weekErrors = errors.filter((each) => inWeek(each.at))
  return {
    accounts: full ? `${page}+` : String(accounts.length),
    newThisWeek: accounts.filter((each) => inWeek(each.joinedAt)).length,
    newLastWeek: accounts.filter((each) => inWeekBefore(each.joinedAt)).length,
    activeThisWeek: active,
    activeShare:
      full || accounts.length === 0 ? null : Math.round((active / accounts.length) * 100),
    reports: reports.length,
    oldestReportAt: reports.reduce<string | null>(
      (oldest, each) => (oldest === null || each.reportedAt < oldest ? each.reportedAt : oldest),
      null,
    ),
    errorsThisWeek: weekErrors.length,
    errorKinds: groupErrors(weekErrors).length,
    unpublished: drafts.filter((each) => !each.published).length,
  }
}
