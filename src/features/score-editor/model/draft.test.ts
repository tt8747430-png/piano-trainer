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
import { musicToSave, readDraft, writeDraft } from './draft'
import { barAt, barsOf, chordsAt, totalTicks } from './timeline'

const CHART_PIECES = PIECES.filter((piece): piece is ChartPiece => !isDegreePiece(piece))

type Hand = readonly { readonly midi: number; readonly startTick: number }[] | undefined
const lowToHigh = (notes: Hand) =>
  notes && [...notes].sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)

/** Music as it sounds: notes struck together in any order (a hymn writes them high to low, the editor low to high). */
function heard(music: PieceMusic) {
  const { chart, melody } = readMusic(music)
  const sections = chart.sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) =>
      line.map((bar) =>
        bar.hands
          ? { ...bar, hands: { rh: lowToHigh(bar.hands.rh), lh: lowToHigh(bar.hands.lh) } }
          : bar,
      ),
    ),
  }))
  return { chart: { ...chart, sections }, melody }
}

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
      expect(heard(writeDraft(readDraft(music)))).toEqual(heard(music))
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

  it('saves only music that reads back', () => {
    const draft = readDraft(WRITTEN)
    expect(musicToSave(draft)).toEqual(writeDraft(draft))
    const [section] = draft.sections
    if (!section) throw new Error('no section')
    // A bar with no chord writes nothing the chart can read.
    const unread = [{ ...section, lines: [[{ ticks: 96, chords: [], rh: false, lh: false }]] }]
    expect(musicToSave({ ...draft, sections: unread })).toBeNull()
  })

  it('holds chords by where they start in their bar, the tune and hands on the timeline', () => {
    const draft = readDraft(WRITTEN)
    expect(draft.key).toEqual({ tonic: note('G'), minor: false })
    const [pickup, second] = barsOf(draft)
    expect(pickup).toMatchObject({ index: 0, section: 0, line: 0, start: 0 })
    expect(pickup?.bar.ticks).toBe(24)
    expect(second?.bar.chords.map((chord) => chord.at)).toEqual([0, 48])
    expect(draft.melody[1]).toEqual({
      midi: midi(67),
      spelled: note('G'),
      startTick: 24,
      durationTicks: 48,
    })
    expect(draft.hands.lh.map((n) => [n.midi, n.startTick, n.durationTicks, n.finger])).toEqual([
      [48, 24, 96, undefined],
      [52, 48, 24, undefined],
      [55, 48, 24, 2],
      [43, 120, 96, undefined],
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
    expect(totalTicks(draft)).toBe(24 + 96 + 96 + 96)
    expect(barAt(draft, 24).index).toBe(1)
    expect(barAt(draft, 23).index).toBe(0)
    expect(barAt(draft, totalTicks(draft)).index).toBe(3)
  })

  it('gives each chord of a bar its length', () => {
    const bar = barsOf(readDraft(WRITTEN))[3]?.bar
    if (!bar) throw new Error('a fourth bar')
    expect(chordsAt(bar).map(({ at, ticks, method }) => [at, ticks, method])).toEqual([
      [0, 48, 't1'],
      [48, 24, 't1'],
      [72, 24, 't1'],
    ])
  })
})
