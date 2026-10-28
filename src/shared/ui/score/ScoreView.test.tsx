import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import * as engine from './verovio/engine'
import { ScoreView } from './ScoreView'

const B = TICKS_PER_BEAT

const score = notate({
  key: { tonic: note('C'), minor: false },
  meter: '3/4',
  bars: [
    { startTick: 0, beats: 3 },
    { startTick: 1.5 * B, beats: 3 },
  ],
  notes: [{ midi: midi(60), spelled: note('C'), hand: 'rh', startTick: 0, durationTicks: 3 * B }],
  chords: [{ startTick: 0, symbol: 'C' }],
})

describe('ScoreView', () => {
  it('engraves, and hands its layout to what lies over it', async () => {
    render(
      <ScoreView score={score} scale={1} fingers={false}>
        {(layout) => <p>Bars: {layout.measures.length}</p>}
      </ScoreView>,
    )
    expect(await screen.findByText('Bars: 2')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="score"] svg')).toBeInTheDocument()
  })

  it('marks the notes chosen, on their staff at their tick, without engraving again', async () => {
    const { rerender } = render(
      <ScoreView
        score={score}
        scale={1}
        fingers={false}
        selected={{ staff: 'treble', from: 0, to: 1 }}
      />,
    )
    await waitFor(() => expect(document.querySelector('g.note.note-chosen')).toBeInTheDocument())
    const engraved = document.querySelector('[data-slot="score"] svg')
    expect(document.querySelector('g.note.note-chosen')?.id).toMatch(/^n-treble-0-/)
    // Middle C's ledger line under the staff with it, in the selection colour (ADR 0096).
    expect(document.querySelector('g.ledgerLines > path.note-chosen')).toBeInTheDocument()
    rerender(
      <ScoreView
        score={score}
        scale={1}
        fingers={false}
        selected={{ staff: 'bass', from: 0, to: 1 }}
      />,
    )
    // The bass at that tick: its rest, the treble's note no longer.
    await waitFor(() =>
      expect(document.querySelector('g.note.note-chosen')).not.toBeInTheDocument(),
    )
    expect(document.querySelector('g.rest.note-chosen')?.id).toMatch(/^r-bass-0/)
    expect(document.querySelector('[data-slot="score"] svg')).toBe(engraved)
    // A range: every note starting in it.
    rerender(
      <ScoreView
        score={score}
        scale={1}
        fingers={false}
        selected={{ staff: 'treble', from: 0, to: 10_000 }}
      />,
    )
    await waitFor(() =>
      expect(document.querySelectorAll('g.note.note-chosen').length).toBeGreaterThan(1),
    )
  })

  it('keeps what lies over it in its own layers, under what the page pins', async () => {
    render(
      <ScoreView score={score} scale={1} fingers={false}>
        {() => <button type="button">Play C</button>}
      </ScoreView>,
    )
    const over = await screen.findByRole('button', { name: 'Play C' })
    expect(over.parentElement).toHaveClass('isolate')
    expect(over.parentElement).toContainElement(document.querySelector('[data-slot="score"]'))
  })

  it('ends a justified line with the key and time the next line changes to, its measure not drawn', async () => {
    render(
      <ScoreView
        score={score}
        scale={1}
        fingers={false}
        fill={600}
        next={{ time: { count: 4, unit: 4 }, key: { tonic: note('D'), minor: false } }}
      >
        {(layout) => <p>Bars: {layout.measures.length}</p>}
      </ScoreView>,
    )
    expect(await screen.findByText('Bars: 2')).toBeInTheDocument()
    const drawn = document.querySelector('[data-slot="score"] svg')!
    // The line's own signature and the courtesy after its last barline, on each staff.
    expect(drawn.querySelectorAll('g.meterSig')).toHaveLength(4)
    expect(drawn.querySelector('#m-next')).toBeNull()
    expect(drawn.querySelectorAll('g.system')).toHaveLength(1)
  })

  it('names the staff it mutes', async () => {
    render(<ScoreView score={score} scale={1} fingers={false} muted="bass" />)
    expect(document.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'bass')
  })

  it('says so when the music cannot be engraved', async () => {
    vi.spyOn(engine, 'engrave').mockRejectedValueOnce(new Error('unreadable'))
    render(<ScoreView score={score} scale={1} fingers={false} />)
    expect(await screen.findByText('The music can’t be shown.')).toBeInTheDocument()
  })
})
