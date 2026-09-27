import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChordButton } from './ChordButton'

describe('ChordButton', () => {
  it('shows the chord’s symbol over its numeral, pressed while it plays, ringed when it holds the note', async () => {
    const onClick = vi.fn()
    const { rerender } = render(
      <ChordButton symbol="Dm7" numeral="ii⁷" playing={false} onClick={onClick} />,
    )
    const button = screen.getByRole('button', { name: /^Dm7/ })
    expect(button).toHaveTextContent('ii⁷')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.setup().click(button)
    expect(onClick).toHaveBeenCalledOnce()
    rerender(<ChordButton symbol="Dm7" numeral="ii⁷" playing holds onClick={onClick} />)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-holds')
  })
})
