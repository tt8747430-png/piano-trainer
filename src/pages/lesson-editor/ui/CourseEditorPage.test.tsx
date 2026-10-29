import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES, courseRecord } from '@/entities/course'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

const COURSE = COURSES[0]!
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const editing = () =>
  createFakeContentEditing({
    items: [{ kind: 'course', id: COURSE.id, body: courseRecord(COURSE), meta: {} }],
  })

/** A field of the course's texts: its group by name, its language's box. */
const field = async (group: 'Title' | 'Summary', language: 'English' | 'Русский') =>
  within(await screen.findByRole('group', { name: group })).getByRole('textbox', {
    name: language,
  })

/** Publishes the draft once it is saved: the strip's Publish, then the dialog's. */
async function publish(user: ReturnType<typeof userEvent.setup>) {
  const strip = screen.getByRole('group', { name: 'Draft of the original' })
  await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
  await user.click(within(strip).getByRole('button', { name: 'Publish' }))
  await user.click(
    within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
  )
}

describe('the course editor (ADR 0116, round 12)', () => {
  it('is on an editor’s course page, never a learner’s', async () => {
    await renderApp(`/courses/${COURSE.id}`, { auth: await signedInAs('editor') })
    expect(await screen.findByRole('link', { name: 'Edit the course' })).toHaveAttribute(
      'href',
      `/courses/${COURSE.id}/edit`,
    )
  })

  it('is not on a learner’s', async () => {
    await renderApp(`/courses/${COURSE.id}`, { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'Edit the course' })).not.toBeInTheDocument()
  })

  it('saves the title and summary to the draft, then publishes the course with them', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/courses/${COURSE.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const title = await field('Title', 'English')
    expect(title).toHaveValue(COURSE.title.en)
    await user.clear(title)
    await user.type(title, 'A new course title')
    await user.type(await field('Summary', 'Русский'), '!')
    await publish(user)
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(content.body('course', COURSE.id)).toEqual({
      id: COURSE.id,
      title: { en: 'A new course title', ru: COURSE.title.ru },
      summary: { en: COURSE.summary.en, ru: `${COURSE.summary.ru}!` },
      lessons: COURSE.lessons.map((lesson) => lesson.id),
      shelf: COURSE.shelf,
      stage: COURSE.stage,
      weeks: COURSE.weeks,
    })
  })

  it('says where words are missing, and publishes nothing until they are there', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/courses/${COURSE.id}/edit`, {
      auth: await signedInAs('admin'),
      contentEditing: content,
    })
    const summary = await field('Summary', 'English')
    await user.clear(summary)
    expect(summary).toHaveAccessibleDescription('Words are needed here')
    await publish(user)
    expect(
      await screen.findByText(
        'The title and the summary need words in both languages. Put them right, then publish.',
      ),
    ).toBeInTheDocument()
    expect(content.body('course', COURSE.id)).toEqual(courseRecord(COURSE))
  })

  it('orders and removes the course’s lessons, published with the course', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/courses/${COURSE.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const [first, second, third] = COURSE.lessons
    if (!first || !second || !third) throw new Error('a course of three lessons at least')
    const lessons = await screen.findByRole('list', { name: 'Lessons' })
    expect(within(lessons).getAllByRole('listitem')).toHaveLength(COURSE.lessons.length)
    await user.click(within(lessons).getByRole('button', { name: `Move up: ${second.title.en}` }))
    await user.click(within(lessons).getByRole('button', { name: `Remove: ${third.title.en}` }))
    expect(
      within(lessons)
        .getAllByRole('link')
        .slice(0, 2)
        .map((link) => link.textContent),
    ).toEqual([second.title.en, first.title.en])
    await publish(user)
    await screen.findByText('Published. Learners get it the next time the app starts.')
    expect((content.body('course', COURSE.id) as { lessons: string[] }).lessons).toEqual([
      second.id,
      first.id,
      ...COURSE.lessons.slice(3).map((lesson) => lesson.id),
    ])
  })

  it('adds a new lesson, unpublished, at the course’s end, and opens it in the lesson editor', async () => {
    const user = userEvent.setup()
    const content = editing()
    const { router } = await renderApp(`/courses/${COURSE.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.type(await screen.findByRole('textbox', { name: 'New lesson' }), 'Blues in C')
    await user.click(screen.getByRole('button', { name: 'Add lesson' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/courses/${COURSE.id}/blues-in-c/edit`),
    )
    const lesson = await content.draft('lesson', `${COURSE.id}/blues-in-c`)
    expect(lesson.ok && lesson.value?.body).toMatchObject({
      id: 'blues-in-c',
      title: { en: 'Blues in C' },
    })
    expect(content.body('lesson', `${COURSE.id}/blues-in-c`)).toBeUndefined()
    const course = await content.draft('course', COURSE.id)
    const record = course.ok ? (course.value?.body as { lessons: string[] }) : undefined
    expect(record?.lessons.at(-1)).toBe('blues-in-c')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Blues in C')
  })

  it('makes a new course from Courses, unpublished, and opens it in the course editor', async () => {
    const user = userEvent.setup()
    const content = editing()
    const { router } = await renderApp('/?view=courses', {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.click(await screen.findByRole('link', { name: 'New course' }))
    await user.type(await screen.findByRole('textbox', { name: 'Name' }), 'Jazz voicings')
    await user.click(screen.getByRole('button', { name: 'Create course' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/jazz-voicings/edit'))
    const draft = await content.draft('course', 'jazz-voicings')
    expect(draft.ok && draft.value?.body).toMatchObject({
      id: 'jazz-voicings',
      title: { en: 'Jazz voicings' },
      lessons: [],
      shelf: 'beginner',
      stage: 'beginner',
    })
    expect(content.body('course', 'jazz-voicings')).toBeUndefined()
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Jazz voicings')
    expect(await screen.findByText('No lessons yet. Name the first one below.')).toBeInTheDocument()
  })

  it('offers no new course to a learner', async () => {
    await renderApp('/?view=courses', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'New course' })).not.toBeInTheDocument()
  })

  it('tells a learner it is an editor’s, with the way back', async () => {
    await renderApp(`/courses/${COURSE.id}/edit`, { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor edits a course.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to the course' })).toHaveAttribute(
      'href',
      `/courses/${COURSE.id}`,
    )
  })

  it('reads in Russian', async () => {
    await renderApp(`/courses/${COURSE.id}/edit`, {
      locale: 'ru',
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    expect(await screen.findByRole('heading', { name: 'Курс' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(COURSE.title.ru)
  })
})
