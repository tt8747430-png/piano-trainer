import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeCloud } from '@/shared/api/sync'
import { createMemoryStorage } from '../safe-storage'
import { createSyncRunner } from '../sync'
import { AccountProvider, useAccount, useSync } from './account'

const learner = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

function setUp() {
  const auth = createFakeAuth({ accounts: [learner] })
  const cloud = createFakeCloud()
  const sync = createSyncRunner({
    cloud,
    saves: [{ table: 'settings', key: 'pt-settings' }],
    storage: createMemoryStorage(),
    announce: () => {},
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AccountProvider auth={auth} sync={sync}>
      {children}
    </AccountProvider>
  )
  return { auth, cloud, sync, wrapper }
}

describe('AccountProvider', () => {
  it('knows who is signed in, and follows a sign-in and a sign-out', async () => {
    const { auth, wrapper } = setUp()
    const { result } = renderHook(() => useAccount(), { wrapper })
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.account).toBeNull()
    await act(() => auth.signIn(learner.email, learner.password))
    expect(result.current.account?.name).toBe('Ana')
    await act(() => auth.signOut())
    expect(result.current.account).toBeNull()
  })

  it('syncs once a learner signs in, and the waiting changes reach the cloud', async () => {
    const { auth, cloud, sync, wrapper } = setUp()
    sync.storage.setItem('pt-settings', JSON.stringify({ state: { theme: 'dark' }, version: 1 }))
    renderHook(() => useSync(), { wrapper })
    expect(cloud.held.size).toBe(0)
    await act(() => auth.signIn(learner.email, learner.password))
    await waitFor(() => expect(cloud.held.get('settings')?.data).toMatchObject({ theme: 'dark' }))
  })

  it('syncs what a store saves a few seconds after the saving settles, only while signed in', async () => {
    vi.useFakeTimers()
    const { auth, cloud, sync, wrapper } = setUp()
    await auth.signIn(learner.email, learner.password)
    render(<div>app</div>, { wrapper })
    await act(() => vi.runOnlyPendingTimersAsync())
    sync.storage.setItem('pt-settings', JSON.stringify({ state: { theme: 'light' }, version: 1 }))
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(cloud.held.get('settings')).toBeUndefined()
    await act(() => vi.advanceTimersByTimeAsync(4000))
    expect(cloud.held.get('settings')?.data).toMatchObject({ theme: 'light' })
    expect(screen.getByText('app')).toBeInTheDocument()
  })

  it('gives the sync’s state and a way to sync now', async () => {
    const { auth, wrapper } = setUp()
    await auth.signIn(learner.email, learner.password)
    const { result } = renderHook(() => useSync(), { wrapper })
    await act(() => result.current.syncNow())
    expect(result.current.status.lastSynced).not.toBeNull()
  })
})
