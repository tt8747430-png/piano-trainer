import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAdmin } from '@/shared/api/admin'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { LAPTOP } from '@/shared/lib'

const OWNER = { email: 'owner@example.com', name: 'Owner', password: 'correct horse' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const ANA = {
  id: 'ana',
  email: 'ana@example.com',
  name: 'Ana',
  role: 'learner' as const,
  joinedAt: '2026-10-01T10:00:00Z',
  lastSignInAt: null,
}

const REPORT = {
  itemId: 'public-1',
  itemTitle: 'Morning',
  authorId: 'bo',
  authorName: 'Bo',
  hidden: false,
  reporterId: 'ana',
  reason: 'spam',
  note: 'Ads',
  reportedAt: '2026-10-29T10:00:00Z',
}

/** A laptop's screen, as `matchMedia` answers it. */
const onLaptop = () =>
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: media === LAPTOP,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))

describe('Administration (R32)', () => {
  it('is in Settings for an administrator only', async () => {
    const { unmount } = await renderApp('/settings', { auth: await signedInAs('learner') })
    await screen.findByRole('region', { name: 'App' })
    expect(screen.queryByRole('link', { name: /Administration/ })).toBeNull()
    unmount()
    await renderApp('/settings', { auth: await signedInAs('admin') })
    expect(await screen.findByRole('link', { name: /Administration/ })).toHaveAttribute(
      'href',
      '/admin',
    )
  })

  it('lists its sections on a phone, each pushing its page with Back to the list', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/admin', {
      auth: await signedInAs('admin'),
      admin: createFakeAdmin(),
    })
    await screen.findByRole('heading', { level: 1, name: 'Administration' })
    const sections = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
      .filter((href) => href?.startsWith('/admin/'))
    expect(sections).toEqual([
      '/admin/overview',
      '/admin/accounts',
      '/admin/groups',
      '/admin/flags',
      '/admin/reports',
      '/admin/feedback',
      '/admin/errors',
      '/admin/activity',
      '/admin/drafts',
      '/admin/components',
    ])
    await user.click(screen.getByRole('link', { name: 'Feature flags' }))
    await screen.findByRole('heading', { level: 1, name: 'Feature flags' })
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin'))
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
  })

  it('stands in the laptop’s Settings dialog, its own part of the nav, opening on the Overview', async () => {
    onLaptop()
    await renderApp('/admin', { auth: await signedInAs('admin'), admin: createFakeAdmin() })
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    const nav = within(dialog).getByRole('navigation', { name: 'Settings' })
    expect(within(nav).getByRole('heading', { name: 'Administration' })).toBeInTheDocument()
    expect(await within(nav).findByRole('link', { name: 'Overview' })).toHaveAttribute(
      'data-active',
    )
    expect(
      await within(dialog).findByRole('heading', { level: 2, name: 'Overview' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  it('knows no section it does not have', async () => {
    await renderApp('/admin/nothing', { auth: await signedInAs('admin') })
    expect(await screen.findByRole('heading', { level: 1 })).not.toHaveTextContent('Overview')
  })

  it('shows the kit’s components by kind, an admin’s gallery', async () => {
    await renderApp('/admin/components', { auth: await signedInAs('admin') })
    for (const kind of ['Actions', 'Rows', 'Choices', 'Progress', 'Empty state'])
      expect(await screen.findByRole('region', { name: kind })).toBeInTheDocument()
  })

  it('tells anyone else it is an administrator’s', async () => {
    const { unmount } = await renderApp('/admin', { auth: await signedInAs('editor') })
    expect(
      await screen.findByText('Administration requires an administrator account'),
    ).toBeVisible()
    unmount()
    await renderApp('/admin/accounts', { auth: await signedInAs('editor') })
    expect(
      await screen.findByText('Administration requires an administrator account'),
    ).toBeVisible()
  })

  it('asks before taking away an administrator’s access', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin({ accounts: [{ ...ANA, role: 'admin' }] })
    await renderApp('/admin/accounts', { auth: await signedInAs('admin'), admin })
    const role = await screen.findByRole('radiogroup', { name: 'Role for Ana' })
    await user.click(within(role).getByRole('radio', { name: 'Editor' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Remove administrator access?' })
    expect(asked).toHaveTextContent('Ana’s role changes to Editor')
    await user.click(within(asked).getByRole('button', { name: 'Cancel' }))
    expect(admin.log).toEqual([])
    await user.click(within(role).getByRole('radio', { name: 'Editor' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Change role' }),
    )
    await waitFor(() => expect(admin.log.map((entry) => entry.action)).toEqual(['set-role']))
  })

  it('changes an account’s role', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin({ accounts: [ANA] })
    await renderApp('/admin/accounts', { auth: await signedInAs('admin'), admin })
    const role = await screen.findByRole('radiogroup', { name: 'Role for Ana' })
    await user.click(within(role).getByRole('radio', { name: 'Editor' }))
    await waitFor(() =>
      expect(within(role).getByRole('radio', { name: 'Editor' })).toHaveAttribute(
        'aria-checked',
        'true',
      ),
    )
    expect(admin.log.map((entry) => entry.action)).toEqual(['set-role'])
  })

  it('makes a group and puts an account in it', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin({ accounts: [ANA] })
    await renderApp('/admin/groups', { auth: await signedInAs('admin'), admin })
    // New group, a sheet: its name, then Create.
    await user.click((await screen.findAllByRole('button', { name: 'New group' }))[0]!)
    await user.type(await screen.findByRole('textbox', { name: 'Group name' }), 'Testers')
    await user.click(screen.getByRole('button', { name: 'Create' }))
    // Its page: Add member finds an account.
    await user.click(await screen.findByRole('link', { name: /Testers/ }))
    await user.click(await screen.findByRole('button', { name: 'Add member' }))
    const sheet = await screen.findByRole('dialog', { name: 'Add member' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name or email' }), 'Ana')
    await user.click(await within(sheet).findByRole('button', { name: /^Ana/ }))
    await waitFor(async () => {
      const groups = await admin.groups()
      expect(groups.ok && groups.value).toEqual([
        { id: 'group-1', name: 'Testers', members: ['ana'] },
      ])
    })
  })

  it('adds a feature flag and enables it for everyone', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin()
    await renderApp('/admin/flags', { auth: await signedInAs('admin'), admin })
    // New flag, a sheet: what it turns on, and its key, made from those words until it is typed.
    await user.click((await screen.findAllByRole('button', { name: 'New flag' }))[0]!)
    await user.type(
      await screen.findByRole('textbox', { name: 'What it turns on' }),
      'The new editor',
    )
    const key = screen.getByRole('textbox', { name: 'Key' })
    expect(key).toHaveValue('the-new-editor')
    await user.clear(key)
    await user.type(key, 'new-editor')
    await user.click(screen.getByRole('button', { name: 'Create' }))
    const state = await screen.findByRole('radiogroup', { name: 'Enabled for: The new editor' })
    await user.click(within(state).getByRole('radio', { name: 'Everyone' }))
    await waitFor(async () => {
      const switches = await admin.switches()
      expect(switches.ok && switches.value).toEqual([
        { key: 'new-editor', label: 'The new editor', state: 'everyone', groups: [] },
      ])
    })
  })

  it('says a change was not made offline as offline, not as refused', async () => {
    const user = userEvent.setup()
    let online = true
    const admin = createFakeAdmin({ accounts: [ANA], online: () => online })
    await renderApp('/admin/accounts', { auth: await signedInAs('admin'), admin })
    const role = await screen.findByRole('radiogroup', { name: 'Role for Ana' })
    online = false
    await user.click(within(role).getByRole('radio', { name: 'Editor' }))
    expect(
      (await screen.findAllByText('You’re offline. Administration needs a connection.'))[0],
    ).toBeVisible()
    expect(screen.queryByText('The server declined the request.')).toBeNull()
  })

  it('hides a reported song, stops its author, and dismisses the report', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin({ reports: [REPORT] })
    await renderApp('/admin/reports', { auth: await signedInAs('admin'), admin })
    await user.click(await screen.findByRole('button', { name: 'Hide' }))
    expect(await screen.findByText('Hidden')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Suspend publishing' }))
    const asked = await screen.findByRole('alertdialog', {
      name: 'Suspend publishing for Bo?',
    })
    expect(admin.blocked.has('bo')).toBe(false)
    await user.click(within(asked).getByRole('button', { name: 'Suspend publishing' }))
    await waitFor(() => expect(admin.blocked.has('bo')).toBe(true))
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(await screen.findByText('No open reports')).toBeVisible()
  })

  it('lists what the admins did', async () => {
    const admin = createFakeAdmin({ accounts: [ANA] })
    await admin.setRole('ana', 'editor')
    await renderApp('/admin/activity', { auth: await signedInAs('admin'), admin })
    expect(await screen.findByText('Role changed')).toBeVisible()
  })

  it('lists the errors devices reported, each with where and its stack, without feedback', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin({
      errors: [
        {
          at: '2026-10-29T12:00:00Z',
          message: 'Cannot read the score',
          stack: 'at draw (score.ts:1)',
          path: '/play/bz5',
          build: '1.2.3',
        },
        {
          at: '2026-10-29T13:00:00Z',
          message: 'Report: The keys are too small',
          stack: '',
          path: '/practice/chords',
          build: '1.2.3',
        },
      ],
    })
    await renderApp('/admin/errors', { auth: await signedInAs('admin'), admin })
    expect(await screen.findByText('Cannot read the score')).toBeVisible()
    expect(screen.getByText('Once, on 1 screen')).toBeVisible()
    expect(screen.getByText(/\/play\/bz5 · build 1\.2\.3/)).toBeVisible()
    await user.click(screen.getByText('Stack trace'))
    expect(screen.getByText('at draw (score.ts:1)')).toBeVisible()
    expect(screen.queryByText(/The keys are too small/)).toBeNull()
  })

  it('lists learners’ feedback apart from the errors, newest first', async () => {
    const admin = createFakeAdmin({
      errors: [
        { at: '2026-10-29T12:00:00Z', message: 'Boom', stack: '', path: '/', build: '1' },
        {
          at: '2026-10-29T13:00:00Z',
          message: 'Report: The keys are too small',
          stack: '',
          path: '/practice/chords',
          build: '1.2.3',
        },
      ],
    })
    await renderApp('/admin/feedback', { auth: await signedInAs('admin'), admin })
    // The text in full under the day it came, anonymous: no screen or build.
    const said = await screen.findByText('The keys are too small')
    expect(said).toBeVisible()
    const main = screen.getByRole('main')
    expect(main).not.toHaveTextContent('/practice/chords')
    expect(main).not.toHaveTextContent('Boom')
  })

  it('lists the drafts editors left, the unpublished marked, each opening its editor', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing()
    await content.create('course', 'jazz', {
      body: { id: 'jazz' },
      meta: { title: { en: 'Jazz voicings', ru: 'Джазовые аккорды' } },
    })
    await content.create('piece', 'abide', { body: { id: 'abide' }, meta: { title: 'Abide' } })
    const { router } = await renderApp('/admin/drafts', {
      auth: await signedInAs('admin'),
      contentEditing: content,
    })
    const course = await screen.findByRole('link', { name: /Jazz voicings/ })
    expect(course).toHaveTextContent(/^Course/)
    expect(course).toHaveTextContent(/Not yet published$/)
    expect(screen.getByRole('link', { name: /Abide/ })).toHaveAttribute('href', '/edit/abide')
    await user.click(course)
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/jazz/edit'))
  })

  it(
    'opens on the overview: accounts, the week’s new and active, errors, reports and drafts',
    {
      timeout: 15000,
    },
    async () => {
      const admin = createFakeAdmin({
        accounts: [{ ...ANA, joinedAt: new Date().toISOString(), lastSignInAt: null }],
        reports: [REPORT],
      })
      await renderApp('/admin/overview', { auth: await signedInAs('admin'), admin })
      // Four calls answer first: under a full run's load they take a while.
      const figures = await screen.findByRole('region', { name: 'This week' }, { timeout: 8000 })
      // Each figure over its name.
      expect(figures).toHaveTextContent(/This week\s*1\s*Accounts.*1\s*New this week/)
      const attention = screen.getByRole('region', { name: 'Needs attention' })
      expect(attention).toHaveTextContent(/1 open · the oldest/)
    },
  )

  it('says when no error was reported', async () => {
    await renderApp('/admin/errors', {
      auth: await signedInAs('admin'),
      admin: createFakeAdmin(),
    })
    expect(await screen.findByText('No errors reported.')).toBeVisible()
  })

  it('reads in Russian', async () => {
    await renderApp('/admin/accounts', {
      auth: await signedInAs('admin'),
      admin: createFakeAdmin({ accounts: [ANA] }),
      locale: 'ru',
    })
    await screen.findByRole('radiogroup', { name: 'Роль: Ana' })
    expect(untranslated(document.body)).toEqual([])
  })
})
