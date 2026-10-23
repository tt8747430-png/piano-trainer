import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ToolKey } from './ToolKey'

describe('ToolKey', () => {
  it('is a key named by its label, on or off as a toggle, greyed out of reach', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <>
        <ToolKey label="Quarter note" pressed onClick={onClick}>
          ♩
        </ToolKey>
        <ToolKey label="Rest" span="wide">
          𝄽
        </ToolKey>
        <ToolKey label="Dotted" disabled>
          .
        </ToolKey>
      </>,
    )
    const quarter = screen.getByRole('button', { name: 'Quarter note' })
    expect(quarter).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Rest' })).not.toHaveAttribute('aria-pressed')
    expect(screen.getByRole('button', { name: 'Rest' })).toHaveClass('col-span-2')
    expect(screen.getByRole('button', { name: 'Dotted' })).toBeDisabled()
    await user.click(quarter)
    expect(onClick).toHaveBeenCalledOnce()
  })
})
