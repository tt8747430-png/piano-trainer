import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { say, TOAST_MS } from './say'
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

  it('takes an Undo once: it closes the toast it stood on', async () => {
    const user = userEvent.setup()
    const undo = vi.fn()
    render(<Toaster />)
    act(() => say('“Hymns” archived with its songs', { label: 'Undo', onClick: undo }))
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    expect(undo).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(screen.queryByText('“Hymns” archived with its songs')).toBeNull())
  })

  it('says one thing at a time: a new toast takes the place of the one before', async () => {
    const first = vi.fn()
    render(<Toaster />)
    act(() => say('Moved to Hymns', { label: 'Undo', onClick: first }))
    await screen.findByText('Moved to Hymns')
    act(() => say('Moved to Home'))
    await screen.findByText('Moved to Home')
    await vi.waitFor(() => expect(screen.queryByText('Moved to Hymns')).toBeNull())
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull()
  })

  it('goes by itself after its time, its Undo with it', async () => {
    vi.useFakeTimers()
    try {
      render(<Toaster />)
      act(() => say('Moved to Hymns', { label: 'Undo', onClick: vi.fn() }))
      expect(screen.getByText('Moved to Hymns')).toBeInTheDocument()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(TOAST_MS + 1000)
      })
      expect(screen.queryByText('Moved to Hymns')).toBeNull()
      expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })
})
