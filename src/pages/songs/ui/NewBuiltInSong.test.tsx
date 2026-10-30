import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

async function openMore(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'More for Hymns' }))
}

describe('a new built-in song (content as data)', () => {
  it('is made in a collection’s folder, unpublished, and opens in the original’s editor', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing()
    const { router, piecesStore } = await renderApp('/songs/folders/hymns', {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await openMore(user)
    await user.click(await screen.findByRole('button', { name: 'New built-in song' }))
    const sheet = await screen.findByRole('dialog', { name: 'New built-in song' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Title' }), 'Abide with me')
    await user.click(within(sheet).getByRole('button', { name: 'Make' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/abide-with-me'))
    expect(router.state.location.search).toMatchObject({ original: true })
    const draft = await content.draft('piece', 'abide-with-me')
    expect(draft.ok && draft.value?.body).toMatchObject({
      id: 'abide-with-me',
      kind: 'song',
      title: 'Abide with me',
      collection: 'hymns',
    })
    expect(content.body('piece', 'abide-with-me')).toBeUndefined()
    expect(piecesStore.getState().songs).toEqual([])
    expect(
      await screen.findByRole('button', { name: 'The draft’s menu' }, { timeout: 5000 }),
    ).toBeInTheDocument()
  })

  it('is not offered to a learner, nor in a folder of the learner’s own', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/hymns', { auth: await signedInAs('learner') })
    await openMore(user)
    await screen.findByRole('button', { name: 'New song here' })
    expect(screen.queryByRole('button', { name: 'New built-in song' })).not.toBeInTheDocument()
  })
})
