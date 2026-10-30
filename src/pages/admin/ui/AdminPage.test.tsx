import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAdmin } from '@/shared/api/admin'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

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

describe('the Admin area', () => {
  it('is in Settings for an admin only', async () => {
    const { unmount } = await renderApp('/settings', { auth: await signedInAs('learner') })
    await screen.findByRole('region', { name: 'General' })
    expect(screen.queryByRole('link', { name: /Admin/ })).toBeNull()
    unmount()
    await renderApp('/settings', { auth: await signedInAs('admin') })
    expect(await screen.findByRole('link', { name: /Admin/ })).toHaveAttribute('href', '/admin')
  })

  it('shows the kit’s components by kind, an admin’s gallery', async () => {
    await renderApp('/admin?tab=components', { auth: await signedInAs('admin') })
    for (const kind of ['Actions', 'Rows', 'Choices', 'Progress', 'Empty state'])
      expect(await screen.findByRole('region', { name: kind })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Components' })).toHaveAttribute('aria-current', 'page')
  })

  it('tells anyone else it is an admin’s', async () => {
    await renderApp('/admin', { auth: await signedInAs('editor') })
    expect(await screen.findByText('Only an admin can open this page.')).toBeVisible()
  })

  it('changes an account’s role', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin({ accounts: [ANA] })
    await renderApp('/admin?tab=accounts', { auth: await signedInAs('admin'), admin })
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
    await renderApp('/admin?tab=groups', { auth: await signedInAs('admin'), admin })
    await user.type(await screen.findByLabelText('New group'), 'Testers')
    await user.click(screen.getByRole('button', { name: 'Add group' }))
    await user.click(await screen.findByRole('switch', { name: 'Ana: In Testers' }))
    await waitFor(async () => {
      const groups = await admin.groups()
      expect(groups.ok && groups.value).toEqual([
        { id: 'group-1', name: 'Testers', members: ['ana'] },
      ])
    })
  })

  it('adds a feature switch and turns it on for everyone', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin()
    await renderApp('/admin?tab=switches', { auth: await signedInAs('admin'), admin })
    await user.type(await screen.findByLabelText('Key'), 'new-editor')
    await user.type(screen.getByLabelText('What it turns on'), 'The new editor')
    await user.click(screen.getByRole('button', { name: 'Add switch' }))
    const state = await screen.findByRole('radiogroup', { name: 'On for: The new editor' })
    await user.click(within(state).getByRole('radio', { name: 'Everyone' }))
    await waitFor(async () => {
      const switches = await admin.switches()
      expect(switches.ok && switches.value).toEqual([
        { key: 'new-editor', label: 'The new editor', state: 'everyone', groups: [] },
      ])
    })
  })

  it('deletes a feature switch only once asked', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin()
    await admin.saveSwitch({
      key: 'new-editor',
      label: 'The new editor',
      state: 'nobody',
      groups: [],
    })
    await renderApp('/admin?tab=switches', { auth: await signedInAs('admin'), admin })
    await user.click(await screen.findByRole('button', { name: 'Delete switch' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Delete “The new editor”?' })
    await user.click(within(asked).getByRole('button', { name: 'Delete' }))
    expect(await screen.findByText('No switches yet.')).toBeVisible()
  })

  it('says a change was not made offline as offline, not as refused', async () => {
    const user = userEvent.setup()
    let online = true
    const admin = createFakeAdmin({ accounts: [ANA], online: () => online })
    await renderApp('/admin?tab=accounts', { auth: await signedInAs('admin'), admin })
    const role = await screen.findByRole('radiogroup', { name: 'Role for Ana' })
    online = false
    await user.click(within(role).getByRole('radio', { name: 'Editor' }))
    expect(
      (await screen.findAllByText('You’re offline. The Admin area needs a connection.'))[0],
    ).toBeVisible()
    expect(screen.queryByText('The server turned that down.')).toBeNull()
  })

  it('hides a reported song, stops its author, and dismisses the report', async () => {
    const user = userEvent.setup()
    const admin = createFakeAdmin({ reports: [REPORT] })
    await renderApp('/admin?tab=reports', { auth: await signedInAs('admin'), admin })
    await user.click(await screen.findByRole('button', { name: 'Hide' }))
    expect(await screen.findByText('Hidden')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Stop them publishing' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Stop Bo publishing?' })
    expect(admin.blocked.has('bo')).toBe(false)
    await user.click(within(asked).getByRole('button', { name: 'Stop them publishing' }))
    await waitFor(() => expect(admin.blocked.has('bo')).toBe(true))
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(await screen.findByText('No reports.')).toBeVisible()
  })

  it('lists what the admins did', async () => {
    const admin = createFakeAdmin({ accounts: [ANA] })
    await admin.setRole('ana', 'editor')
    await renderApp('/admin?tab=activity', { auth: await signedInAs('admin'), admin })
    expect(await screen.findByText('Role changed')).toBeVisible()
  })

  it('lists the errors devices reported, each with where and its stack', async () => {
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
      ],
    })
    await renderApp('/admin?tab=errors', { auth: await signedInAs('admin'), admin })
    expect(await screen.findByText('Cannot read the score')).toBeVisible()
    expect(screen.getByText('Once, on 1 screen')).toBeVisible()
    expect(screen.getByText(/\/play\/bz5 · build 1\.2\.3/)).toBeVisible()
    await user.click(screen.getByText('Stack'))
    expect(screen.getByText('at draw (score.ts:1)')).toBeVisible()
  })

  it('lists the drafts editors left, the unpublished marked, each opening its editor', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing()
    await content.create('course', 'jazz', {
      body: { id: 'jazz' },
      meta: { title: { en: 'Jazz voicings', ru: 'Джазовые аккорды' } },
    })
    await content.create('piece', 'abide', { body: { id: 'abide' }, meta: { title: 'Abide' } })
    const { router } = await renderApp('/admin?tab=drafts', {
      auth: await signedInAs('admin'),
      contentEditing: content,
    })
    const course = await screen.findByRole('link', { name: /Jazz voicings/ })
    expect(course).toHaveTextContent(/Course · Not published yet/)
    expect(screen.getByRole('link', { name: /Abide/ })).toHaveAttribute(
      'href',
      '/edit/abide?original=true',
    )
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
      await renderApp('/admin', { auth: await signedInAs('admin'), admin })
      // Four calls answer first: under a full run's load they take a while.
      const figures = await screen.findByRole('region', { name: 'This week' }, { timeout: 8000 })
      expect(within(figures).getByText('Accounts').closest('div')).toHaveTextContent(/Accounts\s*1/)
      expect(within(figures).getByText('New this week').closest('div')).toHaveTextContent(
        /New this week\s*1/,
      )
      expect(within(figures).getByText('Reports to look at').closest('div')).toHaveTextContent(
        /Reports to look at\s*1/,
      )
    },
  )

  it('says when no error was reported', async () => {
    await renderApp('/admin?tab=errors', {
      auth: await signedInAs('admin'),
      admin: createFakeAdmin(),
    })
    expect(await screen.findByText('No errors reported.')).toBeVisible()
  })

  it('reads in Russian', async () => {
    await renderApp('/admin?tab=accounts', {
      auth: await signedInAs('admin'),
      admin: createFakeAdmin({ accounts: [ANA] }),
      locale: 'ru',
    })
    await screen.findByRole('radiogroup', { name: 'Роль: Ana' })
    expect(untranslated(document.body)).toEqual([])
  })
})
