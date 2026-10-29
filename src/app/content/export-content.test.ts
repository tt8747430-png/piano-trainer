import { describe, expect, it } from 'vitest'
import { COURSES } from '@/entities/course'
import { JOURNEYS, LESSONS } from '@/entities/lesson'
import { PIECES } from '@/entities/piece'
import { exportContent } from './export-content'

describe('exportContent', () => {
  const records = exportContent()

  it('holds every piece, lesson, course lesson and course once, by kind and id', () => {
    const keys = records.map(({ kind, id }) => `${kind} ${id}`)
    expect(new Set(keys).size).toBe(keys.length)
    const courseLessons = COURSES.flatMap((course) => course.lessons).length
    expect(records.filter((record) => record.kind === 'piece')).toHaveLength(PIECES.length)
    expect(records.filter((record) => record.kind === 'lesson')).toHaveLength(
      LESSONS.length + courseLessons,
    )
    expect(keys).toContain(`lesson ${COURSES[0]?.id}/${COURSES[0]?.lessons[0]?.id}`)
    expect(records.filter((record) => record.kind === 'course')).toHaveLength(COURSES.length)
    expect(records.filter((record) => record.kind === 'journey')).toHaveLength(JOURNEYS.length)
  })

  it('holds a course as its record, its lessons by id in order, their bodies apart', () => {
    const course = COURSES[0]
    const record = records.find(({ kind, id }) => kind === 'course' && id === course?.id)
    expect(record?.body).toEqual({
      id: course?.id,
      title: course?.title,
      summary: course?.summary,
      lessons: course?.lessons.map((lesson) => lesson.id),
      shelf: course?.shelf,
      stage: course?.stage,
      weeks: course?.weeks,
    })
    expect(record?.meta).toEqual({ title: course?.title })
  })

  it('holds a journey whole, its chapters and their steps in order', () => {
    const journey = JOURNEYS[0]
    const record = records.find(({ kind, id }) => kind === 'journey' && id === journey?.id)
    expect(record?.body).toEqual(journey)
  })

  it('carries each body as JSON that reads back as the same object', () => {
    const piece = PIECES.find((each) => !('recording' in each && each.recording))
    const record = records.find(({ kind, id }) => kind === 'piece' && id === piece?.id)
    expect(JSON.parse(JSON.stringify(record?.body))).toEqual(piece)
  })

  it('holds a recording without its file’s URL, which each build names anew', () => {
    const recorded = PIECES.find((piece) => 'recording' in piece && piece.recording)
    const record = records.find(({ id }) => id === recorded?.id)
    expect(record?.body).toMatchObject({ recording: { start: expect.any(Number) } })
    expect(JSON.stringify(record?.body)).not.toContain('.m4a')
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
