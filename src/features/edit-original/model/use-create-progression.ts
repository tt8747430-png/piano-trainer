import { useCallback } from 'react'
import { blankProgression, libraryProgressions } from '@/entities/progression-library'
import type { NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'
import { slug } from '@/shared/lib'

/**
 * An editor's new progression (content as data, ADR 0116): its id the name's slug, numbered past the
 * library's, created on the server unpublished, a pop line to write over its first draft. Resolves to
 * the new id.
 */
export function useCreateProgression() {
  const editing = useContentEditing()
  return useCallback(
    async (name: string): Promise<NetResult<string>> => {
      const taken = libraryProgressions().map((each) => each.id)
      const id = slug(name, [...taken, 'new'], 'progression')
      const progression = blankProgression(id, name.trim())
      const made = await editing.create('progression', id, {
        body: progression,
        meta: { title: progression.name },
      })
      return made.ok ? { ok: true, value: id } : made
    },
    [editing],
  )
}
