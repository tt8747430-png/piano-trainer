import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { stubFonts } from '@/shared/test/fonts'
import { ScoreView } from './ScoreView'

const score = notate({
  key: { tonic: note('C'), minor: false },
  meter: '3/4',
  bars: [
    { startTick: 0, beats: 3 },
    { startTick: 36, beats: 3 },
  ],
  notes: [
    { midi: midi(60), spelled: note('C'), hand: 'rh', startTick: 0, durationTicks: 72, roll: 0 },
  ],
  chords: [{ startTick: 0, symbol: 'C' }],
})

describe('ScoreView', () => {
  it('engraves once the music font is in, and hands its layout to what lies over it', async () => {
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
      <ScoreView score={score} scale={1} fingers={false} selected={{ staff: 'treble', tick: 0 }} />,
    )
    await waitFor(() => expect(document.querySelector('.vf-selected')).toBeInTheDocument())
    const engraved = document.querySelector('[data-slot="score"] svg')
    expect(document.querySelector('.vf-selected')).toHaveAttribute('data-tick', '0')
    rerender(
      <ScoreView score={score} scale={1} fingers={false} selected={{ staff: 'bass', tick: 0 }} />,
    )
    await waitFor(() => expect(document.querySelector('.vf-selected')).not.toBeInTheDocument())
    expect(document.querySelector('[data-slot="score"] svg')).toBe(engraved)
  })

  it('names the staff it mutes', async () => {
    render(<ScoreView score={score} scale={1} fingers={false} muted="bass" />)
    expect(document.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'bass')
  })

  it('says so when the music font does not load', async () => {
    stubFonts({ loads: false })
    render(<ScoreView score={score} scale={1} fingers={false} />)
    expect(await screen.findByText('The music can’t be shown.')).toBeInTheDocument()
  })
})
