import { describe, expect, it } from 'vitest'
import { PATTERN_IDS, PATTERNS } from '@/entities/pattern'
import { melodyOf, PIECES } from '@/entities/piece'
import { arrange, type Chart } from '@/shared/lib/arrangement'
import { beatsPerBar, note, parseChordSymbol, type Meter } from '@/shared/lib/music'
import { notate, ticksOf, type Score } from '@/shared/lib/notation'
import { engrave } from '@/shared/ui/score/engrave'
import { arrangePiece, ownChoice } from './arrange-piece'

/** Every voice of every measure fills its bar, its events end to end; one or two voices a staff. */
function expectWritten(score: Score) {
  for (const measure of score.measures) {
    for (const voices of [measure.staves.treble, measure.staves.bass]) {
      expect(voices.length).toBeGreaterThanOrEqual(1)
      expect(voices.length).toBeLessThanOrEqual(2)
      for (const voice of voices) {
        let at = measure.startTick
        for (const event of voice.events) {
          expect(event.tick).toBe(at)
          at += ticksOf(event.duration, score.meter)
        }
        expect(at).toBe(measure.startTick + measure.ticks)
      }
    }
  }
}

const chartIn = (meter: Meter): Chart => ({
  key: { tonic: note('C'), minor: false },
  meter,
  sections: [
    {
      lines: [
        ['C', 'Am', 'F', 'G7'].map((symbol) => ({
          chords: [{ ...parseChordSymbol(symbol), beats: beatsPerBar(meter) }],
          beats: beatsPerBar(meter),
        })),
      ],
    },
  ],
})

describe('notation of the content', () => {
  it.each(PIECES.map((piece) => [piece.id, piece] as const))(
    'writes %s as it plays',
    (_id, piece) => {
      expectWritten(notate(arrangePiece(piece, ownChoice(piece))))
      if (melodyOf(piece))
        expectWritten(notate(arrangePiece(piece, { ...ownChoice(piece), melody: true })))
    },
  )

  it.each(
    PATTERN_IDS.flatMap((id) =>
      (['4/4', '3/4', '12/8'] as const).map((meter) => [id, meter] as const),
    ),
  )('writes the pattern %s in %s', (id, meter) => {
    expectWritten(
      notate(arrange(chartIn(meter), { tonic: note('C'), pattern: PATTERNS[id].pattern })),
    )
  })
})

describe('engraving of the content', () => {
  it.each(PIECES.map((piece) => [piece.id, piece] as const))('engraves %s', (_id, piece) => {
    const layout = engrave(
      notate(arrangePiece(piece, ownChoice(piece))),
      document.createElement('div'),
      {
        scale: 1,
        fingers: true,
      },
    )
    expect(layout.measures.length).toBeGreaterThan(0)
  })
})
