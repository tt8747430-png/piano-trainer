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

/** The +, then its New song: the one way to a new song, in any folder. */
async function newSong(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'New' }))
  await user.click(await screen.findByRole('button', { name: /^New song/ }))
  return screen.findByRole('dialog', { name: 'New song' })
}

describe('a new song in a collection’s folder (content as data, round 26: one New song)', () => {
  it('is an editor’s, made in the collection, unpublished, and opens in the original’s editor', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing()
    const { router, piecesStore } = await renderApp('/songs/folders/hymns', {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const sheet = await newSong(user)
    // No hint under the name: Flat's new score says nothing there.
    expect(within(sheet).queryByText(/unpublished until/)).toBeNull()
    await user.type(within(sheet).getByRole('textbox', { name: 'Title' }), 'Abide with me')
    // Flat's three steps: the name, the instruments, the setup.
    await user.click(within(sheet).getByRole('button', { name: 'Next' }))
    await user.click(within(sheet).getByRole('button', { name: 'Next' }))
    await user.click(within(sheet).getByRole('button', { name: 'Create song' }))
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

  it('is a learner’s own song, in their library', async () => {
    const user = userEvent.setup()
    const { router, piecesStore } = await renderApp('/songs/folders/hymns', {
      auth: await signedInAs('learner'),
    })
    const sheet = await newSong(user)
    await user.type(within(sheet).getByRole('textbox', { name: 'Title' }), 'Abide with me')
    // Flat's three steps: the name, the instruments, the setup.
    await user.click(within(sheet).getByRole('button', { name: 'Next' }))
    await user.click(within(sheet).getByRole('button', { name: 'Next' }))
    await user.click(within(sheet).getByRole('button', { name: 'Create song' }))
    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/edit\/my-/))
    expect(piecesStore.getState().songs.map((song) => song.title)).toEqual(['Abide with me'])
  })
})
