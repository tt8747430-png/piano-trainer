import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('holds the sustain on its own beside the MIDI foot, lifting only its own hold', async () => {
    const user = userEvent.setup()
    const { audio } = setUp()
    const pedal = screen.getByRole('button', { name: 'Pedal' })
    act(() => audio.pedal('sustain', true))
    await user.click(pedal)
    expect(audio.pedals().sustain).toBe(true)
    act(() => audio.pedal('sustain', false))
    expect(pedal).toHaveAttribute('aria-pressed', 'true')
    await user.click(pedal)
    expect(pedal).toHaveAttribute('aria-pressed', 'false')
  })

  it('draws the pedal as an icon with its name, not the 𝆮 glyph (R29 A26)', () => {
    setUp()
    const pedal = screen.getByRole('button', { name: 'Pedal' })
    expect(pedal.querySelector('svg')).not.toBeNull()
    expect(pedal).toHaveTextContent('Sustain')
    expect(pedal).not.toHaveTextContent('\u{1D1AE}')
  })

  it('lets its own hold up when the page hides, leaving the MIDI foot’s alone (R29 A26)', async () => {
    const user = userEvent.setup()
    const { audio } = setUp()
    await user.click(screen.getByRole('button', { name: 'Pedal' }))
    expect(audio.pedals().sustain).toBe(true)
    const hidden = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => void document.dispatchEvent(new Event('visibilitychange')))
    hidden.mockRestore()
    expect(audio.pedals().sustain).toBe(false)
    expect(screen.getByRole('button', { name: 'Pedal' })).toHaveAttribute('aria-pressed', 'false')
  })
})
