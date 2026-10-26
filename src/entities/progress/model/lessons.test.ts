import { describe, expect, it } from 'vitest'
import { withLesson } from './changes'
import {
  barsLessonKey,
  chordLessonKey,
  isLessonKey,
  keptLessons,
  LESSONS_KEPT,
  type LessonKey,
} from './lessons'
import { lessonsDone, selectLessonDone } from './selectors'
import { EMPTY_PROGRESS } from './types'

const MONDAY = '2026-10-19T10:00:00.000Z'
const FRIDAY = '2026-10-23T10:00:00.000Z'

describe('lesson keys', () => {
  it('name a chord of a piece, and a pass over bars as played, numbered from 1 as a loop prints them', () => {
    expect(chordLessonKey('bz5', 'D/F♯')).toBe('bz5:chord:D/F♯')
    expect(barsLessonKey('bz5', { first: 8, last: 17 })).toBe('bz5:bars:9-18')
    expect(barsLessonKey('my-1', { first: 0, last: 0 })).toBe('my-1:bars:1-1')
  })

  it('read only what the keys write', () => {
    for (const key of ['bz5:chord:C♯m7', 'my-12:chord:D/F♯', 'bz5:bars:9-18', 'bz5:bars:4-4'])
      expect(isLessonKey(key), key).toBe(true)
    for (const key of [
      '',
      'bz5',
      'bz5:chord:',
      ':chord:C',
      'bz5:bars:0-3',
      'bz5:bars:5-4',
      'bz5:bars:3',
      'bz5:loop:1-2',
      `bz5:chord:${'C'.repeat(200)}`,
    ])
      expect(isLessonKey(key), key).toBe(false)
  })
})

describe('withLesson', () => {
  it('keeps the date a lesson was first done', () => {
    const key = barsLessonKey('bz5', { first: 0, last: 7 })
    const done = withLesson(EMPTY_PROGRESS, key, MONDAY)
    expect(done.lessons).toEqual({ 'bz5:bars:1-8': MONDAY })
    expect(withLesson(done, key, FRIDAY)).toBe(done)
  })

  it('keeps the latest lessons, as many as it keeps', () => {
    const many = Object.fromEntries(
      Array.from({ length: LESSONS_KEPT }, (_, i) => [
        `bz5:bars:${i + 1}-${i + 1}`,
        new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString(),
      ]),
    ) as Record<LessonKey, string>
    const next = withLesson({ ...EMPTY_PROGRESS, lessons: many }, 'bz5:chord:C', FRIDAY)
    expect(Object.keys(next.lessons)).toHaveLength(LESSONS_KEPT)
    expect(next.lessons['bz5:chord:C']).toBe(FRIDAY)
    // The oldest gives way.
    expect(next.lessons['bz5:bars:1-1']).toBeUndefined()
    expect(next.lessons['bz5:bars:2-2']).toBeDefined()
  })
})

describe('keptLessons', () => {
  it('leaves lessons as they are under the bound', () => {
    const lessons = { 'bz5:chord:C': MONDAY } as const
    expect(keptLessons(lessons)).toBe(lessons)
  })
})

describe('lessons done', () => {
  const state = { ...EMPTY_PROGRESS, lessons: { 'bz5:chord:G': MONDAY, 'bz5:bars:1-4': FRIDAY } }

  it('says whether a lesson is done', () => {
    expect(selectLessonDone('bz5:chord:G')(state)).toBe(true)
    expect(selectLessonDone('bz5:chord:C')(state)).toBe(false)
  })

  it('counts the lessons done among some, each key once', () => {
    expect(
      lessonsDone(state.lessons, ['bz5:chord:G', 'bz5:chord:C', 'bz5:bars:1-4', 'bz5:chord:G']),
    ).toBe(2)
    expect(lessonsDone(state.lessons, [])).toBe(0)
  })
})
