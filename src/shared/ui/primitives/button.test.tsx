import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('is a button that reports a press', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Play</Button>)
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('ignores presses while disabled', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button disabled onClick={onClick}>
        Play
      </Button>,
    )
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('offers a round surface button and a mint soft button, both at least 44px', () => {
    render(
      <>
        <Button variant="surface" size="icon" aria-label="Settings" />
        <Button variant="soft">Arpeggio</Button>
        <Button size="pill">Next</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveClass('rounded-full', 'size-11')
    expect(screen.getByRole('button', { name: 'Arpeggio' })).toHaveClass('bg-secondary', 'h-11')
    expect(screen.getByRole('button', { name: 'Next' })).toHaveClass('h-14', 'rounded-full')
  })
})
