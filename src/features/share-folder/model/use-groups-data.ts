import { useCallback, useEffect, useState } from 'react'
import type { LearnerGroup, SharedFolder } from '@/shared/api/groups'
import type { NetFailure } from '@/shared/api/network'
import { useAccount } from '@/shared/lib/account'
import { useGroups } from '@/shared/lib/groups'

/** Where the learner's groups stand: signed out, being read, read, or unread (and why). */
export type GroupsData =
  | { readonly kind: 'guest' }
  | { readonly kind: 'loading' }
  | { readonly kind: 'failed'; readonly reason: NetFailure }
  | {
      readonly kind: 'ready'
      readonly groups: readonly LearnerGroup[]
      readonly shared: readonly SharedFolder[]
    }

/**
 * The learner's groups and the folders shared with them, read once signed in (R30 S6), and again
 * on `reload` after a change. Signed out, none: groups need an account; while the session is being
 * restored, loading.
 */
export function useGroupsData(): { data: GroupsData; reload: () => void } {
  const port = useGroups()
  const { account, ready } = useAccount()
  const [held, setData] = useState<GroupsData>({ kind: 'loading' })
  const [round, setRound] = useState(0)
  useEffect(() => {
    if (!account) return
    let current = true
    void Promise.all([port.groups(), port.shared()]).then(([groups, shared]) => {
      if (!current) return
      if (!groups.ok) setData({ kind: 'failed', reason: groups.reason })
      else if (!shared.ok) setData({ kind: 'failed', reason: shared.reason })
      else setData({ kind: 'ready', groups: groups.value, shared: shared.value })
    })
    return () => {
      current = false
    }
  }, [port, account, round])
  const reload = useCallback(() => setRound((was) => was + 1), [])
  // Until the session is restored nobody is known: loading, never a Sign in flashed at a member.
  return { data: !ready ? { kind: 'loading' } : account ? held : { kind: 'guest' }, reload }
}
