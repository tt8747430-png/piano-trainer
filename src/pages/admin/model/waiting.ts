import type { AdminCounts } from '@/widgets/settings-screen'
import type { Overview } from './overview'

/**
 * What waits in Administration's sections (the Admin board's counts): the open reports, the week's
 * errors, the unpublished drafts; a section with nothing waiting carries none.
 */
export function waitingIn(overview: Overview): AdminCounts {
  return {
    ...(overview.reports > 0 ? { reports: overview.reports } : {}),
    ...(overview.errorsThisWeek > 0 ? { errors: overview.errorsThisWeek } : {}),
    ...(overview.unpublished > 0 ? { drafts: overview.unpublished } : {}),
  }
}
