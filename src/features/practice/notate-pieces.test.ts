import { describe, expect, it } from 'vitest'
import { PATTERN_IDS, PATTERNS } from '@/entities/pattern'
import { melodyOf, PIECES } from '@/entities/piece'
import { arrange, type Chart } from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  CHORD_QUALITIES,
  note,
  parseChordSymbol,
  type Meter,
} from '@/shared/lib/music'
import { notate, ticksOf, type Score } from '@/shared/lib/notation'
import { engrave } from '@/shared/ui/score/engrave'
import { arrangePiece, ownChoice } from './arrange-piece'
import { arrangeChromatic, CHROMATIC } from './chromatic'

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
  it('writes a chromatic walk of every chord, up and back', () => {
    const [first, ...rest] = CHORD_QUALITIES
    if (!first) throw new Error('the table is empty')
    expectWritten(
      notate(
        arrangeChromatic({
          root: note('C'),
          chords: [first, ...rest],
          direction: 'both',
          pattern: CHROMATIC.pattern,
          rh: null,
          lh: null,
        }),
      ),
    )
  })

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

/** The finger numbers drawn off the page: a digit stands 9 over its baseline. */
function fingersOffThePage(performance: Parameters<typeof notate>[0]) {
  const host = document.createElement('div')
  const layout = engrave(notate(performance), host, { scale: 1, fingers: true })
  expect(layout.measures.length).toBeGreaterThan(0)
  return [...host.querySelectorAll('text')]
    .filter((text) => /^[1-5]$/.test(text.textContent ?? ''))
    .map((text) => Number(text.getAttribute('y')))
    .filter((y) => y - 9 < 0 || y > layout.height)
}

describe('engraving of the content', () => {
  it.each(PIECES.map((piece) => [piece.id, piece] as const))(
    'engraves %s with every finger on the page',
    (_id, piece) => {
      expect(fingersOffThePage(arrangePiece(piece, ownChoice(piece)))).toEqual([])
    },
  )

  it('engraves a chromatic walk of every chord with every finger on the page', () => {
    const [first, ...rest] = CHORD_QUALITIES
    if (!first) throw new Error('the table is empty')
    expect(
      fingersOffThePage(
        arrangeChromatic({
          root: note('C'),
          chords: [first, ...rest],
          direction: 'up',
          pattern: CHROMATIC.pattern,
          rh: null,
          lh: null,
        }),
      ),
    ).toEqual([])
  })
})
