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
import { chordSymbol, midi, note } from '@/shared/lib/music'
import { musicToSave, readDraft, writeDraft, type Draft } from './draft'
import { barAt, barsOf, chordAt, chordsAt, chordWrittenAt, totalTicks } from './timeline'
import { shape, staffNotes } from '../testing/test-draft'

const CHART_PIECES = PIECES.filter((piece): piece is ChartPiece => !isDegreePiece(piece))

/** The music's chart as it sounds without its hands, and its staves: what a round trip keeps as written. */
function chartAndStaves(music: PieceMusic) {
  const { chart, staves } = readMusic(music)
  const sections = chart.sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) => line.map(({ hands: _hands, ...bar }) => bar)),
  }))
  return { chart: { ...chart, sections }, staves }
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
  staves: [{ notes: 'D4/1 | G4/2 A4/1 B4/1 | C5/4' }],
  hands: { lh: '- | C3/4 E3+G3^2/1@2 | G2/4 | -', rh: '- | - | B3+D4/2 r/2 | -' },
}

describe('the draft', () => {
  it('writes a section’s bars in its own meter, whole bars without their beats (ADR 0095)', () => {
    const music: PieceMusic = {
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [
        { kind: 'verse', lines: ['C G'] },
        { kind: 'chorus', meter: '3/4', lines: ['F G-C'] },
      ],
    }
    const draft = readDraft(music)
    expect(barsOf(draft).map(({ bar }) => bar.ticks)).toEqual([96, 96, 72, 72])
    expect(writeDraft(draft).sections).toEqual(music.sections)
  })

  it.each(CHART_PIECES.map((piece) => [piece.id, piece] as const))(
    'reads %s, every bar written, and writes it back the same',
    (_id, piece) => {
      const music = musicOf(piece)
      const draft = readDraft(music)
      const written = writeDraft(draft)
      expect(chartAndStaves(written)).toEqual(chartAndStaves(music))
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
    expect(chartAndStaves(written)).toEqual(chartAndStaves(WRITTEN))
    expect(written.hands?.lh).toMatch(/\| C3\/4 E3\+G3\^2\/1@2 \| G2\/4 \|/)
    expect(written.hands?.rh).toMatch(/\| B3\+D4\/2 \|/)
    expect(written.sections.map(({ lines: _lines, ...heading }) => heading)).toEqual([
      { kind: 'verse', n: 1 },
      { kind: 'chorus', last: true },
    ])
  })

  it('reads and writes back 4/4 printed as common time (ADR 0114)', () => {
    const common = readDraft({ ...WRITTEN, timeSymbol: true })
    expect(common.timeSymbol).toBe(true)
    expect(writeDraft(common).timeSymbol).toBe(true)
    expect(writeDraft(readDraft(WRITTEN))).not.toHaveProperty('timeSymbol')
  })

  it.each([
    ['2/2', 'G C', 'D4/2 E4/2 | F#4/4'],
    ['3/2', 'G C', 'D4/2 E4/4 | F#4/6'],
    ['5/4', 'G@3 D G', 'D4/3 | E4/5 | F#4/5'],
    ['6/4', 'G C', 'D4/3 E4/3 | F#4/6'],
    ['7/8', 'G C', 'D4/1 E4/1 F#4/1.5 | G4/3.5'],
    ['9/8', 'G C', 'D4/1 E4/2 | F#4/3'],
    ['3/8', 'G C', 'D4/1:3 E4/2:3 | F#4/1'],
  ] as const)('reads and writes back a song in %s as it was (ADR 0114)', (meter, line, notes) => {
    const music: PieceMusic = {
      key: 'G',
      meter,
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: [line] }],
      staves: [{ notes }],
      hands: { rh: notes.replace(/D4|E4|F#4|G4/g, 'B3'), lh: notes.replace(/D4|E4|F#4|G4/g, 'G2') },
    }
    const draft = readDraft(music)
    const written = writeDraft(draft)
    expect(chartAndStaves(written)).toEqual(chartAndStaves(music))
    expect(readDraft(written)).toEqual(draft)
    expect(musicToSave(draft)).toEqual(written)
  })

  it('reads and writes back 2/2 printed as cut time (ADR 0114)', () => {
    const cut = readDraft({ ...WRITTEN, meter: '2/2', timeSymbol: true })
    expect(cut.timeSymbol).toBe(true)
    expect(writeDraft(cut)).toMatchObject({ meter: '2/2', timeSymbol: true })
  })

  it('carries no section’s own pattern: the song’s form alone (ADR 0091)', () => {
    const { hands: _hands, staves: _staves, ...plain } = WRITTEN
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
    // A note of twenty-five beats, past six bars tied, is longer than the music writes a note.
    const five = readDraft({
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G G G G G G G'] }],
      staves: [{ notes: 'D4/4 | D4/4 | D4/4 | D4/4 | D4/4 | D4/4 | D4/4' }],
    })
    const [first] = staffNotes(five)
    if (!first) throw new Error('a note')
    expect(musicToSave(five)).not.toBeNull()
    const long = {
      ...five,
      staves: [{ clef: 'treble' as const, notes: [{ ...first, durationTicks: 25 * 24 }] }],
    }
    expect(musicToSave(long)).toBeNull()
  })

  it('holds each single staff by its place, its name and clef with its notes (ADR 0097)', () => {
    const music: PieceMusic = {
      ...WRITTEN,
      staves: [
        { name: 'Voice', notes: 'D4/1 | G4/2 A4/1 B4/1 | C5/4' },
        { name: { en: 'Cello', ru: 'Виолончель' }, clef: 'bass', notes: 'r/1 | G2/4 | C3/4' },
        { notes: 'r/1 | r/4 | r/4' },
      ],
      leadSheet: true,
    }
    const draft = readDraft(music)
    expect(draft.staves.map(({ name, clef }) => [name, clef])).toEqual([
      ['Voice', 'treble'],
      [{ en: 'Cello', ru: 'Виолончель' }, 'bass'],
      [undefined, 'treble'],
    ])
    expect(shape(staffNotes(draft, 1))).toEqual(['G2@24/96', 'C3@120/96'])
    expect(staffNotes(draft, 2)).toEqual([])
    expect(draft.leadSheet).toBe(true)
    // An empty staff is written as a rest, so it stays (ADR 0072).
    const [voice, cello] = music.staves ?? []
    expect(writeDraft(draft).staves).toEqual([voice, cello, { notes: 'r/1' }])
  })

  it('holds chords by where they start in their bar, the staves and hands on the timeline', () => {
    const draft = readDraft(WRITTEN)
    expect(draft.key).toEqual({ tonic: note('G'), minor: false })
    const [pickup, second] = barsOf(draft)
    expect(pickup).toMatchObject({ index: 0, section: 0, line: 0, start: 0 })
    expect(pickup?.bar.ticks).toBe(24)
    expect(second?.bar.chords.map((chord) => chord.at)).toEqual([0, 48])
    expect(staffNotes(draft)[1]).toEqual({
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

  it('finds the chord sounding at a tick in its bar; none in a bar of no chord (ADR 0094)', () => {
    const draft = readDraft({ ...WRITTEN, sections: [{ kind: 'verse', lines: ['G@1 C-D _ Em'] }] })
    const at = (tick: number) => {
      const chord = chordAt(draft, tick)
      return chord && chordSymbol(chord)
    }
    expect([0, 24, 71, 72, 120, 216, 312].map(at)).toEqual([
      'G',
      'C',
      'C',
      'D',
      undefined,
      'Em',
      'Em',
    ])
  })

  it('finds the chord written at a tick where one starts, none on a beat a chord sounds through', () => {
    const draft = readDraft({ ...WRITTEN, sections: [{ kind: 'verse', lines: ['G@1 C-D _ Em'] }] })
    const at = (tick: number) => {
      const chord = chordWrittenAt(draft, tick)
      return chord && chordSymbol(chord)
    }
    expect([0, 24, 48, 72, 120, 216, 240].map(at)).toEqual([
      'G',
      'C',
      undefined,
      'D',
      undefined,
      'Em',
      undefined,
    ])
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
