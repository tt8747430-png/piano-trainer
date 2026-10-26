import { describe, expect, it } from 'vitest'
import {
  arrange,
  parseFigure,
  type Chart,
  type EventPattern,
  type Performance,
} from '@/shared/lib/arrangement'
import { note, noteName, parseChordSymbol } from '@/shared/lib/music'
import { chordSummary, diagramChord } from './chord-diagram'

/** Each chord voiced on every beat in the right hand: the voicing a diagram no longer follows. */
const VOICED: EventPattern = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
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
const played = (...symbols: string[]): Performance =>
  arrange(chart(...symbols), { tonic: note('C'), pattern: VOICED })

/** The keys a chord's diagram marks, lowest first. */
const keysOf = (symbol: string) => diagramChord(played(symbol), 0)?.keys

describe('a chord’s diagram, as it folds', () => {
  it('folds each note into F3–E4, as Chordify draws its chords', () => {
    // E: G♯3 B3 E4. C♯m: G♯3 C♯4 E4. C♯m7: G♯3 B3 C♯4 E4. G♯sus4: G♯3 C♯4 D♯4.
    expect(keysOf('E')).toEqual([56, 59, 64])
    expect(keysOf('C#m')).toEqual([56, 61, 64])
    expect(keysOf('C#m7')).toEqual([56, 59, 61, 64])
    expect(keysOf('G#sus4')).toEqual([56, 61, 63])
  })

  it('puts a slash chord’s bass lowest where it is one of its tones: the inversion it names', () => {
    // G/B: B3 D4 G4, where G folds to G3. D/F♯: F♯3 A3 D4, as D folds.
    expect(keysOf('G/B')).toEqual([59, 62, 67])
    expect(keysOf('D/F#')).toEqual([54, 57, 62])
    expect(diagramChord(played('G/B'), 0)?.ring).toBeNull()
  })

  it('rings a slash chord’s bass it has not, at its key in F3–E4, the chord close over it', () => {
    // C/B♭: B♭3, then C4 E4 G4 from the first tone over it.
    const chord = diagramChord(played('C/Bb'), 0)
    expect(chord?.keys).toEqual([58, 60, 64, 67])
    expect(chord?.ring).toBe(58)
  })

  it('folds a slash chord that would run past B4 over its bass, its bass a ring where it falls', () => {
    // C/E over E4 would reach C5: G3 C4 E4, E4 ringed as the bass. F♯m/D♯ over D♯4 would reach
    // C♯5: F♯3 A3 C♯4 under its bass D♯4.
    const overE = diagramChord(played('C/E'), 0)
    expect(overE?.keys).toEqual([55, 60, 64])
    expect(overE?.ring).toBe(64)
    const overDSharp = diagramChord(played('F#m/D#'), 0)
    expect(overDSharp?.keys).toEqual([54, 57, 61, 63])
    expect(overDSharp?.ring).toBe(63)
  })

  it('folds a chord of five notes or more the same way, its root not put lowest, no ring', () => {
    // C9: G3 B♭3 C4 D4 E4.
    const ninth = diagramChord(played('C9'), 0)
    expect(ninth?.keys).toEqual([55, 58, 60, 62, 64])
    expect(ninth?.ring).toBeNull()
  })
})

describe('a chord’s diagram, in an inversion', () => {
  const inversionsOf = (symbol: string) => diagramChord(played(symbol), 0)?.inversions

  it('offers the close inversions of a chord of three or four notes that fit F3–B4', () => {
    // A: A3 C♯4 E4 and C♯4 E4 A4 fit; E4 A4 C♯5 runs past B4. Folded, its root is lowest.
    expect(inversionsOf('A')).toEqual({
      kind: 'free',
      notes: 3,
      drawn: 0,
      folded: 0,
      fitting: [0, 1],
    })
    // E7 folds G♯3 B3 D4 E4, its 1st inversion; from its root E4 it runs past B4.
    expect(inversionsOf('E7')).toEqual({
      kind: 'free',
      notes: 4,
      drawn: 1,
      folded: 1,
      fitting: [1, 2, 3],
    })
  })

  it('draws the inversion chosen for its symbol, its lowest note at its key in F3–E4', () => {
    // D minor set to A–D–F, as the owner set it in Chordify.
    const minor = diagramChord(played('Dm'), 0, { Dm: 2 })
    expect(minor?.keys).toEqual([57, 62, 65])
    expect(minor?.inversions).toMatchObject({ drawn: 2, folded: 1 })
  })

  it('keeps to the fold where the inversion chosen does not fit, or the chord has not', () => {
    expect(diagramChord(played('A'), 0, { A: 2 })?.keys).toEqual([57, 61, 64])
    expect(diagramChord(played('A'), 0, { A: 3 })?.keys).toEqual([57, 61, 64])
  })

  it('offers none for a slash chord or a chord of five notes or more, drawn one way', () => {
    expect(inversionsOf('C/E')).toEqual({ kind: 'slash', notes: 3 })
    expect(inversionsOf('C/Bb')).toEqual({ kind: 'slash', notes: 3 })
    expect(inversionsOf('C9')).toEqual({ kind: 'large', notes: 5 })
    expect(diagramChord(played('C/Bb'), 0, { 'C/Bb': 1 })?.keys).toEqual([58, 60, 64, 67])
  })
})

describe('diagramChord', () => {
  it('names its keys as the chord spells them, and knows every note of the chord', () => {
    const chord = diagramChord(played('C#m7'), 0)
    expect(chord?.symbol).toBe('C#m7')
    expect(chord?.notes.map(noteName)).toEqual(['G#', 'B', 'C#', 'E'])
    expect(chord?.pitchClasses).toEqual([1, 4, 8, 11])
  })

  it('spells a slash chord’s bass as its symbol writes it, and counts it among its notes', () => {
    const chord = diagramChord(played('C/Bb'), 0)
    expect(chord?.notes.map(noteName)).toEqual(['B♭', 'C', 'E', 'G'])
    expect(chord?.pitchClasses).toEqual([0, 4, 7, 10])
  })

  it('is none for a chord the music has not', () => {
    expect(diagramChord(played('C', 'G'), 2)).toBeNull()
  })
})

describe('chordSummary', () => {
  it('lists the chords in the order they first sound, each once, as chosen', () => {
    const summary = chordSummary(played('Am', 'Dm', 'G', 'C', 'Am'), { Dm: 2 })
    expect(summary.map(({ symbol, keys }) => [symbol, keys])).toEqual([
      ['Am', [57, 60, 64]],
      ['Dm', [57, 62, 65]],
      ['G', [55, 59, 62]],
      ['C', [55, 60, 64]],
    ])
    expect(summary.map(({ chord }) => chord)).toEqual([0, 1, 2, 3])
  })

  it('lists none for music of no chord symbol', () => {
    expect(chordSummary(played('_', '_'))).toEqual([])
  })
})
