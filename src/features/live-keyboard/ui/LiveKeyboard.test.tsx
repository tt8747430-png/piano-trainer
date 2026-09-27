import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setKeyboard } from '@/features/set-preference'
import { SHORTEST_PRESS_MS } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import { renderLiveKeyboard as setUp } from '../testing/render-live-keyboard'

const C_MAJOR = new Map<Midi, KeyMark>(
  [60, 64, 67].map((key) => [midi(key), { tone: 'root', label: '1' }]),
)

afterEach(() => vi.useRealTimers())

describe('LiveKeyboard', () => {
  it('sounds a tapped key on top of what plays, then does what the screen asks', async () => {
    const user = userEvent.setup()
    const onKeyPress = vi.fn()
    const { audio } = setUp({ onKeyPress })
    await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
    expect(audio.played.flatMap((play) => play.sounds)).toMatchObject([{ kind: 'note', midi: 66 }])
    expect(audio.stops).toBe(0)
    expect(onKeyPress).toHaveBeenCalledWith(66)
  })

  it('sounds a tapped key at once, from the audio clock’s now', async () => {
    const user = userEvent.setup()
    const { audio } = setUp()
    audio.setNow(2)
    await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
    expect(audio.played.at(-1)?.at).toBe(2)
  })

  it('puts a tapped key down while it is pressed, and up once it lifts, however long it rings', () => {
    vi.useFakeTimers()
    const { audio } = setUp()
    const key = screen.getByRole('button', { name: 'F sharp 4' })
    fireEvent.pointerDown(key, { pointerId: 1, pointerType: 'touch' })
    expect(key).toHaveAttribute('data-down')
    fireEvent.pointerUp(key, { pointerId: 1, pointerType: 'touch' })
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    act(() => audio.setNow(0.3))
    expect(key).not.toHaveAttribute('data-down')
  })

  it('puts down the keys the app sounds, as they sound', () => {
    const { audio } = setUp()
    act(() => void audio.play(chordSounds([midi(60), midi(64)], { arpeggio: true }), 0))
    act(() => audio.setNow(0.1))
    expect(screen.getByRole('button', { name: 'C4' })).toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-down')
    act(() => audio.setNow(0.3))
    expect(screen.getByRole('button', { name: 'E4' })).toHaveAttribute('data-down')
  })

  it('puts down the keys held on a MIDI keyboard', () => {
    vi.useFakeTimers()
    const { midiKeyboard } = setUp()
    act(() => midiKeyboard.press(midi(67)))
    expect(screen.getByRole('button', { name: 'G4' })).toHaveAttribute('data-down')
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    act(() => midiKeyboard.release(midi(67)))
    expect(screen.getByRole('button', { name: 'G4' })).not.toHaveAttribute('data-down')
  })

  it('is set up as the keyboard settings say', () => {
    const { settingsStore } = setUp()
    act(() => setKeyboard(settingsStore, { keySize: 'piano', namedKeys: 'none' }))
    expect(screen.queryByRole('button', { name: 'Octave up' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'C4' }).textContent).toBe('')
  })

  it('with spotlight, puts down only the key struck last, every mark kept', () => {
    const { audio } = setUp({ spotlight: true, marks: C_MAJOR })
    act(() => void audio.play(chordSounds([60, 64, 67].map(midi), { arpeggio: true }), 0))
    act(() => audio.setNow(0.5))
    const [c, e, g] = ['C4', 'E4', 'G4'].map((name) => screen.getByRole('button', { name }))
    expect(g).toHaveAttribute('data-down')
    for (const key of [c, e]) {
      expect(key).not.toHaveAttribute('data-down')
      expect(key).toHaveClass('bg-role-root-wash')
    }
  })

  it('with spotlight, puts a chord’s keys down together when they are struck together', () => {
    const { audio } = setUp({ spotlight: true, marks: C_MAJOR })
    act(() => void audio.play(chordSounds([60, 64, 67].map(midi), { arpeggio: false }), 0))
    act(() => audio.setNow(0.5))
    for (const name of ['C4', 'E4', 'G4'])
      expect(screen.getByRole('button', { name })).toHaveAttribute('data-down')
  })

  it('without spotlight, puts every sounding key down and keeps every mark', () => {
    const { audio } = setUp({ marks: C_MAJOR })
    act(() => void audio.play(chordSounds([60, 64, 67].map(midi), { arpeggio: true }), 0))
    act(() => audio.setNow(0.5))
    expect(screen.getByRole('button', { name: 'E4' })).toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'C4' })).toHaveClass('bg-role-root')
  })

  it('sounds what a key plays and holds all of it down while the key is held', () => {
    const { audio } = setUp({
      keyPlays: (key) => (key === 62 ? [midi(62), midi(65), midi(69)] : [key]),
    })
    fireEvent.pointerDown(screen.getByRole('button', { name: 'D4' }), { pointerId: 1 })
    const notes = (audio.played.at(-1)?.sounds ?? []).flatMap((sound) =>
      sound.kind === 'note' ? [sound.midi] : [],
    )
    expect(notes).toEqual([62, 65, 69])
    expect(screen.getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
  })
})
