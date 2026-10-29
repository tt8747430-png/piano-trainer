import { act, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SETTINGS_VERSION } from '@/entities/settings'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeCloud } from '@/shared/api/sync'
import { renderApp } from './testing/render-app'

const learner = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

describe('the app’s sync', () => {
  it('keeps everything on the device while signed out, and carries it to the cloud on sign-in', async () => {
    const auth = createFakeAuth({ accounts: [learner] })
    const cloud = createFakeCloud()
    const { settingsStore } = await renderApp('/', { auth, cloud })
    act(() => settingsStore.setState({ theme: 'dark' }))
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(cloud.held.size).toBe(0)
    await act(() => auth.signIn(learner.email, learner.password))
    await waitFor(() => expect(cloud.held.get('settings')?.data).toMatchObject({ theme: 'dark' }))
  })

  it('brings another device’s settings into this one’s screens', async () => {
    const auth = createFakeAuth({ accounts: [learner] })
    const cloud = createFakeCloud()
    await cloud.push(
      'settings',
      {
        id: 'state',
        data: { theme: 'light', _version: SETTINGS_VERSION },
        updatedAt: '2026-10-29T10:00:00.000Z',
        deleted: false,
      },
      null,
    )
    const { settingsStore } = await renderApp('/', { auth, cloud })
    await act(() => auth.signIn(learner.email, learner.password))
    await waitFor(() => expect(settingsStore.getState().theme).toBe('light'))
  })
})
