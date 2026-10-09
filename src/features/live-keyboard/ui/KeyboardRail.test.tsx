import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
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
const chord = () => screen.queryByText('Chord played:')?.parentElement?.textContent ?? null

describe('the keyboard’s rail', () => {
  it('holds every control in sight, as pictures: no settings button, no pop-up', () => {
    setUp()
    expect(screen.getByRole('slider', { name: 'Keys in view' })).toBeInTheDocument()
    for (const name of ['Smaller keys', 'Larger keys', 'Glissando', 'Pedal']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.queryByRole('button', { name: 'Keyboard settings' })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
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

  it('turns the note names round from one button, which says what the keys show', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const names = () => screen.getByRole('button', { name: /^Note names/ })
    expect(names()).toHaveAccessibleName('Note names: every C')
    expect(names()).toHaveAttribute('aria-pressed', 'true')
    await user.click(names())
    expect(names()).toHaveAccessibleName('Note names: every key')
    expect(settingsStore.getState().keyboard.namedKeys).toBe('all')
    await user.click(names())
    expect(names()).toHaveAccessibleName('Note names: off')
    expect(names()).toHaveAttribute('aria-pressed', 'false')
    await user.click(names())
    expect(settingsStore.getState().keyboard.namedKeys).toBe('c')
  })

  it('turns playing from the computer keyboard on and off, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const typing = screen.getByRole('button', { name: 'Play from the computer keyboard' })
    expect(typing).toHaveAttribute('aria-pressed', 'false')
    await user.click(typing)
    expect(typing).toHaveAttribute('aria-pressed', 'true')
    expect(settingsStore.getState().keyboard.typing).toBe(true)
  })

  it('offers Sound the MIDI keyboard only while one is connected, and saves it', async () => {
    const user = userEvent.setup()
    const { settingsStore, midiKeyboard } = setUp()
    const sound = () => screen.queryByRole('button', { name: 'Sound the MIDI keyboard' })
    expect(sound()).not.toBeInTheDocument()
    await act(() => midiKeyboard.connect())
    await user.click(sound() ?? document.body)
    expect(sound()).toHaveAttribute('aria-pressed', 'true')
    expect(settingsStore.getState().midi.sound).toBe(true)
  })

  it('names each button on hover', () => {
    setUp()
    expect(screen.getByRole('button', { name: 'Pedal' })).toHaveAttribute('title', 'Pedal')
  })

  it('names the chord a hand holds, and nothing under three notes', () => {
    setUp()
    hold('C4', 'E4')
    expect(chord()).toBeNull()
    const g4 = screen.getByRole('button', { name: 'G4' })
    fireEvent.pointerDown(g4, { pointerId: 2, pointerType: 'touch' })
    expect(chord()).toBe('Chord played: C')
    fireEvent.pointerUp(g4, { pointerId: 2, pointerType: 'touch' })
    expect(chord()).toBeNull()
  })

  it('names a chord over the bass it is played on', () => {
    setUp()
    hold('E4', 'G4', 'B4', 'D4')
    expect(chord()).toBe('Chord played: Em7/D')
  })

  it('names the keys held on a MIDI keyboard', () => {
    const { midiKeyboard } = setUp()
    act(() => [62, 65, 69].forEach((key) => midiKeyboard.press(midi(key))))
    expect(chord()).toBe('Chord played: Dm')
  })

  it('names the keys the pedal holds, each tapped and let go', async () => {
    const user = userEvent.setup()
    const { audio } = setUp()
    act(() => audio.pedal('sustain', true))
    for (const name of ['C4', 'E4', 'G4']) await user.click(screen.getByRole('button', { name }))
    expect(chord()).toBe('Chord played: C')
  })

  it('names what a hand plays, not what the app sounds', () => {
    const { audio } = setUp()
    act(() => void audio.play(chordSounds([60, 64, 67].map(midi), { arpeggio: false }), 0))
    act(() => audio.setNow(0.1))
    expect(chord()).toBeNull()
  })

  it('names the chords played or not, as its button says, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = setUp()
    const names = screen.getByRole('button', { name: 'Name the chords played' })
    expect(names).toHaveAttribute('aria-pressed', 'true')
    await user.click(names)
    expect(names).toHaveAttribute('aria-pressed', 'false')
    expect(settingsStore.getState().keyboard.chordNames).toBe(false)
    hold('C4', 'E4', 'G4')
    expect(chord()).toBeNull()
  })
})
