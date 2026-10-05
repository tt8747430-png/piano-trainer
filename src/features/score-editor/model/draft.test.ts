import { describe, expect, it } from 'vitest'
import {
  isDegreePiece,
  musicOf,
  PIECES,
  readMusic,
  type ChartPiece,
  type PieceMusic,
} from '@/entities/piece'
import { midi, note } from '@/shared/lib/music'
import { readDraft, writeDraft } from './draft'
import { barAt, barsOf, chordsAt, totalTicks } from './timeline'

const CHART_PIECES = PIECES.filter((piece): piece is ChartPiece => !isDegreePiece(piece))

const WRITTEN: PieceMusic = {
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [
    { kind: 'verse', n: 1, lines: ['G@1', 'C-D G'] },
    { kind: 'chorus', last: true, lines: ['Em@2-Am@1-D7@1:t1'] },
  ],
  melody: 'D4/1 | G4/2 A4/1 B4/1 | C5/4',
  hands: { lh: '- | C3/4 E3+G3^2/1@2 | G2/4 | -', rh: '- | - | B3+D4/2 r/2 | -' },
}

describe('the draft', () => {
  it.each(CHART_PIECES.map((piece) => [piece.id, piece] as const))(
    'reads %s and writes it back the same',
    (_id, piece) => {
      const music = musicOf(piece)
      expect(readMusic(writeDraft(readDraft(music)))).toEqual(readMusic(music))
    },
  )

  it('writes back written hands, a pickup, sections’ headings and method codes', () => {
    const written = writeDraft(readDraft(WRITTEN))
    expect(readMusic(written)).toEqual(readMusic(WRITTEN))
    expect(written.sections.map(({ lines: _lines, ...heading }) => heading)).toEqual([
      { kind: 'verse', n: 1 },
      { kind: 'chorus', last: true },
    ])
  })

  it('holds chords by where they start in their bar, the tune and hands on the timeline', () => {
    const draft = readDraft(WRITTEN)
    expect(draft.key).toEqual({ tonic: note('G'), minor: false })
    const [pickup, second] = barsOf(draft)
    expect(pickup).toMatchObject({ index: 0, section: 0, line: 0, start: 0 })
    expect(pickup?.bar.ticks).toBe(12)
    expect(second?.bar.chords.map((chord) => chord.at)).toEqual([0, 24])
    expect(draft.melody[1]).toEqual({
      midi: midi(67),
      spelled: note('G'),
      startTick: 12,
      durationTicks: 24,
    })
    expect(draft.hands.lh.map((n) => [n.midi, n.startTick, n.durationTicks, n.finger])).toEqual([
      [48, 12, 48, undefined],
      [52, 24, 12, undefined],
      [55, 24, 12, 2],
      [43, 60, 48, undefined],
    ])
    expect(barsOf(draft).map(({ bar }) => [bar.rh, bar.lh])).toEqual([
      [false, false],
      [false, true],
      [true, true],
      [false, false],
    ])
  })

  it('finds the bar a tick is in, a barline in the later bar, the end in the last', () => {
    const draft = readDraft(WRITTEN)
    expect(totalTicks(draft)).toBe(12 + 48 + 48 + 48)
    expect(barAt(draft, 12).index).toBe(1)
    expect(barAt(draft, 11).index).toBe(0)
    expect(barAt(draft, totalTicks(draft)).index).toBe(3)
  })

  it('gives each chord of a bar its length', () => {
    const bar = barsOf(readDraft(WRITTEN))[3]?.bar
    if (!bar) throw new Error('a fourth bar')
    expect(chordsAt(bar).map(({ at, ticks, method }) => [at, ticks, method])).toEqual([
      [0, 24, 't1'],
      [24, 12, 't1'],
      [36, 12, 't1'],
    ])
  })
})
