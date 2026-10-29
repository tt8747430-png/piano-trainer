import { useCallback, useEffect, useMemo, useState } from 'react'
import type { OwnSongId, SharedSong } from '@/entities/piece'
import type { NetFailed } from '@/shared/api/network'
import type { Published } from '@/shared/api/public-library'
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

/**
 * Publishing a learner's own song to the Public library (ADR 0116): where it stands (asked of the
 * library once signed in), publishing it or its newer version, and taking it out. Signed out, the
 * screen asks to sign in first (`signedIn`). A song that is not the learner's own (`own` null) has
 * nothing to publish.
 */
export function usePublishSong(own: { readonly id: OwnSongId; readonly song: SharedSong } | null) {
  const id = own?.id ?? null
  const song = own?.song ?? null
  const library = usePublicLibrary()
  const { account } = useAccount()
  const online = useOnline()
  const [published, setPublished] = useState<Published | null | undefined>(undefined)
  const [said, setSaid] = useState<PublishSaid>(null)
  const [busy, setBusy] = useState(false)
  // Held as a save holds an own song: its title beside its music, read back by `readSharedSong`.
  const body = useMemo(() => (song ? { title: song.title, ...song.music } : null), [song])
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
    if (!account || !id || !song || !body) return
    setBusy(true)
    const result = await library.publish({
      sourceId: id,
      title: song.title,
      authorName,
      meta: { key: song.music.key, meter: song.music.meter },
      body,
      version,
    })
    setBusy(false)
    if (!result.ok) return setSaid(saidOf(result))
    setSaid(published ? 'updated' : 'published')
    setPublished(result.value)
  }, [account, authorName, library, id, song, body, version, published])

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
