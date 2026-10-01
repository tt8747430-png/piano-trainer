import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Listbox, type ListboxGroup } from './Listbox'

function setUp() {
  const chosen = vi.fn()
  const groups: ListboxGroup[] = [
    {
      label: 'Your own pace',
      options: [
        { key: 'wait', selected: false, content: 'Wait mode', onChoose: () => chosen('wait') },
      ],
    },
    {
      label: 'Listen and play along',
      options: [
        { key: '100', selected: true, content: 'Original tempo', onChoose: () => chosen('100') },
        {
          key: '50',
          selected: false,
          disabled: true,
          content: '50% speed',
          onChoose: () => chosen('50'),
        },
      ],
    },
  ]
  render(<Listbox label="Tempo" groups={groups} />)
  return { chosen }
}

describe('Listbox', () => {
  it('is one choice of several: the chosen option selected, one tab stop on it', () => {
    setUp()
    expect(screen.getByRole('listbox', { name: 'Tempo' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Listen and play along' })).toBeInTheDocument()
    const own = screen.getByRole('option', { name: 'Original tempo' })
    expect(own).toHaveAttribute('aria-selected', 'true')
    expect(own).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('option', { name: 'Wait mode' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves with the arrows, Home and End, and chooses with Enter, Space or a tap', async () => {
    const user = userEvent.setup()
    const { chosen } = setUp()
    screen.getByRole('option', { name: 'Original tempo' }).focus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('option', { name: 'Wait mode' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('option', { name: '50% speed' })).toHaveFocus()
    await user.keyboard('{Home}{Enter}')
    expect(chosen).toHaveBeenLastCalledWith('wait')
    await user.keyboard('{ArrowDown} ')
    expect(chosen).toHaveBeenLastCalledWith('100')
    await user.click(screen.getByRole('option', { name: 'Wait mode' }))
    expect(chosen).toHaveBeenCalledTimes(3)
  })

  it('keeps a closed option reachable, saying so, and never chooses it', async () => {
    const user = userEvent.setup()
    const { chosen } = setUp()
    const closed = screen.getByRole('option', { name: '50% speed' })
    expect(closed).toHaveAttribute('aria-disabled', 'true')
    await user.click(closed)
    closed.focus()
    await user.keyboard('{Enter}')
    expect(chosen).not.toHaveBeenCalled()
  })
})
