import { useCallback } from 'react'
import { entryById, type MadeSong, type SongCollectionId } from '@/entities/piece'
import type { NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'
import { slug } from '@/shared/lib'
import type { Key, Meter } from '@/shared/lib/music'
import { chartStart, type ScoreSetup } from './make-song'

/** What New built-in song asks: its title, key, meter and score, and the collection it ends. */
export interface BuiltInSongDraft {
  readonly title: string
  readonly key: Key
  readonly meter: Meter
  readonly setup?: ScoreSetup
  readonly collection: SongCollectionId
}

/**
 * An editor's new built-in song (content as data, ADR 0116): its id the title's slug (numbered past
 * the catalog's), its chart started as a learner's new song's, created on the server unpublished in
 * its collection, the song itself its first draft. Resolves to the new id.
 */
export function useCreateBuiltInSong() {
  const editing = useContentEditing()
  return useCallback(
    async ({
      title,
      key,
      meter,
      setup,
      collection,
    }: BuiltInSongDraft): Promise<NetResult<string>> => {
      const name = title.trim()
      // Never an own song's id (`my-1`) nor one the catalog has.
      const base = slug(name, [], 'song').replace(/^my-(?=\d+$)/, 'song-my-')
      let id = base
      for (let n = 2; entryById(id); n += 1) id = `${base}-${n}`
      const song: MadeSong = {
        id,
        kind: 'song',
        title: name,
        collection,
        ...chartStart(key, meter, setup),
      }
      const made = await editing.create('piece', id, { body: song, meta: { title: name } })
      return made.ok ? { ok: true, value: id } : made
    },
    [editing],
  )
}
