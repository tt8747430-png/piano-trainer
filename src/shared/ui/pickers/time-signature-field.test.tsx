import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TimeSignatureField } from './time-signature-field'

describe('TimeSignatureField (A34)', () => {
  it('any n/unit; tiles; pickup; apply to', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onPickup = vi.fn()
    const onApply = vi.fn()
    render(
      <TimeSignatureField
        value={{ meter: '4/4', symbol: false }}
        onChange={onChange}
        barred={(meter) => meter === '3/2'}
        pickup={{ beats: 0, most: 3, onChange: onPickup }}
        applyTo={{ value: 'from', onChange: onApply }}
      />,
    )
    // Flat's tiles, engraved, C and ¢ among them; the one in force pressed; one the song cannot take greyed.
    const tiles = within(screen.getByRole('group', { name: 'Time signature' })).getAllByRole(
      'button',
    )
    expect(tiles.map((tile) => tile.getAttribute('aria-label'))).toEqual([
      '2/4',
      '3/4',
      '4/4',
      'Common time, C',
      'Cut time, ¢',
      '3/8',
      '6/8',
      '9/8',
      '12/8',
      '5/4',
      '7/8',
      '3/2',
      '2/2',
    ])
    expect(screen.getByRole('button', { name: '4/4' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '3/2' })).toBeDisabled()
    expect(tiles[0]?.querySelectorAll('[data-smufl]')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Common time, C' }))
    expect(onChange).toHaveBeenLastCalledWith({ meter: '4/4', symbol: true })
    // Other: any count over any unit the score counts in.
    await user.click(screen.getByRole('button', { name: 'One beat more' }))
    expect(onChange).toHaveBeenLastCalledWith({ meter: '5/4', symbol: false })
    const beats = screen.getByRole('textbox', { name: 'Beats' })
    await user.clear(beats)
    await user.type(beats, '11{Enter}')
    expect(onChange).toHaveBeenLastCalledWith({ meter: '11/4', symbol: false })
    // The pickup in beats, none at 0.
    expect(screen.getByRole('textbox', { name: 'Pickup' })).toHaveValue('0')
    await user.click(screen.getByRole('button', { name: 'Longer pickup' }))
    expect(onPickup).toHaveBeenLastCalledWith(1)
    // Apply to: from this bar or the whole song.
    await user.click(screen.getByRole('radio', { name: 'Whole song' }))
    expect(onApply).toHaveBeenLastCalledWith('whole')
  })

  it('leaves Pickup and Apply to out where the caller has none', () => {
    render(<TimeSignatureField value={{ meter: '6/8', symbol: false }} onChange={vi.fn()} />)
    expect(screen.queryByRole('textbox', { name: 'Pickup' })).not.toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: 'Apply to' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '6/8' })).toHaveAttribute('aria-pressed', 'true')
  })
})
