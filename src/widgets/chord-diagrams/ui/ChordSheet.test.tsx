import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import {
  createDiagramInversionsStore,
  DiagramInversionsStoreProvider,
} from '@/entities/diagram-inversion'
import { PieceInversions } from '@/features/choose-diagram-inversion'
import type { DiagramChord } from '@/features/practice'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage, SHORTEST_PRESS_MS } from '@/shared/lib'
import { midi, note, pitchClass, printedSymbol } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { ChordSheet } from './ChordSheet'

/** C♯m7 as its diagram folds it: G♯3 B3 C♯4 E4, its 2nd inversion; from E4 it runs past B4. */
const C_SHARP_M7: DiagramChord = {
  chord: 0,
  symbol: 'C#m7',
  keys: [56, 59, 61, 64].map(midi),
  ring: null,
  notes: [note('G', 1), note('B'), note('C', 1), note('E')],
  pitchClasses: [1, 4, 8, 11].map(pitchClass),
  inversions: { kind: 'free', notes: 4, drawn: 2, folded: 2, fitting: [0, 2, 3] },
}

/** C/B♭: its bass B♭3 a ring under C4 E4 G4, drawn one way. */
const C_OVER_B_FLAT: DiagramChord = {
  chord: 1,
  symbol: 'C/Bb',
  keys: [58, 60, 64, 67].map(midi),
  ring: midi(58),
  notes: [note('B', -1), note('C'), note('E'), note('G')],
  pitchClasses: [0, 4, 7, 10].map(pitchClass),
  inversions: { kind: 'slash', notes: 3 },
}

/**
 * The chord's sheet open, its keys sounding through fake audio and MIDI; with `piece`, its diagrams
 * `bz5`'s, their inversions kept in a store of the test's own.
 */
async function openSheet(
  props: Partial<ComponentProps<typeof ChordSheet>> = {},
  { piece = false }: { piece?: boolean } = {},
) {
  const audio = createFakeAudio()
  const keyboard = createFakeMidi()
  const inversions = createDiagramInversionsStore({
    storage: createMemoryStorage(),
    otherTabs: new EventTarget(),
  })
  const onOpenChange = vi.fn()
  const chord = props.chord ?? C_SHARP_M7
  const sheetUi = <ChordSheet open onOpenChange={onOpenChange} chord={chord} {...props} />
  renderWithSettings(
    <ServicesProvider services={{ audio, midi: keyboard }}>
      <DiagramInversionsStoreProvider store={inversions}>
        {piece ? <PieceInversions pieceId="bz5">{sheetUi}</PieceInversions> : sheetUi}
      </DiagramInversionsStoreProvider>
    </ServicesProvider>,
  )
  const sheet = await screen.findByRole('dialog', { name: `${printedSymbol(chord.symbol)} chord` })
  return { sheet, audio, keyboard, onOpenChange, inversions }
}

/** Keys held down on the MIDI keyboard, one after another. */
const hold = (keyboard: ReturnType<typeof createFakeMidi>, ...keys: number[]) =>
  act(() => {
    for (const key of keys) keyboard.press(midi(key))
  })

describe('ChordSheet', () => {
  it('shows the chord as its keys, named by its symbol as printed and its notes', async () => {
    const { sheet } = await openSheet()
    expect(within(sheet).getByRole('img', { name: 'C♯m7: G# B C# E' })).toBeInTheDocument()
  })

  it('plays the chord’s keys together, Play turning into Stop while they sound', async () => {
    const user = userEvent.setup()
    const { sheet, audio } = await openSheet()
    await user.click(within(sheet).getByRole('button', { name: 'Play' }))
    const sounds = audio.played.at(-1)?.sounds ?? []
    expect(sounds.map((sound) => (sound.kind === 'note' ? [sound.midi, sound.at] : null))).toEqual([
      [56, 0],
      [59, 0],
      [61, 0],
      [64, 0],
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
    expect(within(sheet).queryByText('Hold it on the keys')).not.toBeInTheDocument()
  })
})

describe('ChordSheet, its inversion (ADR 0101)', () => {
  it('chooses the inversion a piece’s chord is drawn in, kept for that chord in that piece', async () => {
    const user = userEvent.setup()
    const { sheet, inversions } = await openSheet({}, { piece: true })
    const choice = within(sheet).getByRole('radiogroup', { name: 'Inversion' })
    expect(within(choice).getByRole('radio', { name: '2nd' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    // From E4, C♯m7 runs past B4: greyed, saying so.
    expect(within(choice).getByRole('radio', { name: '1st' })).toHaveAttribute(
      'title',
      'Doesn’t fit the keys shown',
    )
    await user.click(within(choice).getByRole('radio', { name: 'Root' }))
    expect(inversions.getState().pieces).toEqual({ bz5: { 'C#m7': 0 } })
  })

  it('forgets the choice where the inversion it folds into is chosen again', async () => {
    const user = userEvent.setup()
    const rooted: DiagramChord = {
      ...C_SHARP_M7,
      keys: [61, 64, 68, 71].map(midi),
      inversions: { kind: 'free', notes: 4, drawn: 0, folded: 2, fitting: [0, 2, 3] },
    }
    const { sheet, inversions } = await openSheet({ chord: rooted }, { piece: true })
    act(() => inversions.setState({ pieces: { bz5: { 'C#m7': 0 } } }))
    await user.click(within(sheet).getByRole('radio', { name: '2nd' }))
    expect(inversions.getState().pieces).toEqual({})
  })

  it('greys the choice of a slash chord, which stands over its bass, choosing none', async () => {
    const { sheet } = await openSheet({ chord: C_OVER_B_FLAT }, { piece: true })
    const choice = within(sheet).getByRole('radiogroup', { name: 'Inversion' })
    const radios = within(choice).getAllByRole('radio')
    expect(radios).toHaveLength(3)
    for (const radio of radios) {
      expect(radio).toHaveAttribute('title', 'Its bass is in its name: the note after the slash')
      expect(radio).toHaveAttribute('aria-checked', 'false')
    }
  })

  it('greys the choice of a chord of five notes or more, which is not inverted', async () => {
    const ninth: DiagramChord = {
      chord: 2,
      symbol: 'C9',
      keys: [55, 58, 60, 62, 64].map(midi),
      ring: null,
      notes: [note('G'), note('B', -1), note('C'), note('D'), note('E')],
      pitchClasses: [0, 4, 7, 10, 2].map(pitchClass),
      inversions: { kind: 'large', notes: 5 },
    }
    const { sheet } = await openSheet({ chord: ninth }, { piece: true })
    const choice = within(sheet).getByRole('radiogroup', { name: 'Inversion' })
    const radios = within(choice).getAllByRole('radio')
    expect(radios).toHaveLength(4)
    for (const radio of radios)
      expect(radio).toHaveAttribute('title', 'A chord of five notes or more is not inverted')
  })

  it('has no inversion to choose where the music is no piece: a walk, a progression', async () => {
    const { sheet } = await openSheet()
    expect(within(sheet).queryByRole('radiogroup', { name: 'Inversion' })).not.toBeInTheDocument()
  })
})

/** Keys let go on the MIDI keyboard, once each press has been down its shortest. */
async function letGo(keyboard: ReturnType<typeof createFakeMidi>, ...keys: number[]) {
  await act(() => new Promise((done) => setTimeout(done, SHORTEST_PRESS_MS + 10)))
  act(() => {
    for (const key of keys) keyboard.release(midi(key))
  })
}

/** A chord's learning, held `held` times so far of three (ADR 0111). */
const learning = (held: number, onHeld = vi.fn()) => ({ learn: { held, needed: 3, onHeld } })

describe('ChordSheet, learning the chord', () => {
  it('counts a hold once its keys are held together on a MIDI keyboard, in any octave', async () => {
    const onHeld = vi.fn()
    const { sheet, keyboard, audio } = await openSheet(learning(0, onHeld))
    expect(within(sheet).getByText('Hold it on the keys')).toBeInTheDocument()
    expect(within(sheet).getByText('0 of 3')).toBeInTheDocument()
    // E3 G♯3 B2: its notes in other octaves, in another order; not yet the chord, its root missing.
    hold(keyboard, 52, 56, 47)
    expect(onHeld).not.toHaveBeenCalled()
    hold(keyboard, 61)
    expect(onHeld).toHaveBeenCalledTimes(1)
    // Each hold heard: a click, the first beat's.
    expect(audio.played.at(-1)?.sounds).toEqual([{ kind: 'click', at: 0, accent: true }])
    // Held longer, or another octave of it added, it is the same hold.
    hold(keyboard, 73)
    expect(onHeld).toHaveBeenCalledTimes(1)
  })

  it('counts the next hold only once every key is let go and the chord played again', async () => {
    const onHeld = vi.fn()
    const { keyboard } = await openSheet(learning(1, onHeld))
    hold(keyboard, 56, 59, 61, 64)
    expect(onHeld).toHaveBeenCalledTimes(1)
    // A finger lifted and put back is the same hold.
    await letGo(keyboard, 64)
    hold(keyboard, 64)
    expect(onHeld).toHaveBeenCalledTimes(1)
    await letGo(keyboard, 56, 59, 61, 64)
    hold(keyboard, 56, 59, 61, 64)
    expect(onHeld).toHaveBeenCalledTimes(2)
  })

  it('shows the holds counted', async () => {
    const { sheet } = await openSheet(learning(2))
    expect(within(sheet).getByText('2 of 3')).toBeInTheDocument()
  })

  it('counts a hold on its own keys, the diagram’s, held with several fingers', async () => {
    const onHeld = vi.fn()
    const { sheet } = await openSheet(learning(0, onHeld))
    const keys = within(sheet).getByRole('group', { name: 'Keyboard' })
    for (const [pointerId, name] of [
      [1, 'G sharp 3'],
      [2, 'B3'],
      [3, 'C sharp 4'],
      [4, 'E4'],
    ] as const)
      fireEvent.pointerDown(within(keys).getByRole('button', { name }), {
        pointerId,
        pointerType: 'touch',
      })
    expect(onHeld).toHaveBeenCalledTimes(1)
  })

  it('waits while a key the chord has not is held with its keys', async () => {
    const onHeld = vi.fn()
    const { sheet, keyboard } = await openSheet(learning(0, onHeld))
    hold(keyboard, 62, 56, 59, 61, 64)
    expect(onHeld).not.toHaveBeenCalled()
    expect(within(sheet).getByText('0 of 3')).toBeInTheDocument()
  })

  it('says it is learned once held three times, counting no more', async () => {
    const onHeld = vi.fn()
    const { sheet, keyboard } = await openSheet(learning(3, onHeld))
    expect(within(sheet).getByText('Learned')).toBeInTheDocument()
    expect(within(sheet).getByText('3 of 3')).toBeInTheDocument()
    hold(keyboard, 56, 59, 61, 64)
    expect(onHeld).not.toHaveBeenCalled()
  })
})
