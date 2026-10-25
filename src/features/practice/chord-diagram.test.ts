import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart, type EventPattern } from '@/shared/lib/arrangement'
import { note, noteName, parseChordSymbol } from '@/shared/lib/music'
import { chordSummary, diagramChord, diagramKeys } from './chord-diagram'
import { ONE_BAR } from './testing/performances'

/** Each chord voiced on every beat in the right hand. */
const VOICED: EventPattern = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
}
/** An arpeggio up the chord's degrees: a right hand that voices no chord. */
const ARPEGGIO: EventPattern = {
  id: 'arpeggio',
  rh: { kind: 'events', events: parseFigure('0/4 1,4/4 3,8/4 5,12/4 8') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
}

/** A bar of each chord, in C; a bar of `_` none. */
const chart = (...symbols: string[]): Chart => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [
    {
      lines: [
        symbols.map((symbol) => ({
          chords: symbol === '_' ? [] : [{ ...parseChordSymbol(symbol), beats: 4 }],
          beats: 4,
        })),
      ],
    },
  ],
})
const played = (pattern: EventPattern, ...symbols: string[]) =>
  arrange(chart(...symbols), { tonic: note('C'), pattern })

describe('diagramKeys', () => {
  it('shows a chord as the right hand plays it', () => {
    // G after C, led to the nearest keys: B3 D4 G4.
    expect(diagramKeys(ONE_BAR, 1)).toEqual([59, 62, 67])
    // A 7th chord's root is the bass's: C♯m7 in the right hand is B3 E4 G♯4, its root C♯3 under them.
    expect(diagramKeys(played(VOICED, 'C#m7'), 0)).toEqual([49, 59, 64, 68])
  })

  it('draws a slash chord’s bass under the hand where the hand leaves it out', () => {
    // C E G in the hand, its bass B♭3 under them.
    expect(diagramKeys(played(VOICED, 'C/Bb'), 0)).toEqual([58, 60, 64, 67])
    // E is the hand's own: nothing drawn under it.
    expect(diagramKeys(played(VOICED, 'C/E'), 0)).toEqual([60, 64, 67])
  })

  it('shows a chord the right hand voices none of close from its root, from middle C up', () => {
    const arpeggio = played(ARPEGGIO, 'G', 'C#m7')
    expect(diagramKeys(arpeggio, 0)).toEqual([67, 71, 74])
    expect(diagramKeys(arpeggio, 1)).toEqual([61, 64, 68, 71])
  })

  it('shows no keys for a chord the music has not', () => {
    expect(diagramKeys(ONE_BAR, 2)).toEqual([])
  })
})

describe('diagramChord', () => {
  it('names its keys as the chord spells them, and knows every note of the chord', () => {
    const chord = diagramChord(played(VOICED, 'C#m7'), 0)
    expect(chord?.symbol).toBe('C#m7')
    // Its root under the hand, a ring: the bass the hand leaves to the left.
    expect(chord?.notes.map(noteName)).toEqual(['C#', 'B', 'E', 'G#'])
    expect(chord?.bass).toBe(true)
    expect(chord?.pitchClasses).toEqual([1, 4, 8, 11])
  })

  it('draws no bass under a hand that plays the chord’s root', () => {
    expect(diagramChord(ONE_BAR, 1)?.bass).toBe(false)
  })

  it('spells a slash chord’s bass as its symbol writes it', () => {
    expect(diagramChord(played(VOICED, 'C/Bb'), 0)?.notes.map(noteName)[0]).toBe('B♭')
  })

  it('counts a slash chord’s bass among its notes', () => {
    expect(diagramChord(played(VOICED, 'C/Bb'), 0)?.pitchClasses).toEqual([0, 4, 7, 10])
  })

  it('is none for a chord the music has not', () => {
    expect(diagramChord(ONE_BAR, 2)).toBeNull()
  })
})

describe('chordSummary', () => {
  it('lists the chords in the order they first sound, each once, as first voiced', () => {
    // The last Am is voiced E4 A4 C5, led from C; the summary keeps the first.
    const summary = chordSummary(played(VOICED, 'Am', 'Dm', 'G', 'C', 'Am'))
    expect(summary.map(({ symbol, keys }) => [symbol, keys])).toEqual([
      ['Am', [60, 64, 69]],
      ['Dm', [62, 65, 69]],
      ['G', [62, 67, 71]],
      ['C', [64, 67, 72]],
    ])
    expect(summary.map(({ chord }) => chord)).toEqual([0, 1, 2, 3])
  })

  it('lists none for music of no chord symbol', () => {
    expect(chordSummary(played(VOICED, '_', '_'))).toEqual([])
  })
})
