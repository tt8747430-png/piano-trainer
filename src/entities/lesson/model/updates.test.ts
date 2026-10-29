import { afterEach, describe, expect, it } from 'vitest'
import { keepContent } from '@/shared/api/content'
import { LESSONS } from '../content'
import { JOURNEYS } from '../content/journeys'
import { updatesJourney } from './journey'
import { journeyById, lessonById, lessonPlace } from './selectors'

afterEach(() => keepContent([]))

describe('the lessons over the kept content', () => {
  const lesson = LESSONS[0]
  if (!lesson) throw new Error('there are lessons')
  const kept = (body: unknown) =>
    keepContent([{ kind: 'lesson', id: lesson.id, version: 'v2', body }])

  it('reads the database’s newer copy of a lesson in its place', () => {
    const newer = { ...lesson, summary: { en: 'Revised', ru: 'Исправлено' } }
    kept(newer)
    expect(lessonById(lesson.id)).toEqual(newer)
  })

  it('passes over what does not read as its lesson', () => {
    for (const body of [
      { ...lesson, sections: 'none' },
      { id: lesson.id },
      { ...lesson, id: 'x' },
    ]) {
      kept(body)
      expect(lessonById(lesson.id)).toBe(lesson)
    }
  })
})

describe('a journey over the kept content (content as data)', () => {
  const journey = JOURNEYS[0]
  const [chapter, second] = journey?.chapters ?? []
  if (!journey || !chapter || !second) throw new Error('a journey of two chapters at least')
  const keep = (...items: { kind: 'journey' | 'lesson'; id: string; body: unknown }[]) =>
    keepContent(items.map((item) => ({ ...item, version: 'v2' })))

  it('holds a journey as the database keeps it, whole', () => {
    expect(updatesJourney(journey.id, journey)).toBe(true)
  })

  it('reads the database’s chapters, in their order, with their lessons', () => {
    keep({ kind: 'journey', id: journey.id, body: { ...journey, chapters: [second, chapter] } })
    expect(journeyById(journey.id)?.chapters).toEqual([second, chapter])
    expect(JOURNEYS.find(({ id }) => id === journey.id)).toBe(journey)
  })

  it('places a new lesson the journey lists, read from the database', () => {
    const added = {
      id: 'made-lesson',
      title: { en: 'Made', ru: 'Сделан' },
      summary: { en: 'In the app', ru: 'В приложении' },
      sections: [{ heading: { en: 'Begin', ru: 'Начало' }, blocks: [] }],
    }
    const steps = [...chapter.steps, { kind: 'lesson' as const, lessonId: 'made-lesson' }]
    keep(
      {
        kind: 'journey',
        id: journey.id,
        body: { ...journey, chapters: [{ ...chapter, steps }, ...journey.chapters.slice(1)] },
      },
      { kind: 'lesson', id: 'made-lesson', body: added },
    )
    expect(lessonById('made-lesson')).toEqual(added)
    expect(lessonPlace('made-lesson')).toMatchObject({ journey: { id: journey.id } })
  })

  it('passes over a listed lesson the device has no body of: one not yet published', () => {
    const steps = [...chapter.steps, { kind: 'lesson' as const, lessonId: 'unpublished' }]
    keep({
      kind: 'journey',
      id: journey.id,
      body: { ...journey, chapters: [{ ...chapter, steps }, ...journey.chapters.slice(1)] },
    })
    expect(journeyById(journey.id)?.chapters[0]?.steps).toEqual(chapter.steps)
  })

  it('passes over what does not read as the journey', () => {
    for (const body of [
      { ...journey, id: 'x' },
      { ...journey, stage: 'expert' },
      { ...journey, chapters: [{ ...chapter, steps: [{ kind: 'chords', family: 'no' }] }] },
      { ...journey, chapters: 'none' },
    ]) {
      keep({ kind: 'journey', id: journey.id, body })
      expect(journeyById(journey.id)).toBe(journey)
    }
  })
})
