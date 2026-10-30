import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { JOURNEYS, type Journey } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

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
  const strip = document.body
  await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
  await user.click(within(strip).getByRole('button', { name: 'Publish' }))
  await user.click(
    within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
  )
  await screen.findByText('Published. Learners get it the next time the app starts.')
}

describe('Manage lessons, a level’s editor (content as data)', () => {
  if (!FIRST || !SECOND) throw new Error('a journey of two chapters at least')

  it('is on an editor’s Lessons, never a learner’s', async () => {
    await renderApp('/', { auth: await signedInAs('editor') })
    expect(await screen.findByRole('link', { name: 'Manage lessons' })).toHaveAttribute(
      'href',
      `/journeys/${JOURNEY.id}/edit`,
    )
  })

  it('is not on a learner’s', async () => {
    await renderApp('/', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'Manage lessons' })).not.toBeInTheDocument()
  })

  it('drags its chapters and their steps by handles, and removes a step from its menu', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/journeys/${JOURNEY.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    // Chapters and steps alike are dragged by their handles; no menu moves them.
    for (const chapter of JOURNEY.chapters)
      // (a chapter may share its name with a step of its own)
      expect(
        await screen.findAllByRole('button', { name: `Move: ${chapter.title.en}` }),
      ).not.toHaveLength(0)
    const steps = screen.getByRole('list', { name: `Steps: ${FIRST.title.en}` })
    const [first] = within(steps).getAllByRole('listitem')
    if (!first) throw new Error('a chapter of a step at least')
    expect(within(first).getByRole('button', { name: /^Move: / })).toBeInTheDocument()
    await user.click(within(first).getByRole('button', { name: /^More: / }))
    expect(screen.queryByRole('button', { name: /^Move (up|down|to)/ })).not.toBeInTheDocument()
    await user.click(await screen.findByRole('button', { name: 'Remove' }))
    await publish(user)
    const body = content.body('journey', JOURNEY.id) as Journey
    expect(body.chapters[0]?.steps).toEqual(FIRST.steps.slice(1))
  })

  it('renames a chapter in place, in the language the draft’s menu says', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/journeys/${JOURNEY.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.click(await screen.findByRole('button', { name: 'The draft’s menu' }))
    await user.click(await screen.findByRole('button', { name: 'Русский' }))
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
    const { router } = await renderApp(`/journeys/${JOURNEY.id}/edit`, {
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
    const lesson = await content.draft('lesson', 'half-pedal')
    expect(lesson.ok && lesson.value?.body).toMatchObject({ title: { en: 'Half pedal' } })
    const draft = await content.draft('journey', JOURNEY.id)
    const journey = draft.ok ? (draft.value?.body as Journey) : undefined
    expect(journey?.chapters.at(-1)).toMatchObject({
      id: 'pedalling',
      title: { en: 'Pedalling' },
      steps: [{ kind: 'lesson', lessonId: 'half-pedal' }],
    })
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Edit lesson')
    expect(await screen.findByText('Half pedal')).toBeInTheDocument()
  })

  it('opens another level from its chips', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(`/journeys/${JOURNEY.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    const levels = await screen.findByRole('radiogroup', { name: 'Level' })
    await user.click(within(levels).getByRole('radio', { name: 'Intermediate' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/journeys/${JOURNEYS[1]!.id}/edit`),
    )
  })

  it('tells a learner it is an editor’s', async () => {
    await renderApp(`/journeys/${JOURNEY.id}/edit`, { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor manages the lessons.')).toBeInTheDocument()
  })
})
