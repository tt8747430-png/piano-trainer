import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { lineWords, lyricLines, soundingChip, type LyricLine } from './lyric-lines'

/** A song of 4/4 bars in C, its sections' lines, a staff over the piano, and its verses. */
function song(
  lines: readonly (readonly string[])[],
  { notes, lyrics }: { notes?: string; lyrics?: readonly string[] } = {},
): Performance {
  const piece: ChartPiece = {
    id: 'my-1',
    kind: 'song',
    title: 'Morning',
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: lines.map((each) => ({ kind: 'verse', lines: each })),
    ...(notes ? { staves: [{ notes }] } : {}),
    ...(lyrics ? { lyrics } : {}),
  }
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

/** Each line as its chips over their words, verse by verse: `[symbol, verse 1, verse 2…]`. */
const shown = (performance: Performance, lines: readonly LyricLine[]) =>
  lines.map(({ segments }) =>
    segments.map(({ chord, verses }) => [
      chord === null ? null : (performance.chords[chord]?.symbol ?? '?'),
      ...verses.map(({ text, goesOn }) => (goesOn ? `${text}-` : text)),
    ]),
  )

describe('lyricLines', () => {
  it('puts each chord over the words sung up to the next, a word’s syllables joined', () => {
    const performance = song([['C G']], {
      notes: 'E4/1 F4/1 G4/2 | A4/2 B4/2',
      lyrics: ['Si- lent night, ho- ly'],
    })
    const lines = lyricLines(performance)
    expect(shown(performance, lines)).toEqual([
      [
        ['C', 'Silent night,'],
        ['G', 'holy'],
      ],
    ])
    expect(lines[0]).toMatchObject({ section: 0, bars: [0, 1], from: 0, to: 192, sung: true })
  })

  it('starts a chord between syllables at its place there, a word it splits going on', () => {
    // F comes on beat 3 while "Ah" holds; G under a rest, before "men".
    const performance = song([['C@2-F@2 G']], {
      notes: 'E4/3 r/1 | F4/4',
      lyrics: ['Ah- men'],
    })
    expect(shown(performance, lyricLines(performance))).toEqual([
      [
        ['C', 'Ah-'],
        ['F', ''],
        ['G', 'men'],
      ],
    ])
  })

  it('shows a chord held over bar lines once, and again after a bar of none', () => {
    const performance = song([['C C _ C']], {
      notes: 'E4/4 | F4/4 | G4/4 | A4/4',
      lyrics: ['One two three four'],
    })
    expect(shown(performance, lyricLines(performance))).toEqual([
      [
        ['C', 'One two three'],
        ['C', 'four'],
      ],
    ])
  })

  it('leaves the words before a line’s first chord without one', () => {
    const performance = song([['_ G']], { notes: 'E4/4 | F4/4', lyrics: ['Oh say'] })
    expect(shown(performance, lyricLines(performance))).toEqual([
      [
        [null, 'Oh'],
        ['G', 'say'],
      ],
    ])
  })

  it('stacks every verse in the same chords, a verse not sung there empty', () => {
    const performance = song([['C G']], {
      notes: 'E4/2 F4/2 | G4/4',
      lyrics: ['Now the day', 'And the'],
    })
    expect(shown(performance, lyricLines(performance))).toEqual([
      [
        ['C', 'Now the', 'And the'],
        ['G', 'day', ''],
      ],
    ])
  })

  it('leaves out a held syllable’s marks: a melisma sings one syllable', () => {
    const performance = song([['C']], { notes: 'E4/1 F4/1 G4/2', lyrics: ['Glo-_ ria'] })
    expect(shown(performance, lyricLines(performance))).toEqual([[['C', 'Gloria']]])
  })

  it('gives a line of no words its chords alone, one per change, by section and line', () => {
    const performance = song([['C C G G', 'Am F'], ['G']])
    const lines = lyricLines(performance)
    expect(shown(performance, lines)).toEqual([[['C'], ['G']], [['Am'], ['F']], [['G']]])
    expect(lines.map(({ section, bars, sung }) => ({ section, bars, sung }))).toEqual([
      { section: 0, bars: [0, 1, 2, 3], sung: false },
      { section: 0, bars: [4, 5], sung: false },
      { section: 1, bars: [6], sung: false },
    ])
  })

  it('writes each bar once, as first played, where the repeats are played', () => {
    // C F repeated, then G: played C F C F G.
    const performance = song([['|: C F :|', 'G']])
    const lines = lyricLines(performance)
    expect(shown(performance, lines)).toEqual([[['C'], ['F']], [['G']]])
    expect(lines.map(({ bars, from }) => ({ bars, from }))).toEqual([
      { bars: [0, 1], from: 0 },
      { bars: [2], from: 384 },
    ])
  })
})

describe('lineWords', () => {
  it('is a line’s words in a verse, its syllables joined across its chords', () => {
    const performance = song([['C@2-F@2 G']], {
      notes: 'E4/2 F4/2 | G4/4',
      lyrics: ['Ho- ly night', 'Calm and'],
    })
    const [line] = lyricLines(performance)
    if (!line) throw new Error('a line')
    expect(lineWords(line)).toBe('Holy night')
    expect(lineWords(line, 1)).toBe('Calm and')
    expect(lineWords(line, 2)).toBe('')
  })

  it('times each word of a verse from its first syllable’s note, a word that goes on with a hyphen', () => {
    const performance = song([['C G', 'F']], {
      notes: 'E4/1 F4/1 G4/2 | A4/2 B4/2 | C5/4',
      lyrics: ['Si- lent night, ho- ly'],
    })
    const [first] = lyricLines(performance)
    expect(first?.words[0]).toEqual([
      { text: 'Silent', at: 0 },
      { text: 'night,', at: 48 },
      { text: 'holy', at: 96 },
    ])
    // "Hal-le-lu" over two lines: its first line ends on a hyphen.
    const [ends, goesOn] = lyricLines(
      song([['C', 'F']], { notes: 'E4/2 F4/2 | G4/4', lyrics: ['Hal- le- lu'] }),
    )
    expect(ends?.words[0]).toEqual([{ text: 'Halle-', at: 0 }])
    expect(goesOn?.words[0]).toEqual([{ text: 'lu', at: 96 }])
  })
})

describe('soundingChip', () => {
  const performance = song([['C@2-F@2 G', 'C C']])
  const lines = lyricLines(performance)

  it('is the chip whose chord sounds in the beat, as written, the later of two in it', () => {
    expect(soundingChip(lines, { from: 0, to: 24 })).toEqual({ line: 0, segment: 0 })
    expect(soundingChip(lines, { from: 48, to: 72 })).toEqual({ line: 0, segment: 1 })
    expect(soundingChip(lines, { from: 40, to: 64 })).toEqual({ line: 0, segment: 1 })
    expect(soundingChip(lines, { from: 120, to: 144 })).toEqual({ line: 0, segment: 2 })
  })

  it('holds a chord’s one chip over the bars it is held', () => {
    expect(soundingChip(lines, { from: 300, to: 324 })).toEqual({ line: 1, segment: 0 })
  })

  it('is none in a bar of no chord', () => {
    const empty = song([['C _']])
    expect(soundingChip(lyricLines(empty), { from: 96, to: 120 })).toBeNull()
  })
})
