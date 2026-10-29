import { useCallback, useEffect, useState } from 'react'
import type { NetFailure, NetResult } from '@/shared/api/network'

export type Loaded<T> =
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly value: T }
  | { readonly kind: 'failed'; readonly reason: NetFailure }

/**
 * What `load` answers, loaded when its inputs change and again on `reload` (after a change, or Try
 * again); what was shown stays until the new answer.
 */
export function useLoaded<T>(load: () => Promise<NetResult<T>>): {
  loaded: Loaded<T>
  reload: () => void
} {
  const [loaded, setLoaded] = useState<Loaded<T>>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let current = true
    void load().then((result) => {
      if (current)
        setLoaded(
          result.ok
            ? { kind: 'ready', value: result.value }
            : { kind: 'failed', reason: result.reason },
        )
    })
    return () => {
      current = false
    }
  }, [load, attempt])
  return { loaded, reload: useCallback(() => setAttempt((n) => n + 1), []) }
}
