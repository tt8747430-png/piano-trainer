import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import type { DiagramChord } from '@/features/practice'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi, note, pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { ChordSheet } from './ChordSheet'

/** C#m7 as its diagram draws it: the right hand's B3 E4 G#4 over its root C#3, the bass's. */
const C_SHARP_M7: DiagramChord = {
  chord: 0,
  symbol: 'C#m7',
  keys: [49, 59, 64, 68].map(midi),
  bass: true,
  notes: [note('C', 1), note('B'), note('E'), note('G', 1)],
  pitchClasses: [1, 4, 8, 11].map(pitchClass),
}

async function openSheet(props: Partial<ComponentProps<typeof ChordSheet>> = {}) {
  const audio = createFakeAudio()
  const keyboard = createFakeMidi()
  const onOpenChange = vi.fn()
  renderWithSettings(
    <ServicesProvider services={{ audio, midi: keyboard }}>
      <ChordSheet open onOpenChange={onOpenChange} chord={C_SHARP_M7} {...props} />
    </ServicesProvider>,
  )
  const sheet = await screen.findByRole('dialog', { name: 'C♯m7 chord' })
  return { sheet, audio, keyboard, onOpenChange }
}

/** Keys held down on the MIDI keyboard, one after another. */
const hold = (keyboard: ReturnType<typeof createFakeMidi>, ...keys: number[]) =>
  act(() => {
    for (const key of keys) keyboard.press(midi(key))
  })

describe('ChordSheet', () => {
  it('shows the chord as its keys, named by its symbol as printed and its notes', async () => {
    const { sheet } = await openSheet()
    expect(within(sheet).getByRole('img', { name: 'C♯m7: C# B E G#' })).toBeInTheDocument()
  })

  it('plays the chord’s keys together, Play turning into Stop while they sound', async () => {
    const user = userEvent.setup()
    const { sheet, audio } = await openSheet()
    await user.click(within(sheet).getByRole('button', { name: 'Play' }))
    const sounds = audio.played.at(-1)?.sounds ?? []
    expect(sounds.map((sound) => (sound.kind === 'note' ? [sound.midi, sound.at] : null))).toEqual([
      [49, 0],
      [59, 0],
      [64, 0],
      [68, 0],
    ])
    expect(within(sheet).getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('closes from its Close at its foot', async () => {
    const user = userEvent.setup()
    const { sheet, onOpenChange } = await openSheet()
    const [, close] = within(sheet).getAllByRole('button', { name: 'Close' })
    if (!close) throw new Error('a Close at the foot')
    await user.click(close)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('has no keys to learn it on where it is not learned', async () => {
    const { sheet } = await openSheet()
    expect(within(sheet).queryByRole('group', { name: 'Keyboard' })).not.toBeInTheDocument()
    expect(within(sheet).queryByText('Play it on the keys')).not.toBeInTheDocument()
  })
})

describe('ChordSheet, learning the chord', () => {
  it('learns it once its keys are held together on a MIDI keyboard, in any octave, once', async () => {
    const onLearned = vi.fn()
    const { sheet, keyboard } = await openSheet({ learn: { learned: false, onLearned } })
    expect(within(sheet).getByText('Play it on the keys')).toBeInTheDocument()
    // E3 G#3 B3: the hand's notes an octave down, in another order; not yet the chord, its root
    // missing.
    hold(keyboard, 52, 56, 47)
    expect(onLearned).not.toHaveBeenCalled()
    hold(keyboard, 61)
    expect(onLearned).toHaveBeenCalledTimes(1)
    expect(within(sheet).getByText('That’s it.')).toBeInTheDocument()
    // Another octave of it is still the chord: learned once.
    hold(keyboard, 73)
    expect(onLearned).toHaveBeenCalledTimes(1)
  })

  it('learns it on its own keys, held with several fingers', async () => {
    const onLearned = vi.fn()
    const { sheet } = await openSheet({ learn: { learned: false, onLearned } })
    const keys = within(sheet).getByRole('group', { name: 'Keyboard' })
    for (const [pointerId, name] of [
      [1, 'C sharp 3'],
      [2, 'B3'],
      [3, 'E4'],
      [4, 'G sharp 4'],
    ] as const)
      fireEvent.pointerDown(within(keys).getByRole('button', { name }), {
        pointerId,
        pointerType: 'touch',
      })
    expect(onLearned).toHaveBeenCalledTimes(1)
  })

  it('waits while a key the chord has not is held with its keys', async () => {
    const onLearned = vi.fn()
    const { sheet, keyboard } = await openSheet({ learn: { learned: false, onLearned } })
    hold(keyboard, 62, 49, 59, 64, 68)
    expect(onLearned).not.toHaveBeenCalled()
    expect(within(sheet).getByText('Play it on the keys')).toBeInTheDocument()
  })

  it('says it is learned from the start once it is, learning it no more', async () => {
    const onLearned = vi.fn()
    const { sheet, keyboard } = await openSheet({ learn: { learned: true, onLearned } })
    expect(within(sheet).getByText('That’s it.')).toBeInTheDocument()
    hold(keyboard, 49, 59, 64, 68)
    expect(onLearned).not.toHaveBeenCalled()
  })
})
