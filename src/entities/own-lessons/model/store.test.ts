// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { blankLesson } from '@/entities/lesson'
import { createMemoryStorage } from '@/shared/lib'
import {
  coursesWith,
  ownCourseLessons,
  selectOwnCourse,
  selectOwnCourses,
  selectOwnLesson,
  selectOwnLessons,
} from './selectors'
import { createOwnLessonsStore, OWN_LESSONS_STORAGE_KEY, type OwnLessonsState } from './store'
import { isOwnCourseId, isOwnLessonId, ownLook, ownName, OWN_COURSE_LOOK } from './types'

const restored = (state: unknown, version = 1) => {
  const storage = createMemoryStorage()
  storage.setItem(OWN_LESSONS_STORAGE_KEY, JSON.stringify({ state, version }))
  return createOwnLessonsStore({ storage, otherTabs: new EventTarget() }).getState()
}

const INTROS = { ...blankLesson('own-lesson-1', 'Hymn intros in G'), id: 'own-lesson-1' as const }
const ALTO = {
  ...blankLesson('own-lesson-2', 'Reading the alto line'),
  id: 'own-lesson-2' as const,
}
const SUNDAY = {
  id: 'own-course-1' as const,
  title: 'Sunday hymn playing',
  line: 'Intros and the alto line',
  look: { picture: 'church' as const, paint: 'sky' as const },
  lessons: ['own-lesson-1', 'bass-clef', 'own-lesson-2'],
}
const SAVED: OwnLessonsState = {
  lessons: [INTROS, ALTO],
  courses: [SUNDAY],
  nextLesson: 3,
  nextCourse: 2,
}

describe('createOwnLessonsStore', () => {
  it('starts with no lessons and no courses, and saves under pt-own-lessons, version 1', () => {
    const storage = createMemoryStorage()
    const store = createOwnLessonsStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({ lessons: [], courses: [], nextLesson: 1, nextCourse: 1 })
    store.setState(SAVED)
    expect(JSON.parse(storage.getItem('pt-own-lessons') ?? 'null')).toEqual({
      state: SAVED,
      version: 1,
    })
  })

  it('restores what was saved', () => {
    expect(restored(SAVED)).toEqual(SAVED)
  })

  it('reads another version as nothing', () => {
    expect(restored(SAVED, 2).lessons).toEqual([])
  })

  it('keeps only what reads: lessons under own ids, each once; courses with a name', () => {
    const state = restored({
      lessons: [INTROS, INTROS, { ...ALTO, id: 'bass-clef' }, { id: 'own-lesson-9' }, 'nothing'],
      courses: [
        SUNDAY,
        { ...SUNDAY, id: 'own-course-2', title: '   ' },
        { ...SUNDAY, id: 'course-3' },
      ],
      nextLesson: 'x',
    })
    expect(state.lessons).toEqual([INTROS])
    // An own lesson no longer there leaves the course; the app's stays by reference.
    expect(state.courses).toEqual([{ ...SUNDAY, lessons: ['own-lesson-1', 'bass-clef'] }])
    expect(state.nextLesson).toBe(2)
    expect(state.nextCourse).toBe(2)
  })

  it('never gives a number again that one still there carries', () => {
    expect(restored({ ...SAVED, nextLesson: 1, nextCourse: 1 })).toMatchObject({
      nextLesson: 3,
      nextCourse: 2,
    })
  })

  it('keeps a cover it reads, the default for one it does not, a line trimmed', () => {
    const [course] = restored({
      ...SAVED,
      courses: [{ ...SUNDAY, look: { picture: 'kazoo', paint: 'sky' }, line: '  a line  ' }],
    }).courses
    expect(course?.look).toEqual(OWN_COURSE_LOOK)
    expect(course?.line).toBe('a line')
    expect(ownLook({ picture: 'heart', paint: 'lilac' })).toEqual({
      picture: 'heart',
      paint: 'lilac',
    })
  })
})

describe('own ids and names', () => {
  it('reads own ids by their prefix and number', () => {
    expect(isOwnLessonId('own-lesson-3')).toBe(true)
    expect(isOwnLessonId('own-lesson-0')).toBe(false)
    expect(isOwnLessonId('bass-clef')).toBe(false)
    expect(isOwnCourseId('own-course-12')).toBe(true)
    expect(isOwnCourseId('own-lesson-1')).toBe(false)
  })

  it('keeps a name trimmed, 1 to 80 characters', () => {
    expect(ownName('  Hymn intros ')).toBe('Hymn intros')
    expect(ownName('  ')).toBeNull()
    expect(ownName('x'.repeat(81))).toBeNull()
  })
})

describe('selectors', () => {
  it('read the lessons and courses, and one of each by id', () => {
    expect(selectOwnLessons(SAVED)).toEqual([INTROS, ALTO])
    expect(selectOwnLesson('own-lesson-2')(SAVED)).toBe(ALTO)
    expect(selectOwnLesson('own-lesson-5')(SAVED)).toBeUndefined()
    expect(selectOwnCourses(SAVED)).toEqual([SUNDAY])
    expect(selectOwnCourse('own-course-1')(SAVED)).toBe(SUNDAY)
  })

  it('resolve a course’s lessons, its own and the app’s, passing over one not there', () => {
    const lessons = ownCourseLessons(
      { ...SUNDAY, lessons: [...SUNDAY.lessons, 'no-such-lesson'] },
      SAVED.lessons,
    )
    expect(lessons.map(({ lesson, own }) => [lesson.id, own])).toEqual([
      ['own-lesson-1', true],
      ['bass-clef', false],
      ['own-lesson-2', true],
    ])
  })

  it('name the courses that list a lesson', () => {
    expect(coursesWith(SAVED, 'bass-clef')).toEqual(['own-course-1'])
    expect(coursesWith(SAVED, 'own-lesson-9')).toEqual([])
  })
})
