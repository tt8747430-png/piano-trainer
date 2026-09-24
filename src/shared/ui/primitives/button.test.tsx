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
})
