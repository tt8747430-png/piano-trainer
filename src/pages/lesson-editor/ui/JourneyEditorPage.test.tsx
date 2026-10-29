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
  const strip = screen.getByRole('group', { name: 'Draft of the original' })
  await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
  await user.click(within(strip).getByRole('button', { name: 'Publish' }))
  await user.click(
    within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
  )
  await screen.findByText('Published. Learners get it the next time the app starts.')
}

describe('the journey editor (content as data)', () => {
  if (!FIRST || !SECOND) throw new Error('a journey of two chapters at least')

  it('is on an editor’s Lessons, never a learner’s', async () => {
    await renderApp('/', { auth: await signedInAs('editor') })
    expect(await screen.findByRole('link', { name: 'Edit the journey' })).toHaveAttribute(
      'href',
      `/journeys/${JOURNEY.id}/edit`,
    )
  })

  it('is not on a learner’s', async () => {
    await renderApp('/', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'Edit the journey' })).not.toBeInTheDocument()
  })

  it('orders the chapters and a chapter’s steps, and publishes the journey with them', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/journeys/${JOURNEY.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const chapters = await screen.findByRole('list', { name: 'Chapters' })
    await user.click(within(chapters).getByRole('button', { name: `Move down: ${FIRST.title.en}` }))
    const steps = screen.getByRole('list', { name: `Steps: ${FIRST.title.en}` })
    const [, last] = within(steps).getAllByRole('listitem')
    if (!last) throw new Error('a chapter of two steps at least')
    await user.click(within(last).getByRole('button', { name: /^Move up: / }))
    await publish(user)
    const body = content.body('journey', JOURNEY.id) as Journey
    expect(body.chapters.map((chapter) => chapter.id).slice(0, 2)).toEqual([SECOND.id, FIRST.id])
    const moved = body.chapters[1]?.steps
    expect(moved?.[0]).toEqual(FIRST.steps[1])
    expect(moved?.[1]).toEqual(FIRST.steps[0])
  })

  it('adds a chapter, and a new lesson to it that opens in the lesson editor', async () => {
    const user = userEvent.setup()
    const content = editing()
    const { router } = await renderApp(`/journeys/${JOURNEY.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.type(await screen.findByRole('textbox', { name: 'New chapter' }), 'Pedalling')
    await user.click(screen.getByRole('button', { name: 'Add chapter' }))
    const chapter = await screen.findByRole('region', { name: 'Pedalling' })
    await user.type(within(chapter).getByRole('textbox', { name: 'New lesson' }), 'Half pedal')
    await user.click(within(chapter).getByRole('button', { name: 'Add lesson' }))
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
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Half pedal')
  })

  it('tells a learner it is an editor’s', async () => {
    await renderApp(`/journeys/${JOURNEY.id}/edit`, { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor edits a journey.')).toBeInTheDocument()
  })
})
