import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SheetLayoutPicker } from './SheetLayoutPicker'

describe('SheetLayoutPicker', () => {
  it('offers the three layouts as icon radios, each named and saying what it does', () => {
    render(<SheetLayoutPicker value="vertical" onChange={() => {}} />)
    const radios = screen.getAllByRole('radio')
    expect(radios.map((radio) => radio.ariaLabel)).toEqual([
      'Page view',
      'Vertical scroll',
      'Panorama',
    ])
    expect(screen.getByRole('radio', { name: 'Vertical scroll' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Page view' })).toHaveAttribute(
      'title',
      'Page view: Printed A4 pages, as the score will print.',
    )
  })

  it('chooses by a tap, and walks the layouts by the arrows as a radio group does', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SheetLayoutPicker value="page" onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: 'Panorama' }))
    expect(onChange).toHaveBeenLastCalledWith('panorama')
    screen.getByRole('radio', { name: 'Page view' }).focus()
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenLastCalledWith('panorama')
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith('vertical')
  })
})
