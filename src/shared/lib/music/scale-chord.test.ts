import { describe, expect, it } from 'vitest'
import { qualitySuffix } from './chord'
import { noteName, note } from './note'
import { pitchClass } from './pitch'
import { SCALE_KINDS, scaleHasChords, scaleRootSpelling, spellScale } from './scale'
import {
  borrowedChords,
  CHORD_NOTES,
  romanFigure,
  scaleChordAt,
  scaleChordHolds,
  scaleChords,
  scaleChordSymbol,
} from './scale-chord'
import { chordSymbol } from './chord'

const symbols = (
  root = note('C'),
  kind: Parameters<typeof scaleChords>[1] = 'major',
  notes: 3 | 4 | 5 | 6 | 7 = 3,
) =>
  scaleChords(root, kind, notes)
    .map((chord) => scaleChordSymbol(chord))
    .join(' ')

describe('scaleChords', () => {
  it.each([
    [3, 'C Dm Em F G Am B°'],
    [4, 'CMaj7 Dm7 Em7 FMaj7 G7 Am7 Bm7♭5'],
    [5, 'CMaj9 Dm9 Em7♭9 FMaj9 G9 Am9 Bm7♭5♭9'],
    [6, 'CMaj11 Dm11 Em11♭9 FMaj9#11 G11 Am11 Bm11♭5♭9'],
    [7, 'CMaj13 Dm13 Em11♭9♭13 FMaj13#11 G13 Am11♭13 Bm11♭5♭9♭13'],
  ] as const)('stacks C major’s chords of %i notes: %s', (notes, expected) => {
    expect(symbols(note('C'), 'major', notes)).toBe(expected)
  })

  it('stacks A harmonic and melodic minor’s 9ths', () => {
    expect(symbols(note('A'), 'harmonic', 5)).toBe(
      'Am(maj9) Bm7♭5♭9 C+Maj9 Dm9 E7♭9 FMaj7#9 G#°7♭9',
    )
    expect(symbols(note('A'), 'melodic', 5)).toBe('Am(maj9) Bm7♭9 C+Maj9 D9 E9 F#m9♭5 G#m7♭5♭9')
  })

  it('numbers the degrees, marking diminished, half-diminished and augmented', () => {
    expect(scaleChords(note('C'), 'major', 3).map((chord) => chord.roman)).toEqual([
      'I',
      'ii',
      'iii',
      'IV',
      'V',
      'vi',
      'vii°',
    ])
    expect(scaleChords(note('A'), 'harmonic', 4).map((chord) => chord.roman)).toEqual([
      'i',
      'iiø',
      'III+',
      'iv',
      'V',
      'VI',
      'vii°',
    ])
    expect(scaleChords(note('A'), 'harmonic', 7)[1]?.roman).toBe('iiø')
  })

  it('spells every stacked note as the scale does, labelled from the chord’s root', () => {
    const scale = spellScale(note('E', -1), 'harmonic').map((tone) => noteName(tone.note))
    const vii = scaleChords(note('E', -1), 'harmonic', 7)[6]
    expect(vii?.tones.map((tone) => noteName(tone.note))).toEqual([
      'D',
      'F',
      'A♭',
      'C♭',
      'E♭',
      'G♭',
      'B♭',
    ])
    for (const tone of vii?.tones ?? []) expect(scale).toContain(noteName(tone.note))
    expect(vii?.tones.map((tone) => tone.degree)).toEqual([
      '1',
      '♭3',
      '♭5',
      '𝄫7',
      '♭9',
      '♭11',
      '♭13',
    ])
  })

  it('names a stack that is a table quality by that quality’s own suffix, on every root of every kind', () => {
    for (const kind of SCALE_KINDS.filter(scaleHasChords)) {
      for (let pc = 0; pc < 12; pc++) {
        const root = scaleRootSpelling(pitchClass(pc), kind)
        for (const notes of CHORD_NOTES) {
          for (const chord of scaleChords(root, kind, notes)) {
            if (notes <= 4) expect(chord.quality).toBeDefined()
            if (chord.quality) expect(chord.suffix).toBe(qualitySuffix(chord.quality))
          }
        }
      }
    }
  })

  it('has none for a scale without seven notes', () => {
    expect(scaleChords(note('C'), 'blues', 3)).toEqual([])
  })
})

describe('romanFigure', () => {
  it('writes a triad’s and a 7th’s inversions in figured bass, and nothing from a 9th up', () => {
    expect([0, 1, 2].map((inversion) => romanFigure(3, inversion))).toEqual(['', '⁶', '⁶₄'])
    expect([0, 1, 2, 3].map((inversion) => romanFigure(4, inversion))).toEqual([
      '⁷',
      '⁶₅',
      '⁴₃',
      '⁴₂',
    ])
    expect(romanFigure(5, 1)).toBe('')
  })
})

describe('scaleChordSymbol', () => {
  it('writes an inversion over its bass', () => {
    const [tonic] = scaleChords(note('C'), 'major', 3)
    if (!tonic) throw new Error('C major has a tonic chord')
    expect(scaleChordSymbol(tonic, note('E'))).toBe('C/E')
  })
})

describe('scaleChordHolds', () => {
  it('holds a note when one of its tones is it, in any octave; a 13th holds the whole scale', () => {
    const [tonic] = scaleChords(note('C'), 'major', 3)
    if (!tonic) throw new Error('C major has a tonic chord')
    expect(scaleChordHolds(tonic, pitchClass(4))).toBe(true)
    expect(scaleChordHolds(tonic, pitchClass(2))).toBe(false)
    const thirteenth = scaleChords(note('C'), 'major', 7)[3]
    if (!thirteenth) throw new Error('C major has an F 13th')
    for (const tone of spellScale(note('C'), 'major')) {
      expect(scaleChordHolds(thirteenth, tone.pitchClass)).toBe(true)
    }
  })
})

describe('scaleChordAt', () => {
  const chart = (kind: Parameters<typeof scaleChordAt>[1], root = note('C')) =>
    [0, 1, 2, 3, 4, 5, 6]
      .map((degree) => chordSymbol(scaleChordAt(root, kind, degree, 5)))
      .join(' ')

  it('adds a 9th only where it is an available tension', () => {
    expect(chart('major')).toBe('CMaj9 Dm9 Em7 FMaj9 G9 Am9 Bm7♭5')
    expect(chart('harmonic', note('A'))).toBe('Am(maj9) Bm7♭5 C+Maj9 Dm9 E7♭9 FMaj7 G#°7')
    expect(chart('melodic', note('C'))).toBe('Cm(maj9) Dm7 E♭+Maj9 F9 G9 Am9♭5 Bm7♭5')
  })

  it('plays a triad or a 7th chord as the scale stacks it', () => {
    expect(scaleChordAt(note('D'), 'dorian', 3, 3)).toEqual({ root: note('G'), quality: 'maj' })
    expect(scaleChordAt(note('D'), 'dorian', 3, 4)).toEqual({ root: note('G'), quality: 'd7' })
  })
})

describe('borrowedChords', () => {
  const written = (chords: readonly { roman: string }[]) => chords.map((chord) => chord.roman)
  it('borrows ♭III, iv, ♭VI and ♭VII into a major key from its parallel minor', () => {
    const chords = borrowedChords({ tonic: note('C'), minor: false }, 3)
    expect(written(chords)).toEqual(['♭III', 'iv', '♭VI', '♭VII'])
    expect(chords.map((chord) => scaleChordSymbol(chord))).toEqual(['E♭', 'Fm', 'A♭', 'B♭'])
    expect(
      borrowedChords({ tonic: note('C'), minor: false }, 4).map((c) => scaleChordSymbol(c)),
    ).toEqual(['E♭Maj7', 'Fm7', 'A♭Maj7', 'B♭7'])
  })

  it('borrows the Picardy I, the Neapolitan ♭II, Dorian’s IV and harmonic minor’s V into a minor key', () => {
    const chords = borrowedChords({ tonic: note('A'), minor: true }, 3)
    expect(written(chords)).toEqual(['I', '♭II', 'IV', 'V'])
    expect(chords.map((chord) => chord.from)).toEqual(['major', 'phrygian', 'melodic', 'harmonic'])
    expect(chords.map((chord) => scaleChordSymbol(chord))).toEqual(['A', 'B♭', 'D', 'E'])
  })
})
