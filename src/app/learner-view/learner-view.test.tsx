import { act, screen, waitFor } from '@testing-library/react'
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

describe('Learner view (R29 B5)', () => {
  it('shows an editor the app as a learner sees it, with Exit, and saves nothing', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const auth = await signedInAs('admin')
    const settings = await renderApp('/settings', { auth, storage })
    const saved = () =>
      Array.from({ length: storage.length }, (_, at) => storage.key(at))
        .map((key) => `${key}=${storage.getItem(key ?? '')}`)
        .join('|')
    expect(await screen.findByRole('link', { name: /^Admin/ })).toBeInTheDocument()
    const before = saved()
    await user.click(screen.getByRole('switch', { name: 'View as a learner' }))
    // A learner's Settings: no Admin; the notice over every screen says so, with Exit.
    await waitFor(() => expect(screen.queryByRole('link', { name: /^Admin/ })).toBeNull())
    expect(screen.getByRole('status')).toHaveTextContent('Viewing as a learner')
    expect(saved()).toBe(before)
    // An editor's controls are gone elsewhere too: Learn has no Edit.
    await settings.router.navigate({ to: '/' })
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Exit' }))
    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('is not offered to a learner', async () => {
    await renderApp('/settings', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1, name: 'Settings' })
    expect(screen.queryByRole('switch', { name: 'View as a learner' })).toBeNull()
  })
  it('turns on from the Admin area and opens Learn', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/admin', { auth: await signedInAs('admin') })
    await user.click(await screen.findByRole('button', { name: 'View as a learner' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(await screen.findByRole('status')).toHaveTextContent('Viewing as a learner')
  })

  it('shows no editor or admin control on the screens that have them', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings', { auth: await signedInAs('admin') })
    await user.click(await screen.findByRole('switch', { name: 'View as a learner' }))
    await screen.findByRole('status')
    expect(screen.queryByRole('link', { name: /^Admin/ })).toBeNull()
    const lesson = LESSONS[0]!
    const walk: [string, { role: 'link' | 'button'; name: string }[]][] = [
      ['/', [{ role: 'button', name: 'Edit' }]],
      ['/?view=courses', [{ role: 'button', name: 'Edit' }]],
      ['/?view=courses&edit=1', [{ role: 'button', name: 'New course' }]],
      [`/lessons/${lesson.id}`, [{ role: 'button', name: 'Edit' }]],
      ['/practice/progressions', [{ role: 'button', name: 'New progression' }]],
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
    const first = await renderApp('/settings', { auth, storage })
    await user.click(await screen.findByRole('switch', { name: 'View as a learner' }))
    await screen.findByRole('status')
    first.unmount()
    await renderApp('/settings', { auth, storage })
    expect(await screen.findByRole('link', { name: /^Admin/ })).toBeInTheDocument()
    expect(screen.queryByText('Viewing as a learner')).toBeNull()
  })
})
