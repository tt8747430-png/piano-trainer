import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { Account, AuthGateway } from '@/shared/api/auth'
import type { SyncOutcome, SyncRunner, SyncStatus } from '../sync'

/** How long the saving must settle before Autosync carries it (memory-palaces' 4 s). */
export const AUTOSYNC_DELAY_MS = 4000

interface AccountContext {
  readonly auth: AuthGateway
  readonly sync: SyncRunner
  readonly account: Account | null
  /** Whether the device has been asked who is signed in. */
  readonly ready: boolean
}

const Context = createContext<AccountContext | null>(null)

function useAccountContext(): AccountContext {
  const context = use(Context)
  if (!context) throw new Error('useAccount needs an AccountProvider')
  return context
}

/**
 * The learner's account and the sync of their stores (ADR 0116). An account is optional: signed out,
 * the app does everything and nothing leaves the device. Signed in, Autosync runs a sync at once,
 * when the connection comes back, when the app comes back into view, and once the saving of a
 * store has settled for a few seconds.
 */
export function AccountProvider({
  auth,
  sync,
  children,
}: {
  auth: AuthGateway
  sync: SyncRunner
  children: ReactNode
}) {
  const [account, setAccount] = useState<Account | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // A change heard wins over the first read, which may answer after a sign-in it predates.
    let settled = false
    void auth.current().then((found) => {
      if (settled) return
      settled = true
      setAccount(found)
      setReady(true)
    })
    const stop = auth.onChange((changed) => {
      settled = true
      setAccount(changed)
      setReady(true)
    })
    return () => {
      settled = true
      stop()
    }
  }, [auth])

  const signedIn = account !== null
  useEffect(() => {
    if (!signedIn) return
    const run = () => void sync.syncNow()
    run()
    let settle: ReturnType<typeof setTimeout> | undefined
    const stopChanges = sync.onChange(() => {
      clearTimeout(settle)
      settle = setTimeout(run, AUTOSYNC_DELAY_MS)
    })
    const onVisible = () => {
      if (document.visibilityState === 'visible') run()
    }
    window.addEventListener('online', run)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(settle)
      stopChanges()
      window.removeEventListener('online', run)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [signedIn, sync])

  const value = useMemo(() => ({ auth, sync, account, ready }), [auth, sync, account, ready])
  return <Context value={value}>{children}</Context>
}

/** The signed-in learner (none while signed out), whether that is known yet, and the gateway. */
export function useAccount(): Pick<AccountContext, 'account' | 'ready' | 'auth'> {
  const { account, ready, auth } = useAccountContext()
  return { account, ready, auth }
}

/** Where the sync stands, and a sync on demand (Synchronise). */
export function useSync(): { status: SyncStatus; syncNow: () => Promise<SyncOutcome> } {
  const { sync } = useAccountContext()
  const status = useSyncExternalStore(sync.subscribe, sync.status)
  const syncNow = useCallback(() => sync.syncNow(), [sync])
  return { status, syncNow }
}
