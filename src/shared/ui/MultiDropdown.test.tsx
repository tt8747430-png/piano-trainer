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

  it('lists groups under their labels, each item named by its title, its second word shown', async () => {
    const user = userEvent.setup()
    render(
      <MultiDropdown
        label="Chord types"
        value={['m9']}
        groups={[
          {
            label: 'Triads',
            options: [{ value: 'maj', label: 'M', title: 'Major triad', detail: 'Major triad' }],
          },
          {
            label: '9ths & more',
            options: [{ value: 'm9', label: 'm9', title: 'Minor 9th', detail: 'Minor 9th' }],
          },
        ]}
        onChange={vi.fn()}
      />,
    )
    const button = screen.getByRole('combobox', { name: 'Chord types' })
    expect(button).toHaveTextContent('Chord typesm9')
    await user.click(button)
    // The list is hidden until it is placed: wait for its options to be there for a reader.
    expect(await screen.findByRole('option', { name: 'Minor 9th' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('Triads')).toBeInTheDocument()
    expect(screen.getByText('9ths & more')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Major triad' })).toHaveTextContent('M Major triad')
  })
})
