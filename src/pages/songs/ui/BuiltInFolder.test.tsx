import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { arrangeLibrary, libraryCatalog, placeIn, type LibraryState } from '@/entities/library'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { confirmAsked } from '@/shared/test/confirm'

const OWNER = { email: 'owner@example.com', name: 'Owner', password: 'correct horse' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

type User = ReturnType<typeof userEvent.setup>

/** Where a song stands in the library the store holds. */
const placeOf = (state: LibraryState, id: string) =>
  placeIn(arrangeLibrary(state, libraryCatalog({ ownSongs: [] })), id)

/** The app at a built-in folder as a learner: signed out, signed in as one, or an editor in Learner view. */
async function asLearner(how: 'signed-out' | 'learner' | 'learner-view', user: User) {
  if (how === 'signed-out') return renderApp('/songs/folders/hymns')
  if (how === 'learner')
    return renderApp('/songs/folders/hymns', { auth: await signedInAs('learner') })
  const app = await renderApp('/settings', { auth: await signedInAs('editor') })
  await user.click(await screen.findByRole('switch', { name: 'View as a learner' }))
  await screen.findByRole('status')
  await app.router.navigate({ to: '/songs/folders/$folderId', params: { folderId: 'hymns' } })
  await screen.findByRole('heading', { level: 1, name: 'Hymns' })
  return app
}

/** A row's More (⋯), its items by name. */
async function moreOf(user: User, name: string) {
  await user.click(await screen.findByRole('button', { name: `More for ${name}` }))
  const items = (await screen.findAllByRole('menuitem')).map((item) => item.textContent)
  await user.keyboard('{Escape}')
  return items
}

describe.each(['signed-out', 'learner', 'learner-view'] as const)(
  'a learner in a built-in folder (R29 B4, D8), %s',
  (how) => {
    it('has no +: nothing is added to the app’s folder', async () => {
      await asLearner(how, userEvent.setup())
      await screen.findByRole('heading', { level: 1, name: 'Hymns' })
      expect(screen.queryByRole('button', { name: 'New' })).toBeNull()
    })

    it('offers a song’s More without Move to… or Delete', async () => {
      const user = userEvent.setup()
      await asLearner(how, user)
      expect(await moreOf(user, 'Silent Night')).toEqual([
        'Add to favourites',
        'Archive',
        'Export…',
      ])
    })

    it('leaves the folder’s Settings with its place alone: no name, archive or delete', async () => {
      const user = userEvent.setup()
      await asLearner(how, user)
      await user.click(await screen.findByRole('link', { name: 'Settings for Hymns' }))
      await screen.findByRole('heading', { level: 1, name: 'Folder settings' })
      expect(screen.getByRole('button', { name: /Move to folder/ })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Name and look/ })).toBeNull()
      expect(screen.queryByRole('button', { name: /Archive folder/ })).toBeNull()
      expect(screen.queryByRole('button', { name: /Delete folder/ })).toBeNull()
    })

    it('shows Select’s bar without Move or Delete', async () => {
      const user = userEvent.setup()
      await asLearner(how, user)
      await user.click(await screen.findByRole('button', { name: 'Select' }))
      await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
      const bar = screen.getByRole('toolbar', { name: 'For what is selected' })
      expect(
        within(bar)
          .getAllByRole('button')
          .map((button) => button.textContent),
      ).toEqual(['Favourite', 'Export', 'Archive'])
    })

    it('sorts the folder, and the sort is kept', async () => {
      const user = userEvent.setup()
      const { libraryStore } = await asLearner(how, user)
      await user.click(await screen.findByRole('combobox', { name: /^Sort/ }))
      await user.click(await screen.findByRole('option', { name: 'Name' }))
      await waitFor(() => expect(libraryStore.getState().sort).toBe('name'))
    })

    it('hides an archived song, under Archived (n), and brings it back', async () => {
      const user = userEvent.setup()
      const { libraryStore, router } = await asLearner(how, user)
      await user.click(await screen.findByRole('button', { name: 'More for Silent Night' }))
      await user.click(await screen.findByRole('menuitem', { name: 'Archive' }))
      await confirmAsked(user, 'Archive', 'Hide “Silent Night” from this folder?')
      expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived')
      await user.click(await screen.findByRole('link', { name: 'Archived (1)' }))
      await waitFor(() =>
        expect(router.state.location.pathname).toBe('/songs/folders/hymns/archived'),
      )
      await user.click(await screen.findByRole('button', { name: 'Unarchive Silent Night' }))
      expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: 'hymns' })
    })
  },
)

describe('an editor in a built-in folder (R29 B4, D8)', () => {
  it('adds and moves: + holds New song and Import, Select’s bar Move', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/hymns', { auth: await signedInAs('editor') })
    await user.click(await screen.findByRole('button', { name: 'New' }))
    expect(await screen.findByRole('button', { name: /^New song/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Import/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^New folder/ })).toBeNull()
    await user.keyboard('{Escape}')
    expect(await moreOf(user, 'Silent Night')).toContain('Move to…')
  })
})

describe('a learner at Home (R29 B4)', () => {
  it('moves nothing into one of the app’s folders: the Move sheet greys them with why', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'More for Hymns' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Move to…' }))
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    const called = within(sheet).getAllByRole('button', { name: /^Called to Play/ })
    for (const each of called) {
      expect(each).toHaveAttribute('aria-disabled', 'true')
      expect(each).toHaveAttribute('title', 'Only editors add to the app’s folders')
    }
  })
})
