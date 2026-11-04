import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { coursesOn } from '@/entities/course'
import { JOURNEYS, type Journey } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { confirmAsked } from '@/shared/test/confirm'

const JOURNEY = JOURNEYS[0]!
const [FIRST, SECOND] = JOURNEY.chapters
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const editing = () =>
  createFakeContentEditing({
    items: [{ kind: 'journey', id: JOURNEY.id, body: JOURNEY, meta: {} }],
  })

async function publish(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByText('Saved · not published', {}, { timeout: 3000 })
  await user.click(screen.getByRole('button', { name: 'Publish' }))
  await user.click(
    within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
  )
  await screen.findByText('Published. Learners get it the next time the app starts.')
}

describe('a level’s Edit mode, in place on the Lessons (R29 B4)', () => {
  if (!FIRST || !SECOND) throw new Error('a journey of two chapters at least')

  it('shows an editor handles, rename, remove and + in place; Done leaves', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/', {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    // Outside Edit mode, the page a learner sees.
    expect(screen.queryByRole('button', { name: /^Move: / })).toBeNull()
    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ edit: true }))
    for (const chapter of JOURNEY.chapters)
      expect(
        await screen.findAllByRole('button', { name: `Move: ${chapter.title.en}` }),
      ).not.toHaveLength(0)
    expect(screen.getAllByRole('textbox', { name: 'Chapter name' })).toHaveLength(
      JOURNEY.chapters.length,
    )
    expect(screen.getByRole('button', { name: `Chapter: ${FIRST.title.en}` })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Add lesson' })).toHaveLength(
      JOURNEY.chapters.length,
    )
    expect(screen.getByRole('button', { name: 'Add chapter' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(router.state.location.search).not.toMatchObject({ edit: true }))
    expect(screen.queryByRole('button', { name: /^Move: / })).toBeNull()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('removes a step from its menu and publishes the level', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp('/?edit=1', { auth: await signedInAs('editor'), contentEditing: content })
    const steps = await screen.findByRole('list', { name: `Steps: ${FIRST.title.en}` })
    const [first] = within(steps).getAllByRole('listitem')
    if (!first) throw new Error('a chapter of a step at least')
    await user.click(within(first).getByRole('button', { name: /^More: / }))
    await user.click(await screen.findByRole('menuitem', { name: 'Remove' }))
    await publish(user)
    const body = content.body('journey', JOURNEY.id) as Journey
    expect(body.chapters[0]?.steps).toEqual(FIRST.steps.slice(1))
  })

  it('removes a chapter once asked', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp('/?edit=1', { auth: await signedInAs('editor'), contentEditing: content })
    await user.click(await screen.findByRole('button', { name: `Chapter: ${SECOND.title.en}` }))
    await user.click(await screen.findByRole('menuitem', { name: 'Remove chapter' }))
    await confirmAsked(user, 'Remove', `Remove “${SECOND.title.en}”?`)
    await publish(user)
    const body = content.body('journey', JOURNEY.id) as Journey
    expect(body.chapters.map((chapter) => chapter.id)).not.toContain(SECOND.id)
  })

  it('renames a chapter in place, in the language the draft’s menu says', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp('/?edit=1', { auth: await signedInAs('editor'), contentEditing: content })
    await user.click(await screen.findByRole('button', { name: 'Publishing' }))
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Русский' }))
    const name = within(screen.getByRole('region', { name: FIRST.title.en })).getByRole('textbox', {
      name: 'Chapter name',
    })
    expect(name).toHaveValue(FIRST.title.ru)
    await user.type(name, '!')
    await publish(user)
    const body = content.body('journey', JOURNEY.id) as Journey
    expect(body.chapters[0]?.title).toEqual({ en: FIRST.title.en, ru: `${FIRST.title.ru}!` })
  })

  it('adds a chapter, and a new lesson to it that opens in the lesson editor', async () => {
    const user = userEvent.setup()
    const content = editing()
    const { router } = await renderApp('/?edit=1', {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.click(await screen.findByRole('button', { name: 'Add chapter' }))
    const chapterSheet = await screen.findByRole('dialog', { name: 'New chapter' })
    await user.type(within(chapterSheet).getByRole('textbox', { name: 'Name' }), 'Pedalling{Enter}')
    const chapter = await screen.findByRole('region', { name: 'Pedalling' })
    await user.click(within(chapter).getByRole('button', { name: 'Add lesson' }))
    const lessonSheet = await screen.findByRole('dialog', { name: 'New lesson' })
    await user.type(within(lessonSheet).getByRole('textbox', { name: 'Name' }), 'Half pedal')
    await user.click(within(lessonSheet).getByRole('button', { name: 'Create lesson' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/half-pedal/edit'))
    const draft = await content.draft('journey', JOURNEY.id)
    const journey = draft.ok ? (draft.value?.body as Journey) : undefined
    expect(journey?.chapters.at(-1)).toMatchObject({
      id: 'pedalling',
      steps: [{ kind: 'lesson', lessonId: 'half-pedal' }],
    })
  })

  it('opens another level from its chips, still in Edit mode', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/?edit=1', {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    const levels = await screen.findByRole('radiogroup', { name: 'Level' })
    await user.click(within(levels).getByRole('radio', { name: 'Intermediate' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({
        journey: JOURNEYS[1]!.id,
        edit: true,
      }),
    )
  })

  it('is not a learner’s: no Edit, and an Edit link opens the page they see', async () => {
    await renderApp('/?edit=1', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Add chapter' })).toBeNull()
  })
})

describe('the Courses’ shelves in Edit mode, in place (R29 B4)', () => {
  it('lists each shelf’s courses, each dragged by its handle, New course at its end', async () => {
    const user = userEvent.setup()
    await renderApp('/?view=courses', {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing(),
    })
    // No floating + outside Edit mode: an editor sees the page a learner sees.
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    expect(screen.queryByRole('button', { name: 'New course' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const beginner = await screen.findByRole('region', { name: 'Beginner courses' })
    const rows = within(within(beginner).getByRole('list')).getAllByRole('listitem')
    const courses = coursesOn('beginner')
    expect(rows).toHaveLength(courses.length)
    for (const [at, course] of courses.entries())
      expect(
        within(rows[at]!).getByRole('button', { name: `Move: ${course.title.en}` }),
      ).toBeInTheDocument()
    await user.click(within(beginner).getByRole('button', { name: 'New course' }))
    expect(await screen.findByRole('dialog', { name: 'New course' })).toBeInTheDocument()
  })

  it('has no Edit for a learner', async () => {
    await renderApp('/?view=courses&edit=1', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull()
    expect(screen.queryByRole('button', { name: /^Move: / })).toBeNull()
  })
})

describe('the old editors’ routes (R29 B4)', () => {
  it('are gone: /journeys/x/edit and /courses/manage are not routes', async () => {
    const { router } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    const paths = Object.keys(router.routesByPath)
    expect(paths).not.toContain('/journeys/$journeyId/edit')
    expect(paths).not.toContain('/courses/manage')
  })
})
