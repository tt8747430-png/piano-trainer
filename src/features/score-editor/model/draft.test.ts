import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import {
  HAND_IDS,
  isDegreePiece,
  musicOf,
  PIECES,
  readMusic,
  type ChartPiece,
  type PieceMusic,
} from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { midi, note } from '@/shared/lib/music'
import { musicToSave, readDraft, writeDraft, type Draft } from './draft'
import { barAt, barsOf, chordsAt, totalTicks } from './timeline'

const CHART_PIECES = PIECES.filter((piece): piece is ChartPiece => !isDegreePiece(piece))

/** The music's chart as it sounds without its hands, and its tune: what a round trip keeps as written. */
function chartAndTune(music: PieceMusic) {
  const { chart, melody } = readMusic(music)
  const sections = chart.sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) => line.map(({ hands: _hands, ...bar }) => bar)),
  }))
  return { chart: { ...chart, sections }, melody }
}

/** Each hand's notes as they sound: key, onset, length and finger, struck together in any order. */
const played = (draft: Draft) =>
  HAND_IDS.map((hand) =>
    [...draft.hands[hand]]
      .sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
      .map((n) => [n.midi, n.startTick, n.durationTicks, n.finger ?? 0]),
  )

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
    'reads %s, every bar written, and writes it back the same',
    (_id, piece) => {
      const music = musicOf(piece)
      const draft = readDraft(music)
      const written = writeDraft(draft)
      expect(chartAndTune(written)).toEqual(chartAndTune(music))
      expect(played(readDraft(written))).toEqual(played(draft))
    },
  )

  it('writes out the bars the pattern played as the Player plays them, each note inside its bar (ADR 0091)', () => {
    const draft = readDraft(WRITTEN)
    const piece: ChartPiece = { id: 'written', kind: 'song', title: '', ...WRITTEN }
    const { notes } = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS)
    // The last bar, both hands the pattern's: the pattern's notes with their fingers, cut at its end.
    const [from, to] = [216, 312]
    const inLast = (hand: 'rh' | 'lh') =>
      notes
        .filter((n) => n.hand === hand && n.startTick >= from && n.startTick < to)
        .map((n) => [n.midi, n.startTick, Math.min(n.durationTicks, to - n.startTick), n.finger])
    for (const hand of HAND_IDS) {
      expect(inLast(hand).length).toBeGreaterThan(0)
      expect(
        draft.hands[hand]
          .filter((n) => n.startTick >= from)
          .map((n) => [n.midi, n.startTick, n.durationTicks, n.finger]),
      ).toEqual(inLast(hand))
    }
    // Written back, every bar of both hands is written: no bar is left to the pattern.
    const written = writeDraft(draft)
    expect(written.hands).toEqual({ rh: expect.any(String), lh: expect.any(String) })
    expect(written.hands?.lh?.split('|')).toHaveLength(4)
    expect(written.hands?.lh).not.toMatch(/(^|\| )- /)
  })

  it('writes back written hands, a pickup, sections’ headings and method codes', () => {
    const written = writeDraft(readDraft(WRITTEN))
    expect(chartAndTune(written)).toEqual(chartAndTune(WRITTEN))
    expect(written.hands?.lh).toMatch(/\| C3\/4 E3\+G3\^2\/1@2 \| G2\/4 \|/)
    expect(written.hands?.rh).toMatch(/\| B3\+D4\/2 \|/)
    expect(written.sections.map(({ lines: _lines, ...heading }) => heading)).toEqual([
      { kind: 'verse', n: 1 },
      { kind: 'chorus', last: true },
    ])
  })

  it('carries no section’s own pattern: the song’s form alone (ADR 0091)', () => {
    const { hands: _hands, melody: _melody, ...plain } = WRITTEN
    const patterned: PieceMusic = {
      ...plain,
      sections: [{ kind: 'verse', pattern: 'M3', lines: ['G C'] }],
    }
    const draft = readDraft(patterned)
    expect(draft.sections[0]?.heading).toEqual({ kind: 'verse' })
    expect(writeDraft(draft).sections[0]).not.toHaveProperty('pattern')
  })

  it('saves only music that reads back', () => {
    const draft = readDraft(WRITTEN)
    expect(musicToSave(draft)).toEqual(writeDraft(draft))
    // A note of twenty beats, five bars tied, is longer than the music writes a note.
    const five = readDraft({
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G G G G G'] }],
      melody: 'D4/4 | D4/4 | D4/4 | D4/4 | D4/4',
    })
    const [first] = five.melody
    if (!first) throw new Error('a note')
    expect(musicToSave(five)).not.toBeNull()
    expect(musicToSave({ ...five, melody: [{ ...first, durationTicks: 20 * 24 }] })).toBeNull()
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
    // The left hand's bars 2 and 3, as written.
    expect(
      draft.hands.lh
        .filter((n) => n.startTick >= 24 && n.startTick < 216)
        .map((n) => [n.midi, n.startTick, n.durationTicks, n.finger]),
    ).toEqual([
      [48, 24, 96, undefined],
      [52, 48, 24, undefined],
      [55, 48, 24, 2],
      [43, 120, 96, undefined],
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
