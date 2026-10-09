import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

describe('PedalToggle', () => {
  it('puts the sustain down with a tap and up with the next', async () => {
    const user = userEvent.setup()
    const { audio } = setUp()
    const pedal = screen.getByRole('button', { name: 'Pedal' })
    expect(pedal).toHaveAttribute('aria-pressed', 'false')
    await user.click(pedal)
    expect(pedal).toHaveAttribute('aria-pressed', 'true')
    await user.click(pedal)
    expect(pedal).toHaveAttribute('aria-pressed', 'false')
    expect(audio.voice).toEqual([
      { kind: 'pedal', pedal: 'sustain', down: true },
      { kind: 'pedal', pedal: 'sustain', down: false },
    ])
  })

  it('shows down while the MIDI keyboard’s pedal is down', () => {
    const { audio } = setUp()
    act(() => audio.pedal('sustain', true))
    expect(screen.getByRole('button', { name: 'Pedal' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('wears the pedal mark a score prints', () => {
    setUp()
    expect(screen.getByRole('button', { name: 'Pedal' })).toHaveTextContent('\u{1D1AE}')
  })
})
