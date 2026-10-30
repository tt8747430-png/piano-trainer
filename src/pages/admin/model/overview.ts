import type { AdminAccount, ErrorEntry } from '@/shared/api/admin'

/** The Admin area's first page: the app at a glance this week. */
export interface Overview {
  /** How many accounts, "50+" where the first page is full. */
  readonly accounts: string
  readonly newThisWeek: number
  readonly activeThisWeek: number
  readonly errorsThisWeek: number
  readonly reports: number
  readonly drafts: number
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
    reports: number
    drafts: readonly { readonly published: boolean }[]
  },
  now: Date,
  page = 50,
): Overview {
  const since = now.getTime() - WEEK
  const inWeek = (at: string | null) => at !== null && Date.parse(at) >= since
  return {
    accounts: accounts.length >= page ? `${page}+` : String(accounts.length),
    newThisWeek: accounts.filter((each) => inWeek(each.joinedAt)).length,
    activeThisWeek: accounts.filter((each) => inWeek(each.lastSignInAt)).length,
    errorsThisWeek: errors.filter((each) => inWeek(each.at)).length,
    reports,
    drafts: drafts.length,
    unpublished: drafts.filter((each) => !each.published).length,
  }
}
