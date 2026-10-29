import { useCallback, useEffect, useMemo, useState } from 'react'
import type { NetFailed } from '@/shared/api/network'
import type { PublicEntry, PublicKind, Published } from '@/shared/api/public-library'
import { contentHash, useOnline } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { usePublicLibrary } from '@/shared/lib/public-library'

/** What publishing last said, in a line under the song's title. */
export type PublishSaid =
  'published' | 'updated' | 'unpublished' | 'offline' | 'limit' | 'failed' | null

/** Where the song stands in the Public library: not known yet, not in it, in it as it is, or in it older. */
export type PublishState = 'unknown' | 'unpublished' | 'published' | 'changed'

const saidOf = (failed: NetFailed): PublishSaid =>
  failed.reason === 'offline' ? 'offline' : failed.detail?.includes('limit') ? 'limit' : 'failed'

/** A learner's own song or pattern as it is published: its kind, its id among theirs, and its body. */
export interface PublishItem {
  readonly kind: PublicKind
  /** Unique among the author's own: a pattern's prefixed `pattern/`, as a song's and a pattern's ids may match. */
  readonly sourceId: string
  readonly title: string
  readonly meta: PublicEntry['meta']
  /** As a save holds it, read back by the saving side (`readSharedSong`, an own pattern's reader). */
  readonly body: unknown
}

/**
 * Publishing a learner's own song or pattern to the Public library (ADR 0116): where it stands
 * (asked of the library once signed in), publishing it or its newer version, and taking it out.
 * Signed out, the screen asks to sign in first (`signedIn`). Nothing of their own (`item` null) has
 * nothing to publish.
 */
export function usePublish(item: PublishItem | null) {
  const id = item?.sourceId ?? null
  const library = usePublicLibrary()
  const { account } = useAccount()
  const online = useOnline()
  const [published, setPublished] = useState<Published | null | undefined>(undefined)
  const [said, setSaid] = useState<PublishSaid>(null)
  const [busy, setBusy] = useState(false)
  const body = item?.body ?? null
  const version = useMemo(() => (body ? contentHash(JSON.stringify(body)) : ''), [body])
  const accountId = account?.id

  useEffect(() => {
    if (!accountId || !online || !id) return
    let current = true
    void library.mine().then((result) => {
      if (current && result.ok)
        setPublished(result.value.find((each) => each.sourceId === id) ?? null)
    })
    return () => {
      current = false
    }
  }, [library, accountId, online, id])

  const state: PublishState =
    !account || published === undefined
      ? account
        ? 'unknown'
        : 'unpublished'
      : published === null
        ? 'unpublished'
        : published.version === version
          ? 'published'
          : 'changed'

  const authorName = account ? account.name || account.email.split('@')[0] || account.email : ''

  const publish = useCallback(async () => {
    if (!account || !id || !item || !body) return
    setBusy(true)
    const result = await library.publish({
      kind: item.kind,
      sourceId: id,
      title: item.title,
      authorName,
      meta: item.meta,
      body,
      version,
    })
    setBusy(false)
    if (!result.ok) return setSaid(saidOf(result))
    setSaid(published ? 'updated' : 'published')
    setPublished(result.value)
  }, [account, authorName, library, id, item, body, version, published])

  const unpublish = useCallback(async () => {
    if (!id) return
    setBusy(true)
    const result = await library.unpublish(id)
    setBusy(false)
    if (!result.ok) return setSaid(saidOf(result))
    setSaid('unpublished')
    setPublished(null)
  }, [library, id])

  return {
    state,
    said,
    busy,
    signedIn: account !== null,
    authorName: account?.name ?? '',
    publish,
    unpublish,
  }
}
