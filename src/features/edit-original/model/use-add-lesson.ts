import { useCallback } from 'react'
import { blankLesson } from '@/entities/lesson'
import type { NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'
import { slug } from '@/shared/lib'

/**
 * An editor's new lesson (ADR 0116): named in English, its id the name's slug (numbered past the ids
 * `taken`), created on the server unpublished with a blank draft: a course's as `<course>/<lesson>`
 * (`course` given), a journey's by its id alone. Resolves to the new lesson's id; its course or
 * journey lists it once its own draft is saved with it.
 */
export function useAddLesson(course?: string) {
  const editing = useContentEditing()
  return useCallback(
    async (name: string, taken: readonly string[]): Promise<NetResult<string>> => {
      const id = slug(name, taken, 'lesson')
      const lesson = blankLesson(id, name.trim())
      const made = await editing.create('lesson', course ? `${course}/${id}` : id, {
        body: lesson,
        meta: { title: lesson.title },
      })
      return made.ok ? { ok: true, value: id } : made
    },
    [editing, course],
  )
}
