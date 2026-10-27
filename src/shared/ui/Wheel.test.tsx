import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Wheel, type WheelOption } from './Wheel'

const BEATS: readonly WheelOption<number>[] = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 6, label: '6', disabled: true },
  { value: 12, label: '12' },
]

function Beats({ onChange = () => {} }: { onChange?: (value: number) => void }) {
  const [value, setValue] = useState(3)
  return (
    <Wheel
      label="Beat"
      options={BEATS}
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

describe('Wheel', () => {
  it('is a spin button named by its label, saying its value', () => {
    render(<Beats />)
    const wheel = screen.getByRole('spinbutton', { name: 'Beat' })
    expect(wheel).toHaveAttribute('aria-valuetext', '3')
    expect(wheel).toHaveAttribute('aria-valuenow', '3')
  })

  it('steps with the arrows, past a value it cannot take, and goes to its ends with Home and End', async () => {
    const user = userEvent.setup()
    render(<Beats />)
    const wheel = screen.getByRole('spinbutton', { name: 'Beat' })
    wheel.focus()
    await user.keyboard('{ArrowUp}')
    expect(wheel).toHaveAttribute('aria-valuetext', '4')
    await user.keyboard('{ArrowUp}')
    expect(wheel).toHaveAttribute('aria-valuetext', '12')
    await user.keyboard('{ArrowUp}')
    expect(wheel).toHaveAttribute('aria-valuetext', '12')
    await user.keyboard('{Home}')
    expect(wheel).toHaveAttribute('aria-valuetext', '2')
    await user.keyboard('{ArrowDown}')
    expect(wheel).toHaveAttribute('aria-valuetext', '2')
    await user.keyboard('{End}')
    expect(wheel).toHaveAttribute('aria-valuetext', '12')
  })

  it('takes a value typed into it, its digits one after the other', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Beats onChange={onChange} />)
    screen.getByRole('spinbutton', { name: 'Beat' }).focus()
    await user.keyboard('12')
    expect(onChange).toHaveBeenLastCalledWith(12)
    await user.keyboard('6')
    // 6 is greyed: typed, nothing changes.
    expect(onChange).toHaveBeenLastCalledWith(12)
  })

  it('takes a value tapped, never a greyed one', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Beats onChange={onChange} />)
    const wheel = screen.getByRole('spinbutton', { name: 'Beat' })
    await user.click(wheel.querySelector('[data-value="4"]')!)
    expect(onChange).toHaveBeenLastCalledWith(4)
    await user.click(wheel.querySelector('[data-value="6"]')!)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
