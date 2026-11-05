import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

/** A finger down on each key, held. */
const hold = (...names: string[]) =>
  names.forEach((name, pointerId) =>
    fireEvent.pointerDown(screen.getByRole('button', { name }), {
      pointerId,
      pointerType: 'touch',
    }),
  )
/** What the rail says of the chord held, its name for a screen reader first; null while it says nothing. */
const chord = () => screen.queryByText('Chord held:')?.parentElement?.textContent ?? null

describe('the keyboard’s rail', () => {
  it('holds the keys’ size, the piano’s settings and its pedal: nothing else (R31-P)', () => {
    setUp()
    // No map of the keys in view: a swipe on the keys scrolls them.
    expect(screen.queryByRole('slider', { name: 'Keys in view' })).not.toBeInTheDocument()
    for (const name of ['Smaller keys', 'Larger keys', 'Piano settings']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: /^Sustain pedal/ })).toBeInTheDocument()
    // Every other choice is the piano's settings', never a second control on the strip.
    for (const name of [/^Note names/, 'Chord names', 'Glissando', 'Sound the MIDI keyboard']) {
      expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
    }
  })

  it('opens the piano’s settings where the screen keeps them', async () => {
    const user = userEvent.setup()
    const onSettings = vi.fn()
    setUp({ onSettings })
    await user.click(screen.getByRole('button', { name: 'Piano settings' }))
    expect(onSettings).toHaveBeenCalledTimes(1)
  })

  it('zooms the keys a step at a time, saved, the button at an end off', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const smaller = screen.getByRole('button', { name: 'Smaller keys' })
    const larger = screen.getByRole('button', { name: 'Larger keys' })
    await user.click(larger)
    expect(settingsStore.getState().keyboard.keySize).toBe('large')
    expect(larger).toBeDisabled()
    await user.click(smaller)
    await user.click(smaller)
    expect(settingsStore.getState().keyboard.keySize).toBe('piano')
    expect(smaller).toBeDisabled()
    expect(larger).toBeEnabled()
  })

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

  it('names the keys held on a MIDI keyboard', () => {
    const { midiKeyboard } = setUp()
    act(() => [62, 65, 69].forEach((key) => midiKeyboard.press(midi(key))))
    expect(chord()).toBe('Chord held: Dm')
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
})
