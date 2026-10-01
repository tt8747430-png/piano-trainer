import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PlayToggle } from './PlayToggle'

describe('PlayToggle', () => {
  it('plays what it holds, pressed with a stop mark while it sounds', async () => {
    const onClick = vi.fn()
    const { rerender } = render(
      <PlayToggle playing={false} onClick={onClick}>
        G7
      </PlayToggle>,
    )
    const button = screen.getByRole('button', { name: 'G7' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button.querySelector('svg')).toBeNull()
    await userEvent.setup().click(button)
    expect(onClick).toHaveBeenCalledOnce()
    rerender(
      <PlayToggle playing onClick={onClick}>
        G7
      </PlayToggle>,
    )
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden')
  })
})
