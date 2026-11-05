import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setKeyboard } from '@/features/set-preference'
import { midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

/** A press on a pedal's button lasting `ms`, as a finger does. */
function press(pedal: HTMLElement, ms: number) {
  fireEvent.pointerDown(pedal, { pointerId: 1, pointerType: 'touch' })
  act(() => void vi.advanceTimersByTime(ms))
  fireEvent.pointerUp(pedal, { pointerId: 1, pointerType: 'touch' })
}

/** A finger down on each key, held. */
const hold = (...names: string[]) =>
  names.forEach((name, pointerId) =>
    fireEvent.pointerDown(screen.getByRole('button', { name }), {
      pointerId,
      pointerType: 'touch',
    }),
  )
/** What the bar says of the chord held, its name for a screen reader first; null while it says nothing. */
const chord = () =>
  document.querySelector('[data-slot="held-chord"]')?.textContent?.replace(/\s+/g, ' ') ?? null
const sustain = () => screen.getByRole('button', { name: /^Sustain pedal/ })

afterEach(() => vi.useRealTimers())

describe('the keyboard’s controls in the bar (R34)', () => {
  it('shows or hides the keys from Keyboard, pressed while they show', async () => {
    const user = userEvent.setup()
    const onShow = vi.fn()
    setUp({ onShow })
    const keyboard = screen.getByRole('button', { name: 'Keyboard' })
    expect(keyboard).toHaveAttribute('aria-pressed', 'true')
    await user.click(keyboard)
    expect(onShow).toHaveBeenCalledWith(false)
  })

  it('holds nothing else of the keyboard: no zoom, no settings, no octave buttons', () => {
    setUp()
    for (const name of [/keys$/i, /settings/i, /^Octave/]) {
      expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
    }
  })
})

describe('the bar’s Sustain (R34)', () => {
  it('holds the sustain while pressed, lit, and lets it up as the finger lifts', () => {
    vi.useFakeTimers()
    const { audio } = setUp()
    fireEvent.pointerDown(sustain(), { pointerId: 1, pointerType: 'touch' })
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: true })
    expect(sustain()).toHaveAttribute('aria-pressed', 'true')
    act(() => void vi.advanceTimersByTime(1000))
    fireEvent.pointerUp(sustain(), { pointerId: 1, pointerType: 'touch' })
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: false })
    expect(sustain()).toHaveAttribute('aria-pressed', 'false')
  })

  it('latches the sustain down on a tap, and lifts it on the next', () => {
    vi.useFakeTimers()
    const { audio } = setUp()
    press(sustain(), 80)
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: true })
    expect(sustain()).toHaveAttribute('data-latched')
    press(sustain(), 80)
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: false })
    expect(sustain()).not.toHaveAttribute('data-latched')
  })

  it('latches and lifts from the keyboard as from a tap', async () => {
    const user = userEvent.setup()
    const { audio } = setUp()
    sustain().focus()
    await user.keyboard('{Enter}')
    expect(audio.pedals().sustain).toBe(true)
    await user.keyboard('{Enter}')
    expect(audio.pedals().sustain).toBe(false)
  })

  it('lets a latched pedal up as the keys go: no screen keeps a pedal it cannot lift', () => {
    vi.useFakeTimers()
    const { audio, unmount } = setUp()
    press(sustain(), 80)
    unmount()
    expect(audio.voice.at(-1)).toEqual({ kind: 'pedal', pedal: 'sustain', down: false })
  })

  it('lights whoever holds the sustain: Space, a MIDI foot, or the music’s pedal', () => {
    const { audio } = setUp()
    act(() => audio.pedal('sustain', true))
    expect(sustain()).toHaveAttribute('aria-pressed', 'true')
    act(() => audio.pedal('sustain', false))
    expect(sustain()).toHaveAttribute('aria-pressed', 'false')
  })

  it('lights with the score’s pedal while the music plays', () => {
    setUp({ sustained: true })
    expect(sustain()).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens the soft and sostenuto pedals from its menu where all three are shown', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    expect(screen.queryByRole('button', { name: 'Soft and sostenuto pedals' })).toBeNull()
    act(() => setKeyboard(settingsStore, { pedals: 'all' }))
    await user.click(screen.getByRole('button', { name: 'Soft and sostenuto pedals' }))
    expect(await screen.findByRole('button', { name: /^Soft pedal/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sostenuto pedal/ })).toBeInTheDocument()
  })

  it('keeps a pedal latched from its menu down as the menu closes, a dot saying so', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = setUp()
    act(() => setKeyboard(settingsStore, { pedals: 'all' }))
    await user.click(screen.getByRole('button', { name: 'Soft and sostenuto pedals' }))
    const soft = await screen.findByRole('button', { name: /^Soft pedal/ })
    fireEvent.pointerDown(soft, { pointerId: 1, pointerType: 'touch' })
    fireEvent.pointerUp(soft, { pointerId: 1, pointerType: 'touch' })
    expect(audio.pedals().soft).toBe(true)
    await user.keyboard('{Escape}')
    expect(audio.pedals().soft).toBe(true)
    expect(document.querySelector('[data-slot="pedals-down"]')).not.toBeNull()
  })
})

describe('the chord held, in the bar', () => {
  it('names the chord a hand holds, and nothing under three notes', () => {
    setUp()
    hold('C4', 'E4')
    expect(chord()).toBeNull()
    const g4 = screen.getByRole('button', { name: 'G4' })
    fireEvent.pointerDown(g4, { pointerId: 2, pointerType: 'touch' })
    expect(chord()).toBe('Chord held: C')
    fireEvent.pointerUp(g4, { pointerId: 2, pointerType: 'touch' })
    expect(chord()).toBeNull()
  })

  it('names a chord over the bass it is played on', () => {
    setUp()
    hold('E4', 'G4', 'B4', 'D4')
    expect(chord()).toBe('Chord held: Em7/D')
  })

  it('prints the chord held as the sheets print it, ♯ and ♭ as signs', () => {
    const { midiKeyboard } = setUp()
    act(() => [61, 64, 68].forEach((key) => midiKeyboard.press(midi(key))))
    expect(chord()).toBe('Chord held: C♯m')
  })

  it('names the keys the pedal holds, each tapped and let go', async () => {
    const user = userEvent.setup()
    const { audio } = setUp()
    act(() => audio.pedal('sustain', true))
    for (const name of ['C4', 'E4', 'G4']) await user.click(screen.getByRole('button', { name }))
    expect(chord()).toBe('Chord held: C')
  })

  it('names what a hand plays, not what the app sounds', () => {
    const { audio } = setUp()
    act(() => void audio.play(chordSounds([60, 64, 67].map(midi), { arpeggio: false }), 0))
    act(() => audio.setNow(0.1))
    expect(chord()).toBeNull()
  })

  it('names nothing with Chord symbol off', () => {
    const { settingsStore } = setUp()
    act(() => setKeyboard(settingsStore, { chordNames: false }))
    hold('C4', 'E4', 'G4')
    expect(chord()).toBeNull()
  })
})
