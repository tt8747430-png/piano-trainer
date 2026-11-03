import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { ClickButton } from './ClickButton'

describe('ClickButton (B7)', () => {
  it('toggles the click with the music, pressed while it sounds', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = renderWithSettings(<ClickButton on={false} onChange={onChange} />)
    const button = screen.getByRole('button', { name: 'Metronome' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.click(button)
    expect(onChange).toHaveBeenCalledWith(true)
    rerender(<ClickButton on onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Metronome' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
