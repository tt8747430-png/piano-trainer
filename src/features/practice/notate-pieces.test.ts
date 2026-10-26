// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { PATTERN_IDS, BUILT_IN_PATTERNS } from '@/entities/pattern'
import { PIECES } from '@/entities/piece'
import { arrange, type Chart } from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  CHORD_QUALITIES,
  note,
  parseChordSymbol,
  type Meter,
} from '@/shared/lib/music'
import { notate, scoreToMei, ticksOf, type Score } from '@/shared/lib/notation'
import { drawScore } from '@/shared/ui/score/verovio/draw'
import { arrangePiece, ownChoice } from './arrange-piece'
import { arrangeChromatic } from './chromatic'
import { CHROMATIC } from './chromatic-choice'

/**
 * Every voice of every measure fills its bar, its events end to end; one or two voices a staff, each
 * single staff's too (ADR 0097).
 */
function expectWritten(score: Score) {
  for (const measure of score.measures) {
    for (const voices of score.staves.map((staff) => measure.staves[staff] ?? [])) {
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
        arrangeChromatic(
          {
            root: note('C'),
            chords: [first, ...rest],
            direction: 'both',
            pattern: CHROMATIC.pattern,
            rh: null,
            lh: null,
            inversion: null,
            nearest: true,
          },
          BUILT_IN_PATTERNS,
        ),
      ),
    )
  })

  it.each(PIECES.map((piece) => [piece.id, piece] as const))(
    'writes %s as it plays, its single staves over the piano',
    (_id, piece) => {
      expectWritten(notate(arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS)))
    },
  )

  it.each(
    PATTERN_IDS.flatMap((id) =>
      (['4/4', '3/4', '12/8'] as const).map((meter) => [id, meter] as const),
    ),
  )('writes the pattern %s in %s', (id, meter) => {
    expectWritten(
      notate(
        arrange(chartIn(meter), {
          tonic: note('C'),
          pattern: BUILT_IN_PATTERNS.require(id).pattern,
        }),
      ),
    )
  })
})

/** How many of a score's notes carry a finger. */
const fingersOf = (score: Score) =>
  score.measures
    .flatMap((measure) => score.staves.flatMap((staff) => measure.staves[staff] ?? []))
    .flatMap((voice) => voice.events)
    .flatMap((event) => (event.kind === 'notes' ? event.notes : []))
    .filter((written) => written.finger !== undefined).length

/** How many fingers a performance writes, and how many Verovio draws of them. */
async function fingersDrawn(performance: Parameters<typeof notate>[0]) {
  const score = notate(performance)
  const host = document.createElement('div')
  const options = { scale: 1, fingers: true, names: false, staves: score.staves }
  const layout = await drawScore(score, host, options, new AbortController().signal)
  expect(layout?.measures.length).toBeGreaterThan(0)
  return { written: fingersOf(score), drawn: host.querySelectorAll('g.fing').length }
}

describe('engraving of the content', () => {
  it.each(PIECES.map((piece) => [piece.id, piece] as const))(
    'engraves %s with every finger it writes',
    async (_id, piece) => {
      const { written, drawn } = await fingersDrawn(
        arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
      )
      expect(drawn).toBe(written)
    },
  )

  // Too long a line to engrave whole (the Player engraves it a line at a time): its MEI is checked.
  it('writes a chromatic walk of every chord with every finger for the engraver', () => {
    const [first, ...rest] = CHORD_QUALITIES
    if (!first) throw new Error('the table is empty')
    const score = notate(
      arrangeChromatic(
        {
          root: note('C'),
          chords: [first, ...rest],
          direction: 'up',
          pattern: CHROMATIC.pattern,
          rh: null,
          lh: null,
          inversion: null,
          nearest: true,
        },
        BUILT_IN_PATTERNS,
      ),
    )
    const mei = scoreToMei(score, { staves: score.staves, fingers: true })
    expect(mei.match(/<fing /g)?.length).toBe(fingersOf(score))
  })
})
