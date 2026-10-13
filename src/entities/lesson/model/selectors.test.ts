import { describe, expect, it } from 'vitest'
import { lessonById, lessonsIn, nextLesson, previousLesson } from './selectors'

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

describe('previousLesson', () => {
  it('goes back along the same track, none before a track’s first', () => {
    expect(previousLesson('reading-notes')?.id).toBe('finding-home')
    expect(previousLesson('finding-home')).toBeUndefined()
    expect(previousLesson(lessonsIn('accompaniment')[0]?.id ?? '')?.id).toBe('key-signatures')
    expect(previousLesson(lessonsIn('gorshkov')[0]?.id ?? '')).toBeUndefined()
    expect(previousLesson('no-such-lesson')).toBeUndefined()
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
