import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Account, AuthGateway } from '@/shared/api/auth'
import type { SyncRunner } from '../sync'
import { AUTOSYNC_DELAY_MS } from './autosync'
import { Context } from './context'

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
