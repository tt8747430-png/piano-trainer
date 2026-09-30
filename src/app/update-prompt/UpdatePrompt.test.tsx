import { render, screen } from '@testing-library/react'
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
    const { updateServiceWorker } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    render(<UpdatePrompt offer />)
    expect(screen.getByRole('status')).toHaveTextContent('A new version is ready')
    expect(updateServiceWorker).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Update' }))
    expect(updateServiceWorker).toHaveBeenCalledExactlyOnceWith(true)
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
    const { updateServiceWorker } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    render(<UpdatePrompt offer />)
    await user.click(screen.getByRole('button', { name: 'Later' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(updateServiceWorker).not.toHaveBeenCalled()
  })
})
