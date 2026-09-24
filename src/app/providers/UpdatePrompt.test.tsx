import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdatePrompt } from './UpdatePrompt'

/** A service worker registration whose waiting version each test sets. */
const sw = vi.hoisted(() => ({
  waiting: false,
  updateServiceWorker: vi.fn(async (_reloadPage?: boolean) => {}),
}))

vi.mock('virtual:pwa-register/react', async () => {
  const { useState } = await import('react')
  return {
    useRegisterSW: () => ({
      needRefresh: useState(sw.waiting),
      offlineReady: useState(false),
      updateServiceWorker: sw.updateServiceWorker,
    }),
  }
})

beforeEach(() => {
  sw.waiting = false
  sw.updateServiceWorker.mockClear()
})

describe('UpdatePrompt', () => {
  it('stays silent while no new version is waiting', () => {
    render(<UpdatePrompt />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('offers a waiting version and installs it only when asked', async () => {
    sw.waiting = true
    const user = userEvent.setup()
    render(<UpdatePrompt />)
    expect(screen.getByRole('status')).toHaveTextContent('A new version is ready')
    expect(sw.updateServiceWorker).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Update' }))
    expect(sw.updateServiceWorker).toHaveBeenCalledExactlyOnceWith(true)
  })

  it('goes away when put off, without updating', async () => {
    sw.waiting = true
    const user = userEvent.setup()
    render(<UpdatePrompt />)
    await user.click(screen.getByRole('button', { name: 'Later' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(sw.updateServiceWorker).not.toHaveBeenCalled()
  })
})
