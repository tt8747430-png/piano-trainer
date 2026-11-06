import { useCallback, useSyncExternalStore } from 'react'
import type { SyncOutcome, SyncStatus } from '../sync'
import { useAccountContext, type AccountContext } from './context'

/** The signed-in learner (none while signed out), whether that is known yet, and the gateway. */
export function useAccount(): Pick<AccountContext, 'account' | 'ready' | 'auth'> {
  const { account, ready, auth } = useAccountContext()
  return { account, ready, auth }
}

/**
 * Learner preview (R29 B5): whether it is on, the account's real role, whether it may turn it on (an
 * editor's or an administrator's), and its switch. For the session only.
 */
export function useLearnerView(): {
  on: boolean
  role: AccountContext['realRole']
  can: boolean
  set: (on: boolean) => void
} {
  const { learnerView, setLearnerView, realRole } = useAccountContext()
  return {
    on: learnerView,
    role: realRole,
    can: realRole === 'editor' || realRole === 'admin',
    set: setLearnerView,
  }
}

/** Where the sync stands, and a sync on demand (Synchronise). */
export function useSync(): { status: SyncStatus; syncNow: () => Promise<SyncOutcome> } {
  const { sync } = useAccountContext()
  const status = useSyncExternalStore(sync.subscribe, sync.status)
  const syncNow = useCallback(() => sync.syncNow(), [sync])
  return { status, syncNow }
}
