import { useCallback } from 'react'
import type { NetResult } from '@/shared/api/network'
import { useAdmin } from '@/shared/lib/admin'
import { useContentEditing } from '@/shared/lib/content-editing'
import { splitReports } from './group-errors'
import { overviewOf, type Overview } from './overview'
import { useLoaded } from '@/shared/lib'

/** The Overview's figures, loaded from the accounts, the errors, the reports and the drafts. */
export function useOverview() {
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
          errors: splitReports(errors.value).errors,
          reports: reports.value,
          drafts: drafts.value,
        },
        new Date(),
      ),
    }
  }, [admin, editing])
  return useLoaded(load)
}
