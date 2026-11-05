import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PickerLayoutContext } from './picker-layout'
import { TimeSignatureField } from './time-signature-field'

describe('TimeSignatureField (R31-E, the owner’s ruling)', () => {
  it('has the common meters as tiles, the one in force pressed, none the song cannot take (R32-B)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TimeSignatureField
        value={{ meter: '4/4', symbol: false }}
        onChange={onChange}
        barred={(meter) => meter === '6/8'}
      />,
    )
    const tiles = within(screen.getByRole('group', { name: 'Time signature' })).getAllByRole(
      'button',
    )
    expect(tiles.map((tile) => tile.getAttribute('aria-label'))).toEqual([
      '2/2',
      '2/4',
      '3/4',
      '4/4',
      '9/8',
      '12/8',
    ])
    expect(tiles[0]?.querySelectorAll('[data-smufl]')).toHaveLength(2)
    expect(screen.getByRole('button', { name: '4/4' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('button', { name: '6/8' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '9/8' }))
    expect(onChange).toHaveBeenLastCalledWith({ meter: '9/8', symbol: false })
  })

  it('turns Current’s figures as wheels: any count of one to sixteen over a whole to a sixteenth', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TimeSignatureField value={{ meter: '7/8', symbol: false }} onChange={onChange} />)
    const current = screen.getByRole('group', { name: 'Current' })
    const beats = within(current).getByRole('spinbutton', { name: 'Beats' })
    const unit = within(current).getByRole('spinbutton', { name: 'Beat unit' })
    expect(beats).toHaveAttribute('aria-valuenow', '7')
    expect(beats).toHaveAttribute('aria-valuemax', '16')
    expect(unit).toHaveAttribute('aria-valuenow', '8')
    expect(unit).toHaveAttribute('aria-valuemin', '1')
    expect(unit).toHaveAttribute('aria-valuemax', '16')
    beats.focus()
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith({ meter: '8/8', symbol: false })
    await user.keyboard('{End}')
    expect(onChange).toHaveBeenLastCalledWith({ meter: '16/8', symbol: false })
    unit.focus()
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith({ meter: '7/16', symbol: false })
    await user.keyboard('{Home}')
    expect(onChange).toHaveBeenLastCalledWith({ meter: '7/1', symbol: false })
    // A drag down brings the faded figure above into place: the one before.
    fireEvent.pointerDown(beats, { clientY: 100, pointerId: 1 })
    fireEvent.pointerMove(beats, { clientY: 130, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith({ meter: '6/8', symbol: false })
    fireEvent.pointerUp(beats, { clientY: 130, pointerId: 1 })
  })

  it('has a pickup wheel of a beat short of a bar at most, and none where the caller has none', async () => {
    const user = userEvent.setup()
    const onPickup = vi.fn()
    const { unmount } = render(
      <TimeSignatureField
        value={{ meter: '3/4', symbol: false }}
        onChange={vi.fn()}
        pickup={{ beats: 0, onChange: onPickup }}
      />,
    )
    const pickup = within(screen.getByRole('group', { name: 'Pickup' })).getByRole('spinbutton', {
      name: 'Pickup beats',
    })
    expect(pickup).toHaveAttribute('aria-valuemax', '2')
    expect(pickup).toHaveAttribute('aria-valuetext', '–')
    pickup.focus()
    await user.keyboard('{ArrowUp}')
    expect(onPickup).toHaveBeenLastCalledWith(1)
    unmount()
    render(<TimeSignatureField value={{ meter: '6/8', symbol: false }} onChange={vi.fn()} />)
    expect(screen.queryByRole('group', { name: 'Pickup' })).not.toBeInTheDocument()
  })

  it('writes 4/4 and 2/2 as common or cut time from its switch, shown for those alone (R32-B)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <TimeSignatureField value={{ meter: '2/2', symbol: false }} onChange={onChange} />,
    )
    await user.click(screen.getByRole('switch', { name: 'Write as common or cut time' }))
    expect(onChange).toHaveBeenLastCalledWith({ meter: '2/2', symbol: true })
    rerender(<TimeSignatureField value={{ meter: '5/4', symbol: false }} onChange={onChange} />)
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
  })

  it('in a row, its tiles alone', () => {
    render(
      <PickerLayoutContext value="row">
        <TimeSignatureField value={{ meter: '4/4', symbol: false }} onChange={vi.fn()} />
      </PickerLayoutContext>,
    )
    expect(screen.getByRole('group', { name: 'Time signature' })).toBeInTheDocument()
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
  })
})
