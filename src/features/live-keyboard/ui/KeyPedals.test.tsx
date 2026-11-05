import { act, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setKeyboard } from '@/features/set-preference'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

/** A press on the pedal lasting `ms`, as a finger does. */
function press(pedal: HTMLElement, ms: number) {
  fireEvent.pointerDown(pedal, { pointerId: 1, pointerType: 'touch' })
  act(() => void vi.advanceTimersByTime(ms))
  fireEvent.pointerUp(pedal, { pointerId: 1, pointerType: 'touch' })
}

afterEach(() => vi.useRealTimers())

describe('the keys’ pedals (R31-P)', () => {
  it('holds the sustain while pressed, and lets it up as the finger lifts', () => {
    vi.useFakeTimers()
    const { audio } = setUp()
    const pedal = screen.getByRole('button', { name: /^Sustain pedal/ })
    fireEvent.pointerDown(pedal, { pointerId: 1, pointerType: 'touch' })
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: true })
    expect(pedal).toHaveAttribute('aria-pressed', 'true')
    act(() => void vi.advanceTimersByTime(1000))
    fireEvent.pointerUp(pedal, { pointerId: 1, pointerType: 'touch' })
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: false })
    expect(pedal).toHaveAttribute('aria-pressed', 'false')
  })

  it('locks the sustain down on a tap, and lifts it on the next', () => {
    vi.useFakeTimers()
    const { audio } = setUp()
    const pedal = screen.getByRole('button', { name: /^Sustain pedal/ })
    press(pedal, 80)
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: true })
    expect(pedal).toHaveAttribute('aria-pressed', 'true')
    press(pedal, 80)
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: false })
    expect(pedal).toHaveAttribute('aria-pressed', 'false')
  })

  it('lets a locked pedal up as the keys go: no screen keeps a pedal it cannot lift', () => {
    vi.useFakeTimers()
    const { audio, unmount } = setUp()
    press(screen.getByRole('button', { name: /^Sustain pedal/ }), 80)
    unmount()
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: false })
  })

  it('draws the soft and sostenuto pedals too where all three are shown', () => {
    const { settingsStore } = setUp()
    expect(screen.queryByRole('button', { name: /^Soft pedal/ })).toBeNull()
    act(() => setKeyboard(settingsStore, { pedals: 'all' }))
    expect(screen.getByRole('button', { name: /^Soft pedal/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sostenuto pedal/ })).toBeInTheDocument()
  })

  it('stands the pedals on their lyre beneath the keys, soft to sustain as on a piano (R32)', () => {
    const { settingsStore } = setUp()
    act(() => setKeyboard(settingsStore, { pedals: 'all' }))
    const keys = screen.getByRole('group', { name: 'Keyboard' })
    const lyre = document.querySelector('[data-slot="pedal-lyre"]')
    if (!lyre) throw new Error('no lyre')
    // Beneath the keys: the lyre follows them in the document, nothing of the rail before them.
    expect(keys.compareDocumentPosition(lyre) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      [...lyre.querySelectorAll('[data-slot="pedal"]')].map(
        (pedal) => pedal.getAttribute('aria-label')?.split(' ')[0],
      ),
    ).toEqual(['Soft', 'Sostenuto', 'Sustain'])
  })

  it('marks a latched sustain with its dot, gone as it lifts (R32)', () => {
    vi.useFakeTimers()
    setUp()
    const pedal = screen.getByRole('button', { name: /^Sustain pedal/ })
    press(pedal, 80)
    expect(pedal.querySelector('circle')).not.toBeNull()
    press(pedal, 80)
    expect(pedal.querySelector('circle')).toBeNull()
  })
})
