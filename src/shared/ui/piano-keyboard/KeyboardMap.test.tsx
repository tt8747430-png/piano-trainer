import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { stubBox, stubScrolling } from '@/shared/test/layout'
import { PianoKeyboard } from './PianoKeyboard'

const ONE_OCTAVE = { from: midi(60), to: midi(71) }

describe('the keyboard map', () => {
  it('is a slider of the keys in view, stepped an octave by the arrow keys', async () => {
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    const user = userEvent.setup()
    render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} map />)
    const map = screen.getByRole('slider', { name: 'Keys in view' })
    // Opened centred on C4–B4: 547px scrolled, G3 to E5 wholly in view.
    expect(map).toHaveAttribute('aria-valuetext', 'G3 to E5')
    map.focus()
    await user.keyboard('{ArrowRight}')
    expect(scrolls.at(-1)).toBeCloseTo(547 + 7 * 28)
    await user.keyboard('{Home}')
    expect(scrolls.at(-1)).toBe(0)
  })

  it('moves the view to the point tapped on it', () => {
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} map />)
    const map = screen.getByRole('slider', { name: 'Keys in view' })
    stubBox(map, { width: 520, height: 44 })
    fireEvent.pointerDown(map, { pointerId: 1, pointerType: 'touch', clientX: 260, clientY: 20 })
    expect(scrolls.at(-1)).toBe(0.5 * 52 * 28 - 195)
  })

  it('is hidden unless asked for', () => {
    render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} />)
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
  })
})
