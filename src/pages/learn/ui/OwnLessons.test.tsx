import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Editor } from '@tiptap/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { blankLesson, lessonById } from '@/entities/lesson'
import { OWN_LESSONS_STORAGE_KEY, type OwnLessonsState } from '@/entities/own-lessons'
import { createMemoryStorage, REST_MS } from '@/shared/lib'
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

/** The screen bar's Settings (the gear), not the sidebar's. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('heading', { level: 1 })
  const bar = document.querySelector<HTMLElement>('[data-slot="screen-bar"]')!
  await user.click(within(bar).getByRole('link', { name: 'Settings' }))
}

describe('Your lessons (R30-5)', () => {
  beforeEach(stubTextLayout)

  it('is the chip after the levels: empty, it says so, and New lesson opens the new one to write', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/')
    await user.click(await screen.findByRole('radio', { name: 'Your lessons' }))
    const own = await screen.findByRole('region', { name: 'Your lessons' })
    expect(own).toHaveTextContent('No lessons of your own yet.')
    await user.click(screen.getByRole('button', { name: 'New lesson' }))
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
    expect(within(place).getByRole('link', { name: 'Your lessons' })).toHaveAttribute(
      'href',
      '/?journey=own',
    )
  })

  it('lists the learner’s lessons with how far each is read, never in a level’s count', async () => {
    const { progressStore } = await renderApp('/?journey=own', { storage: withOwn() })
    const own = await screen.findByRole('region', { name: 'Your lessons' })
    expect(within(own).getByRole('link', { name: /^Hymn intros in G/ })).toHaveAttribute(
      'href',
      '/lessons/own-lesson-1',
    )
    expect(own).toHaveTextContent('0 of 1 learned')
    act(() =>
      progressStore.setState({ learned: { 'lesson:own-lesson-1': '2026-11-05T10:00:00.000Z' } }),
    )
    expect(own).toHaveTextContent('1 of 1 learned')
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
    await openSettings(user)
    expect(await screen.findByRole('radiogroup', { name: 'Lessons read as' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Share link' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Rename' }))
    const sheet = await screen.findByRole('dialog', { name: 'Rename lesson' })
    const name = within(sheet).getByRole('textbox', { name: 'Name' })
    await user.clear(name)
    await user.type(name, 'Intros in G')
    await user.click(within(sheet).getByRole('button', { name: 'Rename' }))
    expect(ownLessonsStore.getState().lessons[0]?.title).toEqual({
      en: 'Intros in G',
      ru: 'Intros in G',
    })
    await user.click(screen.getByRole('button', { name: 'Duplicate' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/own-lesson-2'))
    expect(ownLessonsStore.getState().lessons.map((lesson) => lesson.id)).toEqual([
      'own-lesson-1',
      'own-lesson-2',
    ])
    await act(() =>
      router.navigate({ to: '/lessons/$lessonId/settings', params: { lessonId: 'own-lesson-1' } }),
    )
    await user.click(await screen.findByRole('button', { name: 'Delete lesson' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete' }),
    )
    await waitFor(() => expect(router.state.location.search).toEqual({ journey: 'own' }))
    expect(ownLessonsStore.getState().lessons.map((lesson) => lesson.id)).toEqual(['own-lesson-2'])
    expect(ownLessonsStore.getState().courses[0]?.lessons).toEqual(['bass-clef'])
    expect(progressStore.getState().learned['lesson:own-lesson-1']).toBeUndefined()
  })

  it('is not found once it is gone', async () => {
    await renderApp('/lessons/own-lesson-7')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    await renderApp('/?journey=own', { locale: 'ru' })
    expect(await screen.findByRole('region', { name: 'Ваши уроки' })).toHaveTextContent(
      'Своих уроков пока нет.',
    )
    expect(screen.getByRole('button', { name: 'Новый урок' })).toBeInTheDocument()
  })
})

describe('Your courses (R30-5)', () => {
  beforeEach(stubTextLayout)

  it('follow the shelves, each on its cover, and New course opens the new one to edit', async () => {
    const user = userEvent.setup()
    const { router, ownLessonsStore } = await renderApp('/?view=courses', { storage: withOwn() })
    const own = await screen.findByRole('region', { name: 'Your courses' })
    expect(within(own).getByRole('link', { name: /^Sunday hymn playing/ })).toHaveAttribute(
      'href',
      '/courses/own-course-1',
    )
    await user.click(within(own).getByRole('button', { name: 'New course' }))
    const sheet = await screen.findByRole('dialog', { name: 'New course' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Reading four voices')
    await user.click(within(sheet).getByRole('button', { name: 'Create course' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/own-course-2/edit'))
    expect(ownLessonsStore.getState().courses[1]?.title).toBe('Reading four voices')
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
    await user.click(screen.getByRole('link', { name: 'Start course' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/own-lesson-1'))
    const place = await screen.findByRole('navigation', { name: 'Where this lesson is' })
    expect(place).toHaveTextContent('Sunday hymn playing · Lesson 1 of 2')
    expect(screen.getByRole('link', { name: /Next lesson/ })).toHaveAttribute(
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
    const { router, ownLessonsStore } = await renderApp('/courses/own-course-1/settings', {
      storage: withOwn(),
    })
    await user.click(await screen.findByRole('button', { name: 'Duplicate' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/own-course-2'))
    expect(ownLessonsStore.getState().courses[1]?.title).toBe('Sunday hymn playing copy')
    await act(() =>
      router.navigate({ to: '/courses/$courseId/settings', params: { courseId: 'own-course-1' } }),
    )
    await user.click(await screen.findByRole('button', { name: 'Delete course' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete' }),
    )
    await waitFor(() => expect(router.state.location.search).toEqual({ view: 'courses' }))
    expect(ownLessonsStore.getState().courses.map((course) => course.id)).toEqual(['own-course-2'])
    expect(ownLessonsStore.getState().lessons).toHaveLength(1)
  })
})
