import { describe, expect, it } from 'vitest'
import { chordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import { ContentError } from './content-error'
import { testProgression, testSong } from '../testing/test-pieces'
import {
  chartOf,
  hasChartPlan,
  hasWrittenStaves,
  patternsOfPiece,
  pieceFit,
  sectionCount,
  stavesOf,
} from './chart'
import { lyricsStaff } from './types'

const firstSymbol = (...args: Parameters<typeof chartOf>) => {
  const chord = chartOf(...args).sections[0]?.lines[0]?.[0]?.chords[0]
  return chord && chordSymbol(chord)
}

describe('chartOf', () => {
  it('parses a song’s chart', () => {
    expect(firstSymbol(testSong(['Am7 D']))).toBe('Am7')
  })

  it('voices a progression by its default unless another is chosen', () => {
    const twoFive = testProgression('ii:min:4 V:dom:4 I:maj:8')
    expect(firstSymbol(twoFive)).toBe('Dm7')
    expect(firstSymbol(twoFive, 'ninths')).toBe('Dm9')
  })

  it('keeps a fixed chord size whatever is asked', () => {
    const fixed = testProgression('ii:min:4', {
      chordSize: { default: 'triads', choosable: false },
    })
    expect(firstSymbol(fixed, 'ninths')).toBe('Dm')
  })
})

describe('chartOf’s pedal (ADR 0097)', () => {
  it('reads the piece’s pedal line into its chart, none where it has none', () => {
    const B = TICKS_PER_BEAT
    expect(chartOf(testSong(['C G'], { pedal: 'down@0 change@2 up@3.5' })).pedal).toEqual([
      { tick: 0, kind: 'down' },
      { tick: 2 * B, kind: 'change' },
      { tick: 3.5 * B, kind: 'up' },
    ])
    expect(chartOf(testSong(['C G']))).not.toHaveProperty('pedal')
  })

  it('throws a ContentError for an event it cannot read', () => {
    expect(() => chartOf(testSong(['C'], { pedal: 'down@0 lift@2' }))).toThrow(ContentError)
  })
})

describe('sectionCount', () => {
  it('counts a chart’s sections, a progression of one line as one', () => {
    const verse = { kind: 'verse', lines: ['C G'] } as const
    expect(sectionCount(testSong(['C'], { sections: [verse, verse, verse] }))).toBe(3)
    expect(sectionCount(testProgression('ii:min:4 V:dom:4'))).toBe(1)
    expect(sectionCount(testProgression([verse, verse]))).toBe(2)
  })
})

describe('stavesOf (ADR 0097)', () => {
  it('reads a song’s single staves top down, each with its clef; a progression has none', () => {
    const song = testSong(['C'], {
      staves: [{ notes: 'C5/4' }, { name: 'Cello', clef: 'bass', notes: 'C3/2 G2/2' }],
    })
    expect(stavesOf(song).map(({ clef, notes }) => [clef, notes.map((n) => n.midi)])).toEqual([
      ['treble', [72]],
      ['bass', [48, 43]],
    ])
    expect(stavesOf(testSong(['C']))).toEqual([])
    expect(stavesOf(testProgression('I:maj:4'))).toEqual([])
  })
})

describe('the staff a piece’s lyrics are on (ADR 0097)', () => {
  const hands = { rh: 'C4/2 D4/2 | E4/4' }
  /** What the upper staff's notes sing, in order. */
  const upper = (piece: Parameters<typeof chartOf>[0]) =>
    chartOf(piece)
      .sections.flatMap((section) => section.lines.flat())
      .flatMap((bar) => bar.hands?.rh ?? [])
      .flatMap((n) => n.lyrics?.[0]?.text ?? [])
  /** What each single staff's notes sing, in order. */
  const sung = (piece: Parameters<typeof chartOf>[0]) =>
    stavesOf(piece).map(({ notes }) => notes.flatMap((n) => n.lyrics?.[0]?.text ?? []))
  const STAVES = [{ notes: 'G4/4 | A4/4' }, { notes: 'E4/4 | F4/4' }]

  it('is the top single staff’s where the piece has one, else the upper staff’s', () => {
    const tuned = testSong(['C G'], { staves: STAVES, hands, lyrics: ['one two'] })
    expect(lyricsStaff(tuned)).toBe(0)
    expect(sung(tuned)).toEqual([['one', 'two'], []])
    expect(upper(tuned)).toEqual([])
    const untuned = testSong(['C G'], { hands, lyrics: ['one two three'] })
    expect(lyricsStaff(untuned)).toBe('rh')
    expect(upper(untuned)).toEqual(['one', 'two', 'three'])
  })

  it('is the staff lyricsOn names: another single staff, or the upper one', () => {
    const second = testSong(['C G'], { staves: STAVES, hands, lyrics: ['one two'], lyricsOn: 1 })
    expect(sung(second)).toEqual([[], ['one', 'two']])
    const kept = testSong(['C G'], {
      staves: STAVES,
      hands,
      lyrics: ['one two three'],
      lyricsOn: 'rh',
    })
    expect(lyricsStaff(kept)).toBe('rh')
    expect(sung(kept)).toEqual([[], []])
    expect(upper(kept)).toEqual(['one', 'two', 'three'])
  })

  it('is the content’s mistake on a staff the piece has not', () => {
    const lost = testSong(['C'], { staves: [{ notes: 'C5/4' }], lyrics: ['one'], lyricsOn: 2 })
    expect(() => stavesOf(lost)).toThrow(/staff 3/)
  })
})

/** A song of two sections, the second playing a pattern of its own. */
const withSectionPattern = () => {
  const song = testSong(['C F'])
  const [verse] = song.sections
  if (!verse) throw new Error('a verse')
  return {
    ...song,
    sections: [verse, { ...verse, kind: 'chorus' as const, pattern: 'M3' as const }],
  }
}

describe('hasChartPlan', () => {
  it('is true only for a chart that names a method, or a section that has its own pattern', () => {
    expect(hasChartPlan(withSectionPattern())).toBe(true)
    expect(hasChartPlan(testSong(['C:t1 F']))).toBe(true)
    expect(hasChartPlan(testSong(['C F']))).toBe(false)
    expect(hasChartPlan(testProgression('I:maj:4'))).toBe(false)
  })
})

describe('pieceFit', () => {
  it('gives a pattern the piece’s methods, tune, key and meter', () => {
    expect(pieceFit(testSong(['C:t1 F'], { staves: [{ notes: 'C4/4' }] }))).toEqual({
      methodCodes: true,
      chart: ['t1', 'r4'],
      tune: true,
      key: true,
      simpleTime: true,
    })
    expect(pieceFit(testSong(['C'], { meter: '6/8' }))).toMatchObject({
      methodCodes: false,
      tune: false,
      simpleTime: false,
    })
  })
})

describe('patternsOfPiece', () => {
  it('plays the piece’s own pattern only where a chord names no method', () => {
    expect([...patternsOfPiece(testSong(['C:t1 F:3']))].sort()).toEqual(['M3', 't1'])
    expect([...patternsOfPiece(testSong(['C:t1 F']))].sort()).toEqual(['r4', 't1'])
    expect([...patternsOfPiece(testSong(['C F']))]).toEqual(['r4'])
    expect([...patternsOfPiece(testProgression('I:maj:4'))]).toEqual(['block'])
  })

  it('plays a section’s own pattern in its chords', () => {
    expect([...patternsOfPiece(withSectionPattern())].sort()).toEqual(['M3', 'r4'])
  })
})

describe('hasWrittenStaves (A35)', () => {
  const both = (rh: string, lh: string) => testSong(['C G'], { hands: { rh, lh } })

  it('is a score where both hands are written in every bar', () => {
    expect(hasWrittenStaves(both('C5/4 | D5/4', 'C3/4 | G2/4'))).toBe(true)
  })

  it('is a chart where the pattern plays a bar, or a hand is not written', () => {
    expect(hasWrittenStaves(both('C5/4 | -', 'C3/4 | G2/4'))).toBe(false)
    expect(hasWrittenStaves(both('clef:bass - | D5/4', 'C3/4 | G2/4'))).toBe(false)
    expect(hasWrittenStaves(testSong(['C G'], { hands: { rh: 'C5/4 | D5/4' } }))).toBe(false)
  })

  it('is a chart for a song whose piano plays its chords, a tune staff over it or not', () => {
    expect(hasWrittenStaves(testSong(['C G'], { staves: [{ notes: 'C5/4 D5/4' }] }))).toBe(false)
    expect(hasWrittenStaves(testProgression('ii:min:4 V:dom:4'))).toBe(false)
  })
})
