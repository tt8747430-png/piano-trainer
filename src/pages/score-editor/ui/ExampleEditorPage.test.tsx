import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LESSONS, type Lesson } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { notesBlocks } from '../model/example-music'

/** A lesson with an example of notes, its line alone (a single staff). */
const LESSON = LESSONS.find((lesson) => notesBlocks(lesson).some((each) => !each.bass))!
const AT = notesBlocks(LESSON).findIndex((each) => !each.bass)
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

describe('a lesson’s example of notes on its own score (round 27)', () => {
  it('opens the example as a score, writes each change into the lesson’s draft, Done back to the lesson', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing({
      items: [{ kind: 'lesson', id: LESSON.id, body: LESSON, meta: {} }],
    })
    const { router } = await renderApp(`/lessons/${LESSON.id}/example?n=${AT}`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await screen.findByRole('region', { name: 'Score' }, { timeout: 10_000 })
    // A rest written at the caret: the example's first note becomes a rest.
    await user.keyboard('8')
    await user.click(screen.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/lessons/${LESSON.id}/edit`))
    const draft = await content.draft('lesson', LESSON.id)
    const saved = draft.ok ? (draft.value?.body as Lesson) : undefined
    expect(saved && notesBlocks(saved)[AT]?.notes).toMatch(/^r\//)
  }, 30_000)

  it('is an editor’s alone', async () => {
    await renderApp(`/lessons/${LESSON.id}/example?n=${AT}`, { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor edits this.')).toBeInTheDocument()
  })
})
