import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { stubServiceWorker } from '@/shared/test/pwa-register'
import { UpdatePrompt } from './UpdatePrompt'

describe('UpdatePrompt', () => {
  it('stays silent while no new version is waiting', () => {
    render(<UpdatePrompt offer />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('offers a waiting version and installs it only when asked', async () => {
    const { skipWaiting } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    render(<UpdatePrompt offer reload={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('A new version is ready')
    expect(skipWaiting).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Update' }))
    await waitFor(() =>
      expect(skipWaiting).toHaveBeenCalledExactlyOnceWith({ type: 'SKIP_WAITING' }),
    )
    expect(screen.getByRole('button', { name: 'Restarting…' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Later' })).not.toBeInTheDocument()
  })

  it('reloads onto a version another tab took only once it may offer it again', () => {
    const { registeredWith } = stubServiceWorker({ waiting: true })
    const reload = vi.fn()
    const { rerender } = render(<UpdatePrompt offer={false} reload={reload} />)
    act(() => registeredWith().onNeedReload?.())
    expect(reload).not.toHaveBeenCalled()
    rerender(<UpdatePrompt offer reload={reload} />)
    expect(reload).toHaveBeenCalledOnce()
  })

  it('keeps a waiting version to itself while it may not offer it', () => {
    stubServiceWorker({ waiting: true })
    render(<UpdatePrompt offer={false} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('registers once the page has loaded, and looks for a new version on each return', () => {
    const { update, registeredWith } = stubServiceWorker({ waiting: false })
    render(<UpdatePrompt offer />)
    expect(registeredWith().immediate).toBe(false)
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    document.dispatchEvent(new Event('visibilitychange'))
    expect(update).toHaveBeenCalledOnce()
  })

  it('goes away when put off, without updating', async () => {
    const { skipWaiting } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    render(<UpdatePrompt offer />)
    await user.click(screen.getByRole('button', { name: 'Later' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(skipWaiting).not.toHaveBeenCalled()
  })

  it('comes back after Later once the app returns to the screen, the version still waiting', async () => {
    stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    render(<UpdatePrompt offer />)
    await user.click(screen.getByRole('button', { name: 'Later' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    act(() => void document.dispatchEvent(new Event('visibilitychange')))
    expect(screen.getByRole('status')).toHaveTextContent('A new version is ready')
  })
})
