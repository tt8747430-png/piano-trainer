import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
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
    // An editor's controls are gone elsewhere too: Learn has no Manage lessons.
    await settings.router.navigate({ to: '/' })
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    expect(screen.queryByRole('link', { name: 'Manage lessons' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Exit' }))
    expect(await screen.findByRole('link', { name: 'Manage lessons' })).toBeInTheDocument()
  })

  it('is not offered to a learner', async () => {
    await renderApp('/settings', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1, name: 'Settings' })
    expect(screen.queryByRole('switch', { name: 'View as a learner' })).toBeNull()
  })
})
