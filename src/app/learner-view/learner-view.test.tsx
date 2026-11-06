import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { LESSONS } from '@/entities/lesson'
import { createMemoryStorage } from '@/shared/lib'

const OWNER = { email: 'owner@example.com', name: 'Owner', password: 'correct horse' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

describe('Preview as learner (R29 B5, R32: on the Account)', () => {
  it('shows an editor the app as a learner sees it, with Exit, and saves nothing', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const auth = await signedInAs('admin')
    const settings = await renderApp('/settings/account', { auth, storage })
    const saved = () =>
      Array.from({ length: storage.length }, (_, at) => storage.key(at))
        .map((key) => `${key}=${storage.getItem(key ?? '')}`)
        .join('|')
    const preview = await screen.findByRole('switch', { name: 'Preview as learner' })
    const before = saved()
    await user.click(preview)
    // The notice over every screen says so, with Exit; the role stays said beside the switch.
    expect(await screen.findByText('Previewing as learner')).toBeVisible()
    expect(screen.getByRole('region', { name: 'Editorial access' })).toHaveTextContent(
      'Administrator',
    )
    expect(saved()).toBe(before)
    // A learner's Settings: no Administration.
    await settings.router.navigate({ to: '/settings' })
    await screen.findByRole('region', { name: 'App' })
    expect(screen.queryByRole('link', { name: /^Administration/ })).toBeNull()
    // An editor's controls are gone elsewhere too: Learn has no Edit.
    await settings.router.navigate({ to: '/' })
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Exit' }))
    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('is not offered to a learner, and lives on the Account alone', async () => {
    const { unmount } = await renderApp('/settings/account', {
      auth: await signedInAs('learner'),
    })
    await screen.findByRole('heading', { level: 1, name: 'Account' })
    expect(screen.queryByRole('switch', { name: 'Preview as learner' })).toBeNull()
    expect(screen.queryByRole('region', { name: 'Editorial access' })).toBeNull()
    unmount()
    // One way to it (R32): neither Settings' list nor Administration has a second.
    const admin = await signedInAs('admin')
    const settings = await renderApp('/settings', { auth: admin })
    await screen.findByRole('link', { name: /^Administration/ })
    expect(screen.queryByRole('switch', { name: 'Preview as learner' })).toBeNull()
    await act(() => settings.router.navigate({ to: '/admin' }))
    await screen.findByRole('heading', { level: 1, name: 'Administration' })
    expect(screen.queryByRole('button', { name: 'Preview as learner' })).toBeNull()
  })

  it('shows no editor or admin control on the screens that have them', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings/account', { auth: await signedInAs('admin') })
    await user.click(await screen.findByRole('switch', { name: 'Preview as learner' }))
    await screen.findByText('Previewing as learner')
    const lesson = LESSONS[0]!
    const walk: [string, { role: 'link' | 'button'; name: string }[]][] = [
      ['/', [{ role: 'button', name: 'Edit' }]],
      ['/?view=courses', [{ role: 'button', name: 'Edit' }]],
      // The shelves' Edit mode is not opened (Your courses' New course is every learner's, R30-5).
      ['/?view=courses&edit=1', [{ role: 'button', name: 'Done' }]],
      [`/lessons/${lesson.id}`, [{ role: 'button', name: 'Edit' }]],
      ['/practice/progressions', [{ role: 'button', name: 'New in the library' }]],
    ]
    for (const [path, controls] of walk) {
      await act(() => router.navigate({ href: path }))
      await screen.findAllByRole('heading', { level: 1 })
      for (const control of controls) {
        expect(screen.queryByRole(control.role, { name: control.name })).toBeNull()
      }
    }
  })

  it('ends with a reload', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const auth = await signedInAs('admin')
    const first = await renderApp('/settings/account', { auth, storage })
    await user.click(await screen.findByRole('switch', { name: 'Preview as learner' }))
    await screen.findByText('Previewing as learner')
    first.unmount()
    await renderApp('/settings', { auth, storage })
    expect(await screen.findByRole('link', { name: /^Administration/ })).toBeInTheDocument()
    expect(screen.queryByText('Previewing as learner')).toBeNull()
  })
})
