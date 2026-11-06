import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PianoHands } from './PianoHands'

const props = {
  notes: [],
  perSecond: 960,
  now: () => 0,
  playing: false,
  held: new Set<never>(),
  marks: new Map(),
  wrong: undefined,
  faded: null,
  skin: 'medium-light',
  range: null,
} as const

describe('PianoHands (R36, the hands at the keys)', () => {
  it('stands in the keys’ place as a figure, busy while the hands load', () => {
    render(<PianoHands {...props} height={180} onShowKeys={() => {}} />)
    const figure = screen.getByRole('figure', { name: 'Hands at the keys' })
    expect(figure).toHaveAttribute('aria-busy', 'true')
    expect(figure).toHaveStyle({ height: '180px' })
    expect(figure).toHaveAccessibleDescription('Getting the hands ready…')
  })

  it('says where the device cannot draw the hands, and offers the keys', async () => {
    const user = userEvent.setup()
    const onShowKeys = vi.fn()
    // A device without WebGL: three says so as it gives up, which the test keeps quiet.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<PianoHands {...props} height={undefined} onShowKeys={onShowKeys} />)
    expect(await screen.findByText('This device can’t draw the hands.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show the keys' }))
    expect(onShowKeys).toHaveBeenCalledOnce()
  })
})
