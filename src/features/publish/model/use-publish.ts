import { useCallback, useEffect, useMemo, useState } from 'react'
import type { NetFailed } from '@/shared/api/network'
import {
  DESCRIPTION_MAX,
  type PublicEntry,
  type PublicKind,
  type Published,
} from '@/shared/api/public-library'
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

/** The fewest characters a description says: enough to tell others what it is (Noji's minimum). */
export const DESCRIPTION_MIN = 20

/** A description as it is kept: trimmed, at most `DESCRIPTION_MAX` long. */
export const descriptionOf = (text: string) => text.trim().slice(0, DESCRIPTION_MAX)

/** Whether a description says enough to publish. */
export const describes = (text: string) => descriptionOf(text).length >= DESCRIPTION_MIN

/** What the library holds of the learner's published item: its public id, description and saves. */
interface Shown {
  readonly id: string
  readonly description: string
  readonly saves: number
}

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
 * (asked of the library once signed in) and, once in it, its public id, description and saves;
 * publishing it with its description, or its newer version, and taking it out.
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
  const [details, setDetails] = useState<Shown | null>(null)
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

  // Its description and saves, as the library holds them, once it is in it.
  const publicId = published?.id ?? null
  useEffect(() => {
    if (!publicId || !online) return
    let current = true
    void library.item(publicId).then((result) => {
      if (current && result.ok && result.value)
        setDetails({
          id: publicId,
          description: result.value.entry.meta.description ?? '',
          saves: result.value.entry.saves,
        })
    })
    return () => {
      current = false
    }
  }, [library, publicId, online])
  const shown = details && details.id === publicId ? details : null

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

  /** Publishes it, or its newer version, under `description` (else the one it has). */
  const publish = useCallback(
    async (description?: string) => {
      if (!account || !id || !item || !body) return
      const said = descriptionOf(description ?? shown?.description ?? '')
      setBusy(true)
      const result = await library.publish({
        kind: item.kind,
        sourceId: id,
        title: item.title,
        authorName,
        meta: { ...item.meta, ...(said ? { description: said } : {}) },
        body,
        version,
      })
      setBusy(false)
      if (!result.ok) return setSaid(saidOf(result))
      setSaid(published ? 'updated' : 'published')
      setPublished(result.value)
      setDetails({ id: result.value.id, description: said, saves: shown?.saves ?? 0 })
    },
    [account, authorName, library, id, item, body, version, published, shown],
  )

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
    authorName,
    /** Its id in the Public library, once it is in it: where View in the library goes. */
    publicId,
    description: shown?.description ?? '',
    saves: shown?.saves ?? 0,
    publish,
    unpublish,
  }
}
