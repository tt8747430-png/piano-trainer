import { describe, expect, it } from 'vitest'
import { chordSymbol, note } from '@/shared/lib/music'
import { ContentError } from './content-error'
import { parseChart } from './parse-chart'
import { writeBar } from './write-chart'
import { testSong } from '../testing/test-pieces'

/** Each bar as its chords' symbols with their beats: 'G 2'. */
const read = (lines: readonly string[], meter: '4/4' | '3/4' = '4/4') =>
  parseChart(testSong(lines, { meter })).sections.flatMap((section) =>
    section.lines.flatMap((line) =>
      line.map((bar) => bar.chords.map((chord) => `${chordSymbol(chord)} ${chord.beats}`)),
    ),
  )

function errorOf(lines: readonly string[]): ContentError {
  try {
    parseChart(testSong(lines))
  } catch (error) {
    if (error instanceof ContentError) return error
    throw error
  }
  throw new Error('the chart parsed')
}

describe('parseChart', () => {
  it('reads 4/4 printed as common time, and nothing where the piece does not ask (ADR 0114)', () => {
    expect(parseChart({ ...testSong(['C']), commonTime: true }).commonTime).toBe(true)
    expect(parseChart(testSong(['C']))).not.toHaveProperty('commonTime')
  })

  it('reads a section written in a key of its own, and names a key it cannot read', () => {
    const sections = [
      { kind: 'verse' as const, lines: ['C'] },
      { kind: 'verse' as const, key: 'Db' as const, lines: ['Db'] },
    ]
    const chart = parseChart(testSong([], { sections }))
    expect(chart.sections.map((section) => section.key)).toEqual([
      undefined,
      { tonic: note('D', -1), minor: false },
    ])
    const wrong = [{ kind: 'verse' as const, key: 'H' as 'C', lines: ['C'] }]
    expect(() => parseChart(testSong([], { sections: wrong }))).toThrow(ContentError)
  })

  it('reads a section in a meter of its own, its bars counted in it (ADR 0095)', () => {
    const sections = [
      { kind: 'verse' as const, lines: ['C G-C'] },
      { kind: 'chorus' as const, meter: '3/4' as const, lines: ['F G-C Am@1'] },
      { kind: 'ending' as const, meter: '4/4' as const, lines: ['C'] },
    ]
    const chart = parseChart(testSong([], { sections }))
    // A section in the piece's own meter carries none, as a section in its key carries no key.
    expect(chart.sections.map((section) => section.meter)).toEqual([undefined, '3/4', undefined])
    const beats = (section: number) =>
      chart.sections[section]?.lines
        .flat()
        .map((bar) => [bar.beats, ...bar.chords.map((chord) => chord.beats)])
    expect(beats(0)).toEqual([
      [4, 4],
      [4, 2, 2],
    ])
    expect(beats(1)).toEqual([
      [3, 3],
      [3, 1.5, 1.5],
      [1, 1],
    ])
  })

  it('refuses a section’s meter of another kind, whose beat is another note', () => {
    const sections = [
      { kind: 'verse' as const, lines: ['C'] },
      { kind: 'chorus' as const, meter: '6/8' as const, lines: ['F'] },
    ]
    expect(() => parseChart(testSong([], { sections }))).toThrow(
      /section 2: "6\/8" is a meter of another kind than the piece’s "4\/4"/,
    )
  })

  it('reads the barlines between bars: repeats, endings, a double and the final barline', () => {
    const [line = []] =
      parseChart(testSong(['|: C [1 F :| [2 G || Am |.'])).sections[0]?.lines ?? []
    expect(line.map(({ repeatStart, ending, barline }) => [repeatStart, ending, barline])).toEqual([
      [true, undefined, undefined],
      [undefined, 1, 'repeat'],
      [undefined, 2, 'double'],
      [undefined, undefined, 'final'],
    ])
    expect(errorOf([':| C']).message).toMatch(/barline before any bar/)
    expect(errorOf(['C |:']).message).toMatch(/no bar after/)
    expect(errorOf(['C || |.']).message).toMatch(/two of a kind/)
  })

  it('writes a bar’s barlines back around it', () => {
    const [line = []] =
      parseChart(testSong(['|: C [1 F :| [2 G || Am |.'])).sections[0]?.lines ?? []
    expect(line.map((bar) => writeBar(bar, '4/4')).join(' ')).toBe('|: C [1 F :| [2 G || Am |.')
  })

  it('reads and writes back the signs, the jumps, Fine and To Coda', () => {
    const text = 'C Segno F ToCoda G Fine DS.Coda Coda Am |.'
    const [line = []] = parseChart(testSong([text])).sections[0]?.lines ?? []
    expect(
      line.map(({ segno, coda, jump, fine, toCoda }) => ({ segno, coda, jump, fine, toCoda })),
    ).toEqual(
      [{}, { segno: true, toCoda: true }, { fine: true, jump: 'ds-coda' }, { coda: true }].map(
        (marks) => ({
          segno: undefined,
          coda: undefined,
          jump: undefined,
          fine: undefined,
          toCoda: undefined,
          ...marks,
        }),
      ),
    )
    expect(line.map((bar) => writeBar(bar, '4/4')).join(' ')).toBe(text)
    expect(errorOf(['C DC DS']).message).toMatch(/two of a kind/)
  })

  it('shares a bar equally among chords without beats', () => {
    expect(read(['C Dm G-C'])).toEqual([['C 4'], ['Dm 4'], ['G 2', 'C 2']])
  })

  it('makes a whole bar of chords sharing it in thirds of a beat, no pickup', () => {
    const chart = parseChart(testSong(['C-Dm-Em-F-G-Am C']))
    expect(chart.sections[0]?.lines[0]?.[0]?.beats).toBe(4)
    const compound = parseChart(testSong(['C-Dm-Em-F-G-Am C'], { meter: '6/8' }))
    expect(compound.sections[0]?.lines[0]?.[0]?.beats).toBe(2)
  })

  it('reads `_` as a bar of no chord, the meter’s length or its own given beats (ADR 0094)', () => {
    expect(read(['C _ G'])).toEqual([['C 4'], [], ['G 4']])
    const beats = (line: string, meter: '4/4' | '3/4' = '4/4') =>
      parseChart(testSong([line], { meter })).sections[0]?.lines[0]?.map((bar) => bar.beats)
    expect(beats('_ _@2 _@1.5')).toEqual([4, 2, 1.5])
    expect(beats('_', '3/4')).toEqual([3])
    expect(errorOf(['C _-G']).message).toMatch(/no chord, written alone/)
    expect(errorOf(['_:t1']).message).toMatch(/no chord, written alone/)
    expect(errorOf(['_@20']).message).toContain('"20"')
  })

  it('writes a bar of no chord back as `_`, its beats where they are not the meter’s', () => {
    const text = '|: _ :| _@2 Segno _@1.5 |.'
    const [line = []] = parseChart(testSong([text])).sections[0]?.lines ?? []
    expect(line.map((bar) => writeBar(bar, '4/4')).join(' ')).toBe(text)
  })

  it('reads given beats', () => {
    const chart = parseChart(testSong(['C@1-C/E@1-Dsus4@1-D/F#@1']))
    const bar = chart.sections[0]?.lines[0]?.[0]
    expect(bar?.chords.map((chord) => chord.beats)).toEqual([1, 1, 1, 1])
    expect(bar?.beats).toBe(4)
  })

  it('lets a bar of given beats be shorter than the meter', () => {
    expect(read(['Dm@1-Edim@1 A7@2'])).toEqual([['Dm 1', 'E° 1'], ['A7 2']])
    const chart = parseChart(testSong(['Dm@1-Edim@1']))
    expect(chart.sections[0]?.lines[0]?.[0]?.beats).toBe(2)
  })

  it('shares what given beats leave', () => {
    expect(read(['Gm/E@2-Asus4-A7'])).toEqual([['Gm/E 2', 'Asus4 1', 'A7 1']])
  })

  it('reads half beats', () => {
    expect(read(['C@1.5-G@.5 F'], '3/4')).toEqual([['C 1.5', 'G 0.5'], ['F 3']])
  })

  it('reads method codes, a bar’s first code standing for the chords without one', () => {
    const methods = (lines: string[]) =>
      parseChart(testSong(lines)).sections[0]?.lines[0]?.flatMap((bar) =>
        bar.chords.map((chord) => chord.method),
      )
    expect(methods(['C:t1 F'])).toEqual(['t1', undefined])
    expect(methods(['C-G:1'])).toEqual(['1', '1'])
  })

  it('spells a slash bass that is a chord tone as that tone, unless that writes it oddly', () => {
    const bass = (symbol: string) =>
      parseChart(testSong([symbol])).sections[0]?.lines[0]?.[0]?.chords[0]?.bass
    expect(bass('F#m/Db')).toEqual(note('C', 1))
    expect(bass('D#/G')).toEqual(note('G'))
  })

  it('keeps sections, lines and bars as written, in the piece’s key', () => {
    const chart = parseChart(
      testSong([], {
        key: 'Ebm',
        meter: '3/4',
        sections: [
          { kind: 'verse', lines: ['Ebm B', 'Ebm'] },
          { kind: 'chorus', lines: ['Ab'] },
        ],
      }),
    )
    expect(chart.key).toEqual({ tonic: note('E', -1), minor: true })
    expect(chart.meter).toBe('3/4')
    expect(chart.sections.map((section) => section.lines.map((line) => line.length))).toEqual([
      [2, 1],
      [1],
    ])
  })

  it('names the section, line and bar of an unknown chord', () => {
    const error = errorOf(['C', 'C F Hm'])
    expect(error.pieceId).toBe('bz0')
    expect(error.position).toEqual({ section: 1, line: 2, bar: 3 })
    expect(error.message).toContain('bz0 · section 1, line 2, bar 3')
    expect(error.message).toContain('"Hm"')
  })

  it.each([
    ['C:zz', 'method code "zz"'],
    ['C@0', '"0"'],
    ['C@x', '"x"'],
    ['C@0.3', '"0.3"'],
    ['C@1e8', '"1e8"'],
    ['C@17', '"17"'],
    ['C@12-G@8', 'longer than four bars'],
    ['C@4-G', 'leave no beats'],
    ['C-D-E-F-G', '5 chords'],
    ['  ', 'empty line'],
  ])('refuses %j', (line, problem) => {
    const error = errorOf([line])
    expect(error.message).toContain(problem)
    expect(error.position.section).toBe(1)
    expect(error.position.line).toBe(1)
  })
})
