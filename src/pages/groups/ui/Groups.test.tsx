import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LIBRARY_STORAGE_KEY, LIBRARY_VERSION } from '@/entities/library'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeGroups } from '@/shared/api/groups'
import { createMemoryStorage } from '@/shared/lib'

async function signedIn() {
  const auth = createFakeAuth({
    accounts: [{ email: 'ana@example.com', name: 'Ana', password: 'correct horse' }],
  })
  await auth.signIn('ana@example.com', 'correct horse')
  return auth
}

/** The learner's own folder, Sunday, holding two of the app's hymns. */
function sunday() {
  const storage = createMemoryStorage()
  storage.setItem(
    LIBRARY_STORAGE_KEY,
    JSON.stringify({
      state: {
        folders: [
          {
            id: 'folder-1',
            name: 'Sunday',
            picture: 'church',
            paint: 'sky',
            songs: ['silent', 'amazing'],
          },
        ],
        nextFolder: 2,
      },
      version: LIBRARY_VERSION,
    }),
  )
  return storage
}

describe('groups and the folders shared with them (R30 S6)', () => {
  it('says groups need an account, signed out, with one Sign in', async () => {
    await renderApp('/songs/groups')
    expect(await screen.findByText('Share folders with a group')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
  })

  it('makes a group from Songs’ +, opening its page with its invite link and its owner', async () => {
    const user = userEvent.setup()
    const groups = createFakeGroups()
    const { router } = await renderApp('/songs', { auth: await signedIn(), groups })
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New group' }))
    const sheet = await screen.findByRole('dialog', { name: 'New group' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Choir')
    await user.click(within(sheet).getByRole('button', { name: 'Create group' }))
    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/songs\/groups\/group-/))
    expect(await screen.findByRole('heading', { level: 1, name: 'Choir' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Invite by link/ })).toBeInTheDocument()
    const members = await screen.findByRole('region', { name: '1 member' })
    expect(within(members).getByText('Owner')).toBeInTheDocument()
  })

  it('shares a folder with a group from its Settings, the row counting the groups', async () => {
    const user = userEvent.setup()
    const groups = createFakeGroups()
    await groups.create('Choir')
    await renderApp('/songs/folders/folder-1/settings', {
      auth: await signedIn(),
      groups,
      storage: sunday(),
    })
    await user.click(await screen.findByRole('button', { name: /^Share with a group/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Share with a group' })
    await user.click(await within(sheet).findByRole('checkbox', { name: 'Choir' }))
    await user.click(within(sheet).getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(groups.store.shares).toHaveLength(1))
    expect(groups.store.shares[0]).toMatchObject({
      folderKey: 'folder-1',
      name: 'Sunday',
      canEdit: false,
      songs: [
        { kind: 'built-in', id: 'silent' },
        { kind: 'built-in', id: 'amazing' },
      ],
    })
  })

  it('shows a member the folders shared with them, on Songs and on its own page', async () => {
    const user = userEvent.setup()
    let me = 'mihai'
    const groups = createFakeGroups({ who: () => me })
    const choir = await groups.create('Choir')
    if (!choir.ok) throw new Error('made')
    await groups.share(
      choir.value.id,
      {
        folderKey: 'folder-3',
        name: 'Advent',
        picture: 'star',
        paint: 'yellow',
        songs: [{ kind: 'built-in', id: 'silent' }],
      },
      false,
    )
    me = 'ana'
    await groups.join(choir.value.inviteCode)
    await renderApp('/songs', { auth: await signedIn(), groups })
    const shared = await screen.findByRole('region', { name: 'Shared with me' })
    await user.click(await within(shared).findByRole('link', { name: /^Advent/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Advent' })).toBeInTheDocument()
    expect(screen.getByText('View only')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Silent Night/ })).toHaveAttribute(
      'href',
      '/songs/silent',
    )
  })

  it('keeps a shared folder following its owner’s folder while Songs is open', async () => {
    const groups = createFakeGroups()
    const choir = await groups.create('Choir')
    if (!choir.ok) throw new Error('made')
    await groups.share(
      choir.value.id,
      { folderKey: 'folder-1', name: 'Sunday', picture: 'church', paint: 'sky', songs: [] },
      false,
    )
    await renderApp('/songs', { auth: await signedIn(), groups, storage: sunday() })
    await waitFor(
      () =>
        expect(groups.store.shares[0]?.songs).toEqual([
          { kind: 'built-in', id: 'silent' },
          { kind: 'built-in', id: 'amazing' },
        ]),
      { timeout: 4000 },
    )
  })

  it('joins a group by its invite link', async () => {
    const user = userEvent.setup()
    let me = 'mihai'
    const groups = createFakeGroups({ who: () => me })
    const choir = await groups.create('Choir')
    if (!choir.ok) throw new Error('made')
    me = 'ana'
    const { router } = await renderApp(`/songs/groups/join?code=${choir.value.inviteCode}`, {
      auth: await signedIn(),
      groups,
    })
    expect(await screen.findByText('Join Choir')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Join' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/songs/groups/${choir.value.id}`),
    )
  })
})
