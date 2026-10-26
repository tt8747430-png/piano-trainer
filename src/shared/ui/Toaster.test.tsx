import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { say } from './say'
import { Toaster } from './Toaster'

describe('Toaster', () => {
  it('says what was done, politely, with its action and its Close', async () => {
    const user = userEvent.setup()
    const undo = vi.fn()
    render(<Toaster />)
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveAttribute(
      'aria-live',
      'polite',
    )
    act(() => say('“Silent Night” archived', { label: 'Undo', onClick: undo }))
    expect(await screen.findByText('“Silent Night” archived')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(undo).toHaveBeenCalledOnce()
  })

  it('goes at its Close', async () => {
    const user = userEvent.setup()
    render(<Toaster />)
    act(() => say('Moved to Hymns'))
    await screen.findByText('Moved to Hymns')
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull()
    // Base UI keeps a toast's Close from a screen reader, which reaches the toasts by F6.
    const close = document.querySelector('[data-slot="toast-close"]')
    if (!(close instanceof HTMLElement)) throw new Error('a toast has its Close')
    expect(close).toHaveAttribute('aria-label', 'Close')
    await user.click(close)
    await vi.waitFor(() => expect(screen.queryByText('Moved to Hymns')).toBeNull())
  })
})
