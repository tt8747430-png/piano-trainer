import {
  AlertTriangle,
  Flag,
  PencilLine,
  UserPlus,
  Users,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetResult } from '@/shared/api/network'
import { useAdmin } from '@/shared/lib/admin'
import { useContentEditing } from '@/shared/lib/content-editing'
import { overviewOf, type Overview } from '../model/overview'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

const FIGURES = [
  ['accounts', Users],
  ['newThisWeek', UserPlus],
  ['activeThisWeek', UserCheck],
  ['errorsThisWeek', AlertTriangle],
  ['reports', Flag],
  ['unpublished', PencilLine],
] as const satisfies readonly (readonly [keyof Overview, LucideIcon])[]

/**
 * The Admin area's first page: the app this week at a glance, six figures in one card (accounts, the
 * week's new and active ones, its errors, the reports to look at, the drafts not yet published).
 */
export function OverviewTab() {
  const { t } = useTranslation('admin')
  const headingId = useId()
  const admin = useAdmin()
  const editing = useContentEditing()
  const load = useCallback(async (): Promise<NetResult<Overview>> => {
    const [accounts, errors, reports, drafts] = await Promise.all([
      admin.accounts(''),
      admin.errors(),
      admin.reports(),
      editing.drafts(),
    ])
    if (!accounts.ok) return accounts
    if (!errors.ok) return errors
    if (!reports.ok) return reports
    if (!drafts.ok) return drafts
    return {
      ok: true,
      value: overviewOf(
        {
          accounts: accounts.value,
          errors: errors.value,
          reports: reports.value.length,
          drafts: drafts.value,
        },
        new Date(),
      ),
    }
  }, [admin, editing])
  const { loaded, reload } = useLoaded(load)
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(overview) => (
        <section aria-labelledby={headingId} className="flex flex-col gap-2">
          <h2 id={headingId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
            {t('overview.title')}
          </h2>
          <dl className="grid grid-cols-2 gap-y-5 card px-2 py-5 sm:grid-cols-3">
            {FIGURES.map(([field, Icon]) => (
              <div
                key={field}
                className="flex min-w-0 flex-col-reverse items-center gap-0.5 text-center"
              >
                <dt className="text-xs text-pretty text-muted-foreground sm:text-sm">
                  {t(`overview.${field}`)}
                </dt>
                <dd className="font-display text-2xl font-semibold tabular-nums">
                  {overview[field]}
                </dd>
                <Icon aria-hidden className="mb-1 size-5 text-muted-foreground" />
              </div>
            ))}
          </dl>
        </section>
      )}
    </LoadedState>
  )
}
