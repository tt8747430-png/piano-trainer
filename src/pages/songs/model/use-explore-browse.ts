import { useEffect, useState } from 'react'
import type { NetFailure } from '@/shared/api/network'
import type {
  PublicCategory,
  PublicEntry,
  PublicKind,
  PublicSort,
} from '@/shared/api/public-library'
import { useOnline } from '@/shared/lib'
import { usePublicLibrary } from '@/shared/lib/public-library'
import type { ExploreCategory } from './explore-view'

/** Explore's answer: still asked, what it found, or why there is nothing to show. */
export type Browse =
  | { readonly kind: 'loading' }
  | { readonly kind: 'found'; readonly entries: readonly PublicEntry[] }
  | { readonly kind: 'failed'; readonly reason: NetFailure }

/** What one browse of Explore asks for: a chip's songs or patterns, in one order, searched. */
export interface BrowseAsk {
  readonly cat: ExploreCategory
  readonly sort: PublicSort
  readonly q: string
}

/** How long typing rests before Explore is asked: one request a word, not a letter. */
const SETTLE_MS = 300

/** A chip's kind and category: Patterns the patterns, All every song, the rest one category's. */
export function askOf(cat: ExploreCategory): { kind: PublicKind; category?: PublicCategory } {
  if (cat === 'patterns') return { kind: 'pattern' }
  if (cat === 'all') return { kind: 'song' }
  return { kind: 'song', category: cat }
}

/** What a browse found; none while it is asked or where it failed. */
export const entriesOf = (browse: Browse) => (browse.kind === 'found' ? browse.entries : [])

/**
 * Explore's items for what is asked (`ask`), asked again as it changes, once typing rests, when the
 * device comes back online, and on `retry`; what was shown stays until the answer. Nothing to show
 * (`ask` null), nothing is asked.
 */
export function useExploreBrowse(ask: BrowseAsk | null): { browse: Browse; retry: () => void } {
  const library = usePublicLibrary()
  const online = useOnline()
  const [browse, setBrowse] = useState<Browse>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const cat = ask?.cat ?? 'all'
  const sort = ask?.sort ?? 'new'
  const q = ask?.q ?? ''
  const idle = ask === null
  useEffect(() => {
    if (idle) return
    let current = true
    const timer = setTimeout(() => {
      void library.browse({ ...askOf(cat), sort, query: q }).then((result) => {
        if (!current) return
        setBrowse(
          result.ok
            ? { kind: 'found', entries: result.value }
            : { kind: 'failed', reason: result.reason },
        )
      })
    }, SETTLE_MS)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [library, cat, sort, q, online, attempt, idle])
  return { browse, retry: () => setAttempt((n) => n + 1) }
}
