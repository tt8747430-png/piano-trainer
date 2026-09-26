import { describe, expect, it } from 'vitest'
import type { Chart } from '@/shared/lib/arrangement'
import { chordSymbol } from '@/shared/lib/music'
import { testProgression } from '../testing/test-pieces'
import { ContentError } from './content-error'
import { parseProgression } from './parse-progression'
import { CHORD_SIZES, type ChordSize, type KeyText } from './types'

const bars = (chart: Chart) =>
  chart.sections.flatMap((section) =>
    section.lines.flatMap((line) =>
      line.map((bar) =>
        bar.chords.map((chord) => `${chordSymbol(chord)} ${chord.beats}`).join(' | '),
      ),
    ),
  )
const symbols = (progression: string, size: ChordSize, key: KeyText = 'C') =>
  bars(parseProgression(testProgression(progression, { key }), size)).map((bar) =>
    bar.replace(/ \d+$/, ''),
  )

describe('parseProgression', () => {
  it.each([
    ['ii:min:4', ['Dm', 'Dm7', 'Dm9']],
    ['V:dom:4', ['G', 'G7', 'G9']],
    ['V:domb9:4', ['G', 'G7', 'G7♭9']],
    ['vii:hd:4', ['B°', 'Bm7♭5', 'Bm7♭5']],
    ['I:maj:4', ['C', 'CMaj7', 'CMaj9']],
    ['V:=b9:4', ['G7♭9', 'G7♭9', 'G7♭9']],
  ])('grows %s with the chord size', (progression, expected) => {
    expect(CHORD_SIZES.map((size) => symbols(progression, size)[0])).toEqual(expected)
  })

  it.each([
    ['♭VII:maj:4', 'C', 'B♭'],
    ['bIII:maj:4', 'C', 'E♭'],
    ['#IV:hd:4', 'C', 'F#m7♭5'],
    ['♭VII:maj:4', 'Dm', 'C'],
    ['♭III:maj:4', 'Dm', 'F'],
  ] as const)('spells the chromatic degree %s in %s as %s', (progression, key, expected) => {
    const size = progression.includes('hd') ? 'sevenths' : 'triads'
    expect(symbols(progression, size, key)[0]).toBe(expected)
  })

  it('reads degrees in any case', () => {
    expect(symbols('v:maj:4', 'triads')).toEqual(symbols('V:maj:4', 'triads'))
  })

  it('puts a chord tone in the bass', () => {
    expect(symbols('i:min:2/3', 'triads', 'Dm')[0]).toBe('Dm/F')
    expect(symbols('I:maj:4/5', 'triads')[0]).toBe('C/G')
    expect(symbols('I:maj:4/7', 'sevenths')[0]).toBe('CMaj7/B')
  })

  it('packs chords into bars of the meter, tying them across bar lines', () => {
    const chart = parseProgression(testProgression('I:maj:8 IV:maj:2 V:maj:2 I:maj:4'), 'triads')
    expect(bars(chart)).toEqual(['C 4', 'C 4', 'F 2 | G 2', 'C 4'])
    expect(chart.beatsPerBar).toBe(4)
  })

  it('ties a chord across a bar line in the middle of a bar', () => {
    const chart = parseProgression(testProgression('I:maj:3 IV:maj:3 V:maj:2'), 'triads')
    expect(bars(chart)).toEqual(['C 3 | F 1', 'F 2 | G 2'])
  })

  it('writes four bars to a line', () => {
    const chart = parseProgression(
      testProgression('I:dom:16 IV:dom:8 I:dom:8 V:dom:4 IV:dom:4 I:dom:4 V:dom:4'),
      'sevenths',
    )
    expect(chart.sections[0]?.lines.map((line) => line.length)).toEqual([4, 4, 4])
  })

  it.each([
    ['VIII:maj:4', 'chord 2'],
    ['I:foo:4', 'chord 2'],
    ['I:=xx:4', 'chord 2'],
    ['I:maj:0', 'chord 2'],
    ['I:maj', 'chord 2'],
    ['I:maj:4/7', 'chord 2'],
  ])('names the chord it cannot read: %s', (token, where) => {
    let caught: unknown
    try {
      parseProgression(testProgression(`I:maj:4 ${token}`), 'triads')
    } catch (error) {
      caught = error
    }
    expect(caught).toBeInstanceOf(ContentError)
    expect((caught as ContentError).message).toContain(where)
    expect((caught as ContentError).message).toContain(token)
  })
})
