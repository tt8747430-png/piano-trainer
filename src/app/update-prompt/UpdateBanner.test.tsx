import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UpdateBanner } from './UpdateBanner'

describe('UpdateBanner', () => {
  it('announces the waiting version and updates on request', async () => {
    const onUpdate = vi.fn()
    const user = userEvent.setup()
    render(<UpdateBanner onUpdate={onUpdate} onLater={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('A new version is ready')
    await user.click(screen.getByRole('button', { name: 'Update' }))
    expect(onUpdate).toHaveBeenCalledOnce()
  })

  it('can be put off', async () => {
    const onLater = vi.fn()
    const user = userEvent.setup()
    render(<UpdateBanner onUpdate={vi.fn()} onLater={onLater} />)
    await user.click(screen.getByRole('button', { name: 'Later' }))
    expect(onLater).toHaveBeenCalledOnce()
  })
})
