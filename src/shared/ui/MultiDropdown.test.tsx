import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MultiDropdown } from './MultiDropdown'

const SIGNS = [
  { value: 'b9', label: '♭9' },
  { value: 's9', label: '#9' },
  { value: 's11', label: '#11' },
] as const

describe('MultiDropdown', () => {
  it('shows its label and each chosen value, or none', () => {
    const { rerender } = render(
      <MultiDropdown
        label="Alterations"
        none="None"
        value={[]}
        options={SIGNS}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('combobox', { name: 'Alterations' })).toHaveTextContent(
      'AlterationsNone',
    )
    rerender(
      <MultiDropdown
        label="Alterations"
        none="None"
        value={['b9', 's11']}
        options={SIGNS}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('combobox', { name: 'Alterations' })).toHaveTextContent(
      'Alterations♭9 #11',
    )
  })

  it('checks each chosen item, and a tap turns one on or off', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiDropdown
        label="Alterations"
        none="None"
        value={['b9']}
        options={SIGNS}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('combobox', { name: 'Alterations' }))
    expect(await screen.findByRole('option', { name: '♭9' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await user.click(screen.getByRole('option', { name: '#11' }))
    expect(onChange).toHaveBeenLastCalledWith(['b9', 's11'])
    await user.click(screen.getByRole('option', { name: '♭9' }))
    expect(onChange).toHaveBeenLastCalledWith([])
  })
})
