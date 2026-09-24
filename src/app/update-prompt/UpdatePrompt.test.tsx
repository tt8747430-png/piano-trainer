import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { stubServiceWorker } from '@/shared/test/pwa-register'
import { UpdatePrompt } from './UpdatePrompt'

describe('UpdatePrompt', () => {
  it('stays silent while no new version is waiting', () => {
    render(<UpdatePrompt />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('offers a waiting version and installs it only when asked', async () => {
    const { updateServiceWorker } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    render(<UpdatePrompt />)
    expect(screen.getByRole('status')).toHaveTextContent('A new version is ready')
    expect(updateServiceWorker).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Update' }))
    expect(updateServiceWorker).toHaveBeenCalledExactlyOnceWith(true)
  })

  it('goes away when put off, without updating', async () => {
    const { updateServiceWorker } = stubServiceWorker({ waiting: true })
    const user = userEvent.setup()
    render(<UpdatePrompt />)
    await user.click(screen.getByRole('button', { name: 'Later' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(updateServiceWorker).not.toHaveBeenCalled()
  })
})
