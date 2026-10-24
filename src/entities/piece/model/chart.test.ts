import { describe, expect, it } from 'vitest'
import { chordSymbol } from '@/shared/lib/music'
import { testProgression, testSong } from '../testing/test-pieces'
import { chartOf, hasChartPlan, melodyOf, patternsOfPiece, pieceFit } from './chart'
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

describe('melodyOf', () => {
  it('reads a song’s tune; a progression has none', () => {
    expect(melodyOf(testSong(['C'], { melody: 'C4/4' }))).toHaveLength(1)
    expect(melodyOf(testSong(['C']))).toBeUndefined()
    expect(melodyOf(testProgression('I:maj:4'))).toBeUndefined()
  })
})

describe('the staff a piece’s lyrics are on (ADR 0093)', () => {
  const hands = { rh: 'C4/2 D4/2 | E4/4' }
  /** What the upper staff's notes sing, in order. */
  const upper = (piece: Parameters<typeof chartOf>[0]) =>
    chartOf(piece)
      .sections.flatMap((section) => section.lines.flat())
      .flatMap((bar) => bar.hands?.rh ?? [])
      .flatMap((n) => n.lyrics?.[0]?.text ?? [])

  it('is the melody’s where the piece has one, else the upper staff’s', () => {
    const tuned = testSong(['C G'], { melody: 'G4/4 | A4/4', hands, lyrics: ['one two'] })
    expect(lyricsStaff(tuned)).toBe('melody')
    expect(melodyOf(tuned)?.map((n) => n.lyrics?.[0]?.text)).toEqual(['one', 'two'])
    expect(upper(tuned)).toEqual([])
    const untuned = testSong(['C G'], { hands, lyrics: ['one two three'] })
    expect(lyricsStaff(untuned)).toBe('rh')
    expect(upper(untuned)).toEqual(['one', 'two', 'three'])
  })

  it('stays the upper staff where a melody comes to a song whose words are there (`lyricsOn`)', () => {
    const kept = testSong(['C G'], {
      melody: 'G4/4 | A4/4',
      hands,
      lyrics: ['one two three'],
      lyricsOn: 'rh',
    })
    expect(lyricsStaff(kept)).toBe('rh')
    expect(melodyOf(kept)?.some((n) => n.lyrics)).toBe(false)
    expect(upper(kept)).toEqual(['one', 'two', 'three'])
    // On the melody where there is none: the upper staff, the only one there.
    expect(lyricsStaff(testSong(['C'], { hands, lyricsOn: 'melody' }))).toBe('rh')
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
    expect(pieceFit(testSong(['C:t1 F'], { melody: 'C4/4' }))).toEqual({
      methodCodes: true,
      chart: ['t1', 'r4'],
      melody: true,
      key: true,
      simpleTime: true,
    })
    expect(pieceFit(testSong(['C'], { meter: '6/8' }))).toMatchObject({
      methodCodes: false,
      melody: false,
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
