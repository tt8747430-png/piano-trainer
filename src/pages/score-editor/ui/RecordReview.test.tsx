import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { TAKES_STORAGE_KEY, TAKES_VERSION } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'

const SILENT = 'r/4 | r/4'
/** At 120 a beat is 500 ms: G2 held a bar under G4 struck a little late, then B4 on beat 2 and a half. */
const NOTES = [
  [43, 10, 1900, 80],
  [67, 30, 230, 90],
  [71, 760, 230, 90],
]

const withTake = () => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({
      state: {
        songs: [
          {
            id: 'my-1',
            title: 'Morning',
            key: 'G',
            meter: '4/4',
            tempo: 120,
            pattern: 'r1',
            sections: [{ kind: 'verse', lines: ['G G'] }],
            hands: { rh: SILENT, lh: SILENT },
          },
        ],
        nextSong: 2,
      },
      version: PIECES_VERSION,
    }),
  )
  storage.setItem(
    TAKES_STORAGE_KEY,
    JSON.stringify({
      state: {
        takes: [
          {
            id: 'take-1',
            pieceId: 'my-1',
            made: 1,
            tempo: 120,
            meter: '4/4',
            fromBar: 1,
            notes: NOTES,
            pedals: [],
            length: 2000,
            bars: [0, 2000],
          },
        ],
        free: [],
        nextTake: 2,
      },
      version: TAKES_VERSION,
    }),
  )
  return storage
}

describe('Review your recording (A40)', () => {
  it('quantizes to 1/8, moves the split, saves to the score', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1?takes=true', { storage: withTake() })
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    const [row] = within(sheet).getAllByRole('listitem')
    if (!row) throw new Error('the take is listed')
    await user.click(within(row).getByRole('button', { name: 'Take actions' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Review' }))
    const review = await screen.findByRole('dialog', { name: 'Review your recording' })
    // Snapped to 1/8 as it opens: three notes in the accent over the three as played.
    const quantize = within(review).getByRole('radiogroup', { name: 'Quantize' })
    expect(
      within(quantize)
        .getAllByRole('radio')
        .map((each) => each.textContent),
    ).toEqual(['1/4', '1/8', '1/16', '1/4t', '1/8t'])
    expect(within(quantize).getByRole('radio', { name: '1/8' })).toBeChecked()
    expect(review.querySelectorAll('[data-quantised]')).toHaveLength(3)
    // Hide raw notes leaves the snapped ones alone.
    expect(review.querySelectorAll('[data-raw]')).toHaveLength(3)
    await user.click(within(review).getByRole('switch', { name: 'Hide raw notes' }))
    expect(review.querySelectorAll('[data-raw]')).toHaveLength(0)
    // The split point moved up to C5: G4 and B4 go to the lower staff.
    const split = within(review).getByRole('slider', { name: 'Split point' })
    expect(split).toHaveAttribute('aria-valuetext', 'C4')
    act(() => split.focus())
    for (let i = 0; i < 12; i++) fireEvent.keyDown(split, { key: 'ArrowUp' })
    expect(split).toHaveAttribute('aria-valuetext', 'C5')
    expect(within(review).getByText('Split point: C5')).toBeInTheDocument()
    await user.click(within(review).getByRole('button', { name: 'Save to score' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.hands).toMatchObject({
        rh: 'r/4 | r/4',
        lh: expect.stringMatching(/^G2/),
      }),
    )
    expect(piecesStore.getState().songs[0]?.hands?.lh).toContain('G4')
  })

  it('Discard, asked first, deletes the take', async () => {
    const user = userEvent.setup()
    const { takesStore } = await renderApp('/edit/my-1?takes=true', { storage: withTake() })
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    const [row] = within(sheet).getAllByRole('listitem')
    if (!row) throw new Error('the take is listed')
    await user.click(within(row).getByRole('button', { name: 'Take actions' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Review' }))
    const review = await screen.findByRole('dialog', { name: 'Review your recording' })
    await user.click(within(review).getByRole('button', { name: 'Discard' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Discard this recording?' })
    await user.click(within(asked).getByRole('button', { name: 'Discard' }))
    await waitFor(() => expect(takesStore.getState().takes).toEqual([]))
  })

  it('with Start countdown Off waits for the first note on the recording bar, then reviews the take', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      settingsStore,
      takesStore,
    } = await renderApp('/edit/my-1', { storage: withTake() })
    act(() => keyboard.setStatus({ state: 'connected', devices: ['Keyboard'] }))
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const bar = await screen.findByRole('region', { name: 'Recording' })
    // Its countdown chosen Off while the take counts in: from the next take.
    expect(within(bar).getByRole('switch', { name: 'Metronome' })).toBeChecked()
    expect(within(bar).getByText('♩ = 120')).toBeInTheDocument()
    await user.click(within(bar).getByRole('button', { name: 'Stop' }))
    act(() => settingsStore.setState((state) => ({ recorder: { ...state.recorder, countIn: 0 } })))
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const waiting = await screen.findByRole('region', { name: 'Recording' })
    expect(within(waiting).getByRole('radio', { name: 'Off' })).toBeChecked()
    await waitFor(() =>
      expect(within(waiting).getByRole('status')).toHaveTextContent(
        'Play to start recording. The take starts on your first note.',
      ),
    )
    // Nothing sounds until the first note: the take starts on it.
    const before = audio.played.length
    act(() => audio.setNow(5))
    act(() => keyboard.press(midi(67)))
    expect(audio.played.length).toBeGreaterThan(before)
    act(() => audio.setNow(5.5))
    act(() => keyboard.release(midi(67)))
    act(() => audio.setNow(6))
    await user.click(within(waiting).getByRole('button', { name: 'Stop' }))
    expect(
      await screen.findByRole('dialog', { name: 'Review your recording' }, { timeout: 5000 }),
    ).toBeInTheDocument()
    expect(takesStore.getState().takes.at(-1)?.notes).toEqual([
      expect.objectContaining({ midi: 67, at: 0, held: 500 }),
    ])
  })
})
