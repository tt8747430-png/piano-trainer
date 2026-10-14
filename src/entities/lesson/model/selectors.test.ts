import { describe, expect, it } from 'vitest'
import { LESSONS } from '../content'
import type { Lesson } from './types'
import { lessonAfterLast, lessonById, lessonsIn, lessonUpNext, nextLesson } from './selectors'

const learnedOn =
  (entries: Readonly<Record<string, string>>) =>
  (lesson: Lesson): string | undefined =>
    entries[lesson.id]

describe('nextLesson', () => {
  it('follows a subject’s lesson with the next, into the next subject at a module’s end', () => {
    expect(nextLesson('finding-home')?.id).toBe('reading-notes')
    expect(nextLesson('key-signatures')?.module).toBe('accompaniment')
    expect(nextLesson(lessonsIn('accompaniment').at(-1)?.id ?? '')?.module).toBe('gospel')
    expect(lessonById('gospel-reharmonisation')).toBeDefined()
    expect(nextLesson('gospel-reharmonisation')).toBeUndefined()
    expect(nextLesson('no-such-lesson')).toBeUndefined()
  })

  it('keeps a course’s lessons to the course: its last leads into no other', () => {
    expect(nextLesson('five-ways')?.module).toBe('called-to-play')
    const lastOfEach = (['called-to-play', 'seven-types', 'gorshkov'] as const).map(
      (course) => lessonsIn(course).at(-1)?.id ?? '',
    )
    for (const last of lastOfEach) expect(nextLesson(last), last).toBeUndefined()
  })
})

describe('lessonsIn', () => {
  it('lists a module’s lessons in the order they are taught', () => {
    expect(lessonsIn('seven-types').map((lesson) => lesson.id)).toEqual([
      'seven-types',
      'accompanying-a-hymn',
    ])
  })
})

describe('lessonAfterLast', () => {
  it('is the first not learned after the one learned last, along its track', () => {
    const learned = learnedOn({
      'finding-home': '2026-10-01',
      'rhythm-and-meter': '2026-10-03',
      'reading-notes': '2026-10-02',
    })
    expect(lessonAfterLast(LESSONS, learned)?.id).toBe('whole-and-half-steps')
  })

  it('is none where none of the lessons is learned', () => {
    expect(
      lessonAfterLast(lessonsIn('gorshkov'), learnedOn({ 'finding-home': '2026-10-01' })),
    ).toBe(undefined)
  })
})

describe('lessonUpNext', () => {
  it('starts at the first lesson, then goes on after the one learned last', () => {
    expect(lessonUpNext(learnedOn({}))?.id).toBe('finding-home')
    expect(lessonUpNext(learnedOn({ 'finding-home': '2026-10-01' }))?.id).toBe('reading-notes')
  })

  it('goes back to the first not learned once a course learned last is over', () => {
    const last = lessonsIn('seven-types').at(-1)?.id ?? ''
    expect(lessonUpNext(learnedOn({ [last]: '2026-10-01' }))?.id).toBe('finding-home')
  })

  it('is none once every lesson is learned', () => {
    const all = Object.fromEntries(LESSONS.map((lesson) => [lesson.id, '2026-10-01']))
    expect(lessonUpNext(learnedOn(all))).toBeUndefined()
  })
})
