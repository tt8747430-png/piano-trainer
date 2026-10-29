import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES } from '@/entities/course'
import { LESSONS, lessonExamples, lessonPlace } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

const LESSON = LESSONS.find((lesson) => lessonPlace(lesson.id))!
const COURSE = COURSES.find((course) => course.lessons.length > 0)!
const COURSE_LESSON = COURSE.lessons[0]!
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const editing = () =>
  createFakeContentEditing({
    items: [
      { kind: 'lesson', id: LESSON.id, body: LESSON, meta: {} },
      { kind: 'lesson', id: `${COURSE.id}/${COURSE_LESSON.id}`, body: COURSE_LESSON, meta: {} },
    ],
  })

/** The lesson's own group of fields: its title and summary. */
const lessonGroup = async () =>
  (await screen.findByRole('heading', { name: 'The lesson' })).closest('section') as HTMLElement

describe('the lesson editor (ADR 0116)', () => {
  it('is in an editor’s lesson bar, never a learner’s', async () => {
    await renderApp(`/lessons/${LESSON.id}`, { auth: await signedInAs('editor') })
    expect(await screen.findByRole('link', { name: 'Edit the lesson' })).toHaveAttribute(
      'href',
      `/lessons/${LESSON.id}/edit`,
    )
  })

  it('is not in a learner’s', async () => {
    await renderApp(`/lessons/${LESSON.id}`, { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'Edit the lesson' })).not.toBeInTheDocument()
  })

  it('saves a text changed to the draft, then publishes the lesson with it', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const title = within(
      within(await lessonGroup()).getByRole('group', { name: 'Title' }),
    ).getByRole('textbox', { name: 'English' })
    expect(title).toHaveValue(LESSON.title.en)
    await user.clear(title)
    await user.type(title, 'A new title')
    const strip = screen.getByRole('group', { name: 'Draft of the original' })
    await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })

    await user.click(within(strip).getByRole('button', { name: 'Publish' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
    )
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(content.body('lesson', LESSON.id)).toMatchObject({
      id: LESSON.id,
      title: { en: 'A new title', ru: LESSON.title.ru },
      sections: LESSON.sections,
    })
  })

  it('says where words are missing, and publishes nothing until they are there', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('admin'),
      contentEditing: content,
    })
    const summary = within(
      within(await lessonGroup()).getByRole('group', { name: 'Summary' }),
    ).getByRole('textbox', { name: 'Русский' })
    await user.clear(summary)
    expect(summary).toHaveAccessibleDescription('Words are needed here')
    const strip = screen.getByRole('group', { name: 'Draft of the original' })
    await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
    await user.click(within(strip).getByRole('button', { name: 'Publish' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
    )
    expect(
      await screen.findByText(
        'Every text needs words in both languages, and every example must read. Put them right, then publish.',
      ),
    ).toBeInTheDocument()
    expect(content.body('lesson', LESSON.id)).toEqual(LESSON)
  })

  it('opens a draft kept with words missing as it was left, not as published', async () => {
    const content = editing()
    const left = { ...LESSON, summary: { en: '', ru: LESSON.summary.ru } }
    await content.saveDraft('lesson', LESSON.id, { body: left, meta: {} })
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const summary = within(
      within(await lessonGroup()).getByRole('group', { name: 'Summary' }),
    ).getByRole('textbox', { name: 'English' })
    expect(summary).toHaveValue('')
    expect(summary).toHaveAccessibleDescription('Words are needed here')
  })

  it('edits a course’s lesson as the database keys it, by its course', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/courses/${COURSE.id}/${COURSE_LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const title = within(
      within(await lessonGroup()).getByRole('group', { name: 'Title' }),
    ).getByRole('textbox', { name: 'English' })
    await user.type(title, '!')
    await waitFor(
      async () => {
        const draft = await content.draft('lesson', `${COURSE.id}/${COURSE_LESSON.id}`)
        expect(draft.ok && draft.value?.body).toMatchObject({
          title: { en: `${COURSE_LESSON.title.en}!` },
        })
      },
      { timeout: 3000 },
    )
  })

  it('previews the draft as the lesson reads, the change in it', async () => {
    const user = userEvent.setup()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    const heading = LESSON.sections[0]?.heading.en ?? ''
    const field = within(
      (await screen.findByRole('heading', { name: new RegExp(`^Section 1`) })).closest(
        'section',
      ) as HTMLElement,
    ).getAllByRole('textbox', { name: 'English' })[0]
    if (!field) throw new Error('the first section’s heading field')
    expect(field).toHaveValue(heading)
    await user.clear(field)
    await user.type(field, 'A heading of the draft')
    await user.click(screen.getByRole('radio', { name: 'Preview' }))
    expect(
      await screen.findByRole('heading', { name: 'A heading of the draft' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'English' })).not.toBeInTheDocument()
  })

  it('writes a row of chords, says the symbol that does not read, and publishes it once it reads', async () => {
    const user = userEvent.setup()
    const lesson = LESSONS.find(
      (each) =>
        lessonPlace(each.id) && lessonExamples(each).some((example) => example.kind === 'chords'),
    )!
    const content = createFakeContentEditing({
      items: [{ kind: 'lesson', id: lesson.id, body: lesson, meta: {} }],
    })
    await renderApp(`/lessons/${lesson.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const chords = (await screen.findAllByRole('textbox', { name: 'Chords' }))[0]!
    await user.clear(chords)
    await user.type(chords, 'C Qx G7')
    expect(chords).toHaveAccessibleDescription('“Qx” doesn’t read')
    const strip = screen.getByRole('group', { name: 'Draft of the original' })
    await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
    await user.click(within(strip).getByRole('button', { name: 'Publish' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
    )
    expect(
      await screen.findByText(
        'Every text needs words in both languages, and every example must read. Put them right, then publish.',
      ),
    ).toBeInTheDocument()
    await user.clear(chords)
    await user.type(chords, 'C Am G7')
    expect(chords).not.toHaveAccessibleDescription()
    await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
    await user.click(within(strip).getByRole('button', { name: 'Publish' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
    )
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(JSON.stringify(content.body('lesson', lesson.id))).toContain('["C","Am","G7"]')
  })

  it('tells a learner it is an editor’s, with the way back', async () => {
    await renderApp(`/lessons/${LESSON.id}/edit`, { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor edits a lesson.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to the lesson' })).toHaveAttribute(
      'href',
      `/lessons/${LESSON.id}`,
    )
  })
})
