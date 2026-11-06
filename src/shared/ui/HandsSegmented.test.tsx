import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HandsSegmented } from './HandsSegmented'

describe('HandsSegmented', () => {
  it('offers the hands as they sit at the keys: Left, Both, Right', () => {
    render(<HandsSegmented label="Hands" value="both" onChange={vi.fn()} />)
    expect(screen.getAllByRole('radio').map((radio) => radio.textContent)).toEqual([
      'Left',
      'Both',
      'Right',
    ])
    expect(screen.getByRole('radio', { name: 'Both' })).toBeChecked()
  })

  it('keeps the keys’ order for the hands it is given', () => {
    render(<HandsSegmented label="Hands" value="rh" hands={['rh', 'both']} onChange={vi.fn()} />)
    expect(screen.getAllByRole('radio').map((radio) => radio.textContent)).toEqual([
      'Both',
      'Right',
    ])
  })

  it('paints each hand’s swatch only when the keys wear the hands’ colours', () => {
    const { container, rerender } = render(
      <HandsSegmented label="Hands" value="lh" onChange={vi.fn()} />,
    )
    expect(container.querySelectorAll('.bg-hand-rh, .bg-hand-lh-wash')).toHaveLength(0)
    rerender(<HandsSegmented label="Hands" value="lh" onChange={vi.fn()} painted />)
    // Left one, Both two, Right one.
    expect(container.querySelectorAll('.bg-hand-rh')).toHaveLength(2)
    expect(container.querySelectorAll('.bg-hand-lh-wash')).toHaveLength(2)
  })

  it('chooses a hand on tap', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<HandsSegmented label="Hands" value="both" onChange={onChange} painted />)
    await user.click(screen.getByRole('radio', { name: 'Right' }))
    expect(onChange).toHaveBeenCalledWith('rh')
  })
})
