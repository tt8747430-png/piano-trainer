import { useCallback, useSyncExternalStore } from 'react'
import type { SyncOutcome, SyncStatus } from '../sync'
import { useAccountContext, type AccountContext } from './context'

/** The signed-in learner (none while signed out), whether that is known yet, and the gateway. */
export function useAccount(): Pick<AccountContext, 'account' | 'ready' | 'auth'> {
  const { account, ready, auth } = useAccountContext()
  return { account, ready, auth }
}

/**
 * Learner view (R29 B5): whether it is on, whether this account may turn it on (an editor's or an
 * admin's), and its switch. For the session only.
 */
export function useLearnerView(): { on: boolean; can: boolean; set: (on: boolean) => void } {
  const { learnerView, setLearnerView, realRole } = useAccountContext()
  return {
    on: learnerView,
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
