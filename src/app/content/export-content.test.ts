import { describe, expect, it } from 'vitest'
import { COURSES } from '@/entities/course'
import { LESSONS } from '@/entities/lesson'
import { PIECES } from '@/entities/piece'
import { exportContent } from './export-content'

describe('exportContent', () => {
  const records = exportContent()

  it('holds every piece, lesson and course lesson once, by kind and id', () => {
    const keys = records.map(({ kind, id }) => `${kind} ${id}`)
    expect(new Set(keys).size).toBe(keys.length)
    const courseLessons = COURSES.flatMap((course) => course.lessons).length
    expect(records.filter((record) => record.kind === 'piece')).toHaveLength(PIECES.length)
    expect(records.filter((record) => record.kind === 'lesson')).toHaveLength(
      LESSONS.length + courseLessons,
    )
    expect(keys).toContain(`lesson ${COURSES[0]?.id}/${COURSES[0]?.lessons[0]?.id}`)
  })

  it('carries each body as JSON that reads back as the same object', () => {
    const piece = PIECES[0]
    const record = records.find(({ kind, id }) => kind === 'piece' && id === piece?.id)
    expect(JSON.parse(JSON.stringify(record?.body))).toEqual(piece)
  })

  it('versions a body by what it holds: the same body, the same version', () => {
    expect(exportContent().map(({ version }) => version)).toEqual(
      records.map(({ version }) => version),
    )
    expect(new Set(records.map(({ version }) => version)).size).toBe(records.length)
  })

  it('names each item in its meta for the catalog', () => {
    const piece = records.find(({ kind }) => kind === 'piece')
    expect(piece?.meta).toMatchObject({ title: expect.any(String) })
  })
})
