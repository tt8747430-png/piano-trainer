import { useEffect, useState } from 'react'
import type { NetFailure } from '@/shared/api/network'
import type { PublicEntry } from '@/shared/api/public-library'
import { useOnline } from '@/shared/lib'
import { usePublicLibrary } from '@/shared/lib/public-library'
import type { PublicView } from './public-view'

/** The Public library's answer: still asked, its songs, or why there are none to show. */
export type Browse =
  | { readonly kind: 'loading' }
  | { readonly kind: 'songs'; readonly songs: readonly PublicEntry[] }
  | { readonly kind: 'failed'; readonly reason: NetFailure }

/** How long typing rests before the library is asked: one request a word, not a letter. */
const SETTLE_MS = 300

/**
 * The Public library's songs for what is shown (`view`), asked again as it changes, once typing
 * rests, when the device comes back online, and on `retry`; what was shown stays until the answer.
 */
export function usePublicBrowse(view: PublicView): { browse: Browse; retry: () => void } {
  const library = usePublicLibrary()
  const online = useOnline()
  const [browse, setBrowse] = useState<Browse>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const { sort, q } = view
  useEffect(() => {
    let current = true
    const timer = setTimeout(() => {
      void library.browse({ sort, query: q }).then((result) => {
        if (!current) return
        setBrowse(
          result.ok
            ? { kind: 'songs', songs: result.value }
            : { kind: 'failed', reason: result.reason },
        )
      })
    }, SETTLE_MS)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [library, sort, q, online, attempt])
  return { browse, retry: () => setAttempt((n) => n + 1) }
}
