import { useCallback } from 'react'
import { type CourseRecord, type Shelf } from '@/entities/course'
import type { Stage } from '@/entities/step'
import type { NetResult } from '@/shared/api/network'
import { useContentEditing } from '@/shared/lib/content-editing'
import { slug } from '@/shared/lib'

/** What an editor says of a new course: its name in English, its shelf, its level and its length. */
export interface NewCourse {
  readonly name: string
  readonly shelf: Shelf
  readonly stage: Stage
  readonly weeks: number
}

/**
 * An editor's new course (ADR 0116): its id the name's slug (numbered past the ids `taken`), created
 * on the server unpublished with no lessons, its record the first draft. Resolves to the new id.
 */
export function useCreateCourse() {
  const editing = useContentEditing()
  return useCallback(
    async (
      { name, shelf, stage, weeks }: NewCourse,
      taken: readonly string[],
    ): Promise<NetResult<string>> => {
      const id = slug(name, taken, 'course')
      const record: CourseRecord = {
        id,
        title: { en: name.trim(), ru: '' },
        summary: { en: '', ru: '' },
        lessons: [],
        shelf,
        stage,
        weeks,
      }
      const made = await editing.create('course', id, {
        body: record,
        meta: { title: record.title },
      })
      return made.ok ? { ok: true, value: id } : made
    },
    [editing],
  )
}
