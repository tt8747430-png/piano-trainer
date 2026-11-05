// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createOwnLessonsStore } from '@/entities/own-lessons'
import { createMemoryStorage } from '@/shared/lib'
import {
  addToCourse,
  createOwnCourse,
  createOwnLesson,
  deleteOwnCourse,
  deleteOwnLesson,
  duplicateOwnCourse,
  duplicateOwnLesson,
  orderCourseLessons,
  renameOwnCourse,
  renameOwnLesson,
  saveOwnCourse,
  saveOwnLesson,
} from './index'

const store = () =>
  createOwnLessonsStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const titles = (own: ReturnType<typeof store>) =>
  own.getState().lessons.map((lesson) => [lesson.id, lesson.title.en, lesson.title.ru])

describe('own lessons', () => {
  it('makes a blank lesson under the next number, named in both languages', () => {
    const own = store()
    expect(createOwnLesson(own, '  Hymn intros ')).toBe('own-lesson-1')
    expect(createOwnLesson(own, 'Alto line')).toBe('own-lesson-2')
    expect(titles(own)).toEqual([
      ['own-lesson-1', 'Hymn intros', 'Hymn intros'],
      ['own-lesson-2', 'Alto line', 'Alto line'],
    ])
    expect(own.getState().lessons[0]?.sections).toHaveLength(1)
    expect(createOwnLesson(own, '   ')).toBeNull()
    expect(own.getState().nextLesson).toBe(3)
  })

  it('saves a lesson in its place, and not one deleted meanwhile', () => {
    const own = store()
    createOwnLesson(own, 'Intros')
    const [lesson] = own.getState().lessons
    if (!lesson) throw new Error('made')
    const written = { ...lesson, summary: { en: 'Four bars', ru: 'Four bars' } }
    expect(saveOwnLesson(own, written)).toBe(true)
    expect(own.getState().lessons).toEqual([written])
    expect(saveOwnLesson(own, { ...written, id: 'own-lesson-4' })).toBe(false)
  })

  it('renames, duplicates after the lesson, and deletes it from every course too', () => {
    const own = store()
    createOwnLesson(own, 'Intros')
    createOwnLesson(own, 'Alto')
    expect(renameOwnLesson(own, 'own-lesson-1', 'Hymn intros')).toBe(true)
    expect(renameOwnLesson(own, 'own-lesson-1', '')).toBe(false)
    expect(duplicateOwnLesson(own, 'own-lesson-1', 'Hymn intros copy')).toBe('own-lesson-3')
    expect(titles(own).map(([id]) => id)).toEqual(['own-lesson-1', 'own-lesson-3', 'own-lesson-2'])
    const course = createOwnCourse(own, 'Sunday')
    if (!course) throw new Error('made')
    addToCourse(own, course, 'own-lesson-1')
    addToCourse(own, course, 'bass-clef')
    deleteOwnLesson(own, 'own-lesson-1')
    expect(titles(own).map(([id]) => id)).toEqual(['own-lesson-3', 'own-lesson-2'])
    expect(own.getState().courses[0]?.lessons).toEqual(['bass-clef'])
  })
})

describe('own courses', () => {
  it('makes an empty course on the default cover, under the next number', () => {
    const own = store()
    expect(createOwnCourse(own, ' Sunday hymn playing ')).toBe('own-course-1')
    expect(own.getState().courses).toEqual([
      {
        id: 'own-course-1',
        title: 'Sunday hymn playing',
        line: '',
        look: { picture: 'book', paint: 'sky' },
        lessons: [],
      },
    ])
    expect(createOwnCourse(own, '')).toBeNull()
  })

  it('adds a lesson once, the app’s by reference, and orders them', () => {
    const own = store()
    const course = createOwnCourse(own, 'Sunday')
    const lesson = createOwnLesson(own, 'Intros')
    if (!course || !lesson) throw new Error('made')
    expect(addToCourse(own, course, 'bass-clef')).toBe(true)
    expect(addToCourse(own, course, lesson)).toBe(true)
    expect(addToCourse(own, course, 'bass-clef')).toBe(false)
    expect(orderCourseLessons(own, course, [lesson, 'bass-clef'])).toBe(true)
    expect(own.getState().courses[0]?.lessons).toEqual([lesson, 'bass-clef'])
  })

  it('saves what was edited, keeping its title where the new one is empty and its own lessons that are there', () => {
    const own = store()
    const course = createOwnCourse(own, 'Sunday')
    if (!course) throw new Error('made')
    const [made] = own.getState().courses
    if (!made) throw new Error('made')
    expect(
      saveOwnCourse(own, {
        ...made,
        title: ' ',
        line: 'Intros and the alto line',
        look: { picture: 'church', paint: 'grass' },
        lessons: ['own-lesson-9', 'bass-clef', 'bass-clef'],
      }),
    ).toBe(true)
    expect(own.getState().courses[0]).toEqual({
      ...made,
      line: 'Intros and the alto line',
      look: { picture: 'church', paint: 'grass' },
      lessons: ['bass-clef'],
    })
  })

  it('renames, duplicates after it, and deletes, keeping its lessons', () => {
    const own = store()
    createOwnCourse(own, 'Sunday')
    createOwnCourse(own, 'Reading')
    createOwnLesson(own, 'Intros')
    expect(renameOwnCourse(own, 'own-course-1', 'Sunday hymns')).toBe(true)
    expect(duplicateOwnCourse(own, 'own-course-1', 'Sunday hymns copy')).toBe('own-course-3')
    expect(own.getState().courses.map((course) => [course.id, course.title])).toEqual([
      ['own-course-1', 'Sunday hymns'],
      ['own-course-3', 'Sunday hymns copy'],
      ['own-course-2', 'Reading'],
    ])
    deleteOwnCourse(own, 'own-course-1')
    expect(own.getState().courses.map((course) => course.id)).toEqual([
      'own-course-3',
      'own-course-2',
    ])
    expect(own.getState().lessons).toHaveLength(1)
  })
})
