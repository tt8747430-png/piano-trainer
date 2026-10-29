import { useEffect, useState } from 'react'
import { readsAsMadeSong, type MadeSong } from '@/entities/piece'
import type { NetFailed } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'

/** A song an editor made and has not published, as its draft has it: opening, there, none, or not read. */
export type MadeSongLoad =
  | { readonly state: 'loading' }
  | { readonly state: 'failed'; readonly reason: NetFailed['reason'] }
  | { readonly state: 'none' }
  | { readonly state: 'ready'; readonly song: MadeSong }

/**
 * The song `id` an editor made and has not published (content as data, ADR 0116): the device's
 * catalog has none of it, so it is read from its draft on the server.
 */
export function useMadeSong(id: string): MadeSongLoad {
  const editing = useContentEditing()
  const [load, setLoad] = useState<MadeSongLoad>({ state: 'loading' })
  useEffect(() => {
    let current = true
    void editing.draft('piece', id).then((draft) => {
      if (!current) return
      if (!draft.ok) return setLoad({ state: 'failed', reason: draft.reason })
      const body = draft.value?.body
      setLoad(readsAsMadeSong(id, body) ? { state: 'ready', song: body } : { state: 'none' })
    })
    return () => {
      current = false
    }
  }, [editing, id])
  return load
}
