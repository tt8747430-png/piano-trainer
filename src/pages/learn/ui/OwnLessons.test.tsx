import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Editor } from '@tiptap/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { blankLesson, lessonById } from '@/entities/lesson'
import { OWN_LESSONS_STORAGE_KEY, type OwnLessonsState } from '@/entities/own-lessons'
import { createMemoryStorage, OPEN_SETTINGS, REST_MS } from '@/shared/lib'
import { stubTextLayout } from '@/shared/test/layout'

const INTROS = {
  ...blankLesson('own-lesson-1'),
  id: 'own-lesson-1' as const,
  title: { en: 'Hymn intros in G', ru: 'Hymn intros in G' },
  summary: { en: 'Four bars before the verse', ru: 'Four bars before the verse' },
  sections: [
    {
      heading: { en: 'The last line', ru: 'The last line' },
      blocks: [{ kind: 'text' as const, text: { en: 'Play it first.', ru: 'Play it first.' } }],
    },
  ],
}
const SUNDAY = {
  id: 'own-course-1' as const,
  title: 'Sunday hymn playing',
  line: 'Intros and the bass clef',
  look: { picture: 'church' as const, paint: 'sky' as const },
  lessons: ['own-lesson-1', 'bass-clef'],
}
const SAVED: OwnLessonsState = {
  lessons: [INTROS],
  courses: [SUNDAY],
  nextLesson: 2,
  nextCourse: 2,
}

/** A device with the learner's own lessons and course on it. */
function withOwn(state: OwnLessonsState = SAVED) {
  const storage = createMemoryStorage()
  storage.setItem(OWN_LESSONS_STORAGE_KEY, JSON.stringify({ state, version: 1 }))
  return storage
}

/** The screen bar's Settings (the gear), not the sidebar's: its window over the page. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('heading', { level: 1 })
  const bar = document.querySelector<HTMLElement>('[data-slot="screen-bar"]')!
  await user.click(within(bar).getByRole('button', { name: 'Settings' }))
  return screen.findByRole('dialog', { name: 'Settings' })
}

/** New's floating +, opened, and one of the things it makes chosen. */
async function makeNew(user: ReturnType<typeof userEvent.setup>, what: string) {
  await user.click(await screen.findByRole('button', { name: 'New' }))
  await user.click(await screen.findByRole('button', { name: what }))
}

describe('Your lessons (R30-5)', () => {
  beforeEach(stubTextLayout)

  it('is made from Learn’s New, written in place, and read under Made by you', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/')
    // Nothing of the learner's own yet: no Made by you on Learn.
    await screen.findByRole('region', { name: 'Levels' })
    expect(screen.queryByRole('region', { name: 'Made by you' })).not.toBeInTheDocument()
    await makeNew(user, 'New lesson')
    const sheet = await screen.findByRole('dialog', { name: 'New lesson' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Hymn intros')
    await user.click(within(sheet).getByRole('button', { name: 'Create lesson' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/own-lesson-1/edit'))
    expect(ownLessonsStore.getState().lessons.map((lesson) => lesson.title)).toEqual([
      { en: 'Hymn intros', ru: 'Hymn intros' },
    ])
    // The same document as the app's lessons, with no draft and no Publish: Done reads it.
    const doc = await screen.findByRole('textbox', { name: 'The lesson' })
    expect(doc.querySelector('p[data-lesson-title]')).toHaveTextContent('Hymn intros')
    expect(screen.queryByRole('button', { name: /Publish/ })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/own-lesson-1'))
    const place = await screen.findByRole('navigation', { name: 'Where this lesson is' })
    expect(within(place).getByRole('link', { name: 'Made by you' })).toHaveAttribute(
      'href',
      '/your-lessons',
    )
  })

  it('says so on its page while the learner has made nothing', async () => {
    await renderApp('/your-lessons')
    expect(await screen.findByText('No lessons or courses yet')).toBeInTheDocument()
  })

  it('lists the learner’s own on Learn and on their page, learned once they are', async () => {
    const { progressStore, unmount } = await renderApp('/', { storage: withOwn() })
    const own = await screen.findByRole('region', { name: 'Made by you' })
    expect(within(own).getByRole('link', { name: /^Hymn intros in G/ })).toHaveAttribute(
      'href',
      '/lessons/own-lesson-1',
    )
    const course = within(own).getByRole('link', { name: /^Sunday hymn playing/ })
    expect(course).toHaveTextContent('Course · 2 lessons')
    act(() =>
      progressStore.setState({ learned: { 'lesson:own-lesson-1': '2026-11-05T10:00:00.000Z' } }),
    )
    expect(course).toHaveTextContent('Course · 2 lessons · 1 learned')
    unmount()
    // Their page: a course's lessons under its fold.
    const user = userEvent.setup()
    await renderApp('/your-lessons', { storage: withOwn() })
    await user.click(await screen.findByRole('button', { name: 'Show its lessons' }))
    expect(await screen.findByRole('link', { name: /^Hymn intros in G/ })).toHaveAttribute(
      'href',
      '/lessons/own-lesson-1',
    )
  })

  it('reads as any lesson, its Edit the learner’s own, and keeps what is written', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/lessons/own-lesson-1', {
      storage: withOwn(),
    })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Hymn intros in G' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'The last line' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/own-lesson-1/edit'))
    const doc = await screen.findByRole('textbox', { name: 'The lesson' })
    const editor = (doc as HTMLElement & { editor: Editor }).editor
    act(() => {
      editor.commands.setTextSelection(editor.state.doc.content.size - 1)
      editor.commands.insertContent(' Then the verse.')
    })
    await user.click(screen.getByRole('button', { name: 'Done' }))
    const [kept] = ownLessonsStore.getState().lessons
    const text = JSON.stringify(kept?.sections)
    // Written once, read alike in both languages.
    expect(text.match(/Then the verse\./g)).toHaveLength(2)
  })

  it('renames, duplicates and deletes on its Settings, its progress going with it', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore, progressStore } = await renderApp('/lessons/own-lesson-1', {
      storage: withOwn(),
    })
    act(() =>
      progressStore.setState({ learned: { 'lesson:own-lesson-1': '2026-11-05T10:00:00.000Z' } }),
    )
    const window = await openSettings(user)
    // It lives on the learner's devices: no Share link.
    expect(within(window).queryByRole('button', { name: 'Share link' })).toBeNull()
    await user.click(within(window).getByRole('button', { name: /^Name/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Rename lesson' })
    const name = within(sheet).getByRole('textbox', { name: 'Name' })
    await user.clear(name)
    await user.type(name, 'Intros in G')
    await user.click(within(sheet).getByRole('button', { name: 'Rename' }))
    expect(ownLessonsStore.getState().lessons[0]?.title).toEqual({
      en: 'Intros in G',
      ru: 'Intros in G',
    })
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Settings' })).getByRole('button', {
        name: 'Duplicate',
      }),
    )
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/own-lesson-2'))
    expect(ownLessonsStore.getState().lessons.map((lesson) => lesson.id)).toEqual([
      'own-lesson-1',
      'own-lesson-2',
    ])
    await act(() =>
      router.navigate({
        to: '/lessons/$lessonId',
        params: { lessonId: 'own-lesson-1' },
        state: OPEN_SETTINGS,
      }),
    )
    // Deleted at once, with Undo in its toast (R38).
    await user.click(await screen.findByRole('button', { name: 'Delete lesson' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/your-lessons'))
    expect(ownLessonsStore.getState().lessons.map((lesson) => lesson.id)).toEqual(['own-lesson-2'])
    expect(ownLessonsStore.getState().courses[0]?.lessons).toEqual(['bass-clef'])
    expect(progressStore.getState().learned['lesson:own-lesson-1']).toBeUndefined()
    expect(await screen.findByText('“Intros in G” deleted')).toBeInTheDocument()
  })

  it('is not found once it is gone', async () => {
    await renderApp('/lessons/own-lesson-7')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    await renderApp('/your-lessons', { locale: 'ru', storage: withOwn() })
    await screen.findByRole('link', { name: /^Sunday hymn playing/ })
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('Your courses (R30-5)', () => {
  beforeEach(stubTextLayout)

  it('are made from New on their page, the new one opened to edit', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/your-lessons', { storage: withOwn() })
    expect(await screen.findByRole('link', { name: /^Sunday hymn playing/ })).toHaveAttribute(
      'href',
      '/courses/own-course-1',
    )
    await makeNew(user, 'New course')
    const sheet = await screen.findByRole('dialog', { name: 'New course' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Reading four voices')
    await user.click(within(sheet).getByRole('button', { name: 'Create course' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/own-course-2/edit'))
    expect(ownLessonsStore.getState().courses[1]?.title).toBe('Reading four voices')
  })

  it('starts a course from the two weeks: its lessons copied into Your lessons, the course holding them', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/your-lessons', { storage: withOwn() })
    await makeNew(user, 'New course')
    const sheet = await screen.findByRole('dialog', { name: 'New course' })
    expect(within(sheet).getByRole('radio', { name: 'Empty course' })).toBeChecked()
    await user.click(
      within(sheet).getByRole('radio', { name: 'Two weeks: F major and accompaniment' }),
    )
    expect(within(sheet).getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Two weeks: F major and accompaniment',
    )
    await user.click(within(sheet).getByRole('button', { name: 'Create course' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/own-course-2/edit'))
    const { lessons, courses } = ownLessonsStore.getState()
    const course = courses[1]!
    expect(course.title).toBe('Two weeks: F major and accompaniment')
    expect(course.lessons).toHaveLength(15)
    expect(lessons.find((lesson) => lesson.id === course.lessons[1])?.title.en).toBe(
      'Day 1: the map of the key',
    )
  })

  it('reads as a course: its lessons, the learner’s and the app’s, each read in the course', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/courses/own-course-1', { storage: withOwn() })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sunday hymn playing' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Intros and the bass clef')).toBeInTheDocument()
    const lessons = screen.getByRole('region', { name: 'Lessons' })
    const bass = lessonById('bass-clef')!
    expect(within(lessons).getByRole('link', { name: new RegExp(bass.title.en) })).toHaveAttribute(
      'href',
      '/lessons/bass-clef?course=own-course-1',
    )
    await user.click(screen.getByRole('link', { name: 'Start: Hymn intros in G' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/own-lesson-1'))
    const place = await screen.findByRole('navigation', { name: 'Where this lesson is' })
    expect(place).toHaveTextContent('Lesson 1 of 2 · Sunday hymn playing')
    expect(screen.getAllByRole('link', { name: /Next lesson/ })[0]).toHaveAttribute(
      'href',
      '/lessons/bass-clef?course=own-course-1',
    )
  })

  it('is edited in the course editor: its lessons ordered, one of the app’s added by name', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/courses/own-course-1/edit', {
      storage: withOwn(),
    })
    expect(await screen.findByRole('button', { name: /^Cover: Church · Sky/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add lesson' }))
    const sheet = await screen.findByRole('dialog', { name: 'New lesson' })
    // The app's lessons are found by name.
    expect(within(sheet).queryByRole('region', { name: 'The app’s lessons' })).toBeNull()
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Inversions')
    await user.click(await within(sheet).findByRole('button', { name: /^Inversions/ }))
    await user.click(screen.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/own-course-1'))
    expect(ownLessonsStore.getState().courses[0]?.lessons).toEqual([
      'own-lesson-1',
      'bass-clef',
      'inversions',
    ])
  })

  it('keeps a change once the editor rests', async () => {
    const { ownLessonsStore } = await renderApp('/courses/own-course-1/edit', {
      storage: withOwn(),
    })
    const title = await screen.findByRole('textbox', { name: 'Title' })
    const user = userEvent.setup()
    await user.clear(title)
    await user.type(title, 'Sunday hymns')
    await waitFor(() => expect(ownLessonsStore.getState().courses[0]?.title).toBe('Sunday hymns'), {
      timeout: REST_MS * 4,
    })
  })

  it('renames, duplicates and deletes on its Settings, its lessons kept', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/courses/own-course-1', {
      storage: withOwn(),
    })
    const window = await openSettings(user)
    await user.click(within(window).getByRole('button', { name: 'Duplicate' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/own-course-2'))
    expect(ownLessonsStore.getState().courses[1]?.title).toBe('Sunday hymn playing copy')
    await act(() =>
      router.navigate({
        to: '/courses/$courseId',
        params: { courseId: 'own-course-1' },
        state: OPEN_SETTINGS,
      }),
    )
    // Deleted at once, with Undo in its toast (R38).
    await user.click(await screen.findByRole('button', { name: 'Delete course' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/your-lessons'))
    expect(ownLessonsStore.getState().courses.map((course) => course.id)).toEqual(['own-course-2'])
    expect(ownLessonsStore.getState().lessons).toHaveLength(1)
  })
})
