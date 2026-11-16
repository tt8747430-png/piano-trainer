import { describe, expect, it } from 'vitest'
import {
  chordSymbol,
  kindOfParts,
  qualityIntervals,
  qualitySuffix,
  writtenSymbol,
  type ChordKind,
} from './chord'
import { buildChord, builtRootSpelling, CHORD_PARTS } from './chord-parts'
import { parseChordSymbol, readChordSymbol } from './chord-symbol'
import { note } from './note'
import { pitchClass } from './pitch'

/** A chord's tones as pitch classes over its root, lowest first: `0 4 7 10`. */
const pitchClasses = (semitones: readonly number[]): string =>
  [...new Set(semitones.map((each) => pitchClass(each)))].sort((a, b) => a - b).join(' ')
const tonesOf = (kind: ChordKind): string =>
  pitchClasses(qualityIntervals(kind).map((interval) => interval.semitones))

/** The suffixes the table reads as their octave's chord: an added 2nd is its add9, an added 4th its add11. */
const OCTAVE_TWINS: Readonly<Record<string, string>> = {
  add2: 'add9',
  add4: 'add11',
  'm(add2)': 'm(add9)',
}

describe("reading a chord by the builder's grammar", () => {
  it.each(CHORD_PARTS.map((parts) => [buildChord(note('C'), parts).suffix, parts] as const))(
    'reads C%s back as the chord the builder makes, on all 12 roots',
    (suffix, parts) => {
      for (let pc = 0; pc < 12; pc++) {
        const built = buildChord(builtRootSpelling(pitchClass(pc), parts), parts)
        const read = parseChordSymbol(writtenSymbol(built))
        expect(read.root).toEqual(built.root)
        expect(qualitySuffix(read.quality)).toBe(OCTAVE_TWINS[suffix] ?? suffix)
        expect(tonesOf(read.quality)).toBe(tonesOf(kindOfParts(parts)))
      }
    },
  )

  it('writes two or more alterations in brackets by degree, and reads them either way', () => {
    for (const symbol of ['C7♭5♭9', 'C7(♭5,♭9)', 'C7(b9,b5)', 'C7(-5/-9)']) {
      expect(chordSymbol(parseChordSymbol(symbol))).toBe('C7(♭5,♭9)')
    }
    expect(chordSymbol(parseChordSymbol('C7#9#5'))).toBe('C7(#5,#9)')
    expect(chordSymbol(parseChordSymbol('C13♭9#11'))).toBe('C13(♭9,#11)')
    expect(chordSymbol(parseChordSymbol('C7♭9'))).toBe('C7♭9')
    expect(chordSymbol(parseChordSymbol('C13#11'))).toBe('C13#11')
  })

  it('writes a 6/9 over a bass with its 9 in brackets, and reads it back', () => {
    const chord = parseChordSymbol('C6/9/E')
    expect(chordSymbol(chord)).toBe('C6(9)/E')
    expect(parseChordSymbol('C6(9)/E')).toEqual(chord)
    expect(chordSymbol(parseChordSymbol('Am6/9/C'))).toBe('Am6(9)/C')
    expect(chordSymbol(parseChordSymbol('C6/9'))).toBe('C6/9')
  })

  it.each([
    ['C9(13)', 'C13'],
    ['C7(13)', 'C7(add13)'],
    ['Cm9(11)', 'Cm11'],
    ['C7(9)', 'C9'],
    ['C6add9', 'C6/9'],
    ['C+7', 'C7#5'],
    ['C7+', 'C7#5'],
    ['CM7+5', 'C+maj7'],
    ['Cø9', 'Cm9♭5'],
    ['Cma7', 'Cmaj7'],
    ['Cj7', 'Cmaj7'],
    ['CΔ9', 'Cmaj9'],
    ['C7#4', 'C7#11'],
    ['C7b6', 'C7♭13'],
    ['Cs4', 'Csus4'],
    ['C7sus4b9', 'C7sus4♭9'],
    ['Cm7b5(add11)', 'Cm7♭5(add11)'],
  ])('reads %s as %s', (symbol, written) => {
    expect(chordSymbol(parseChordSymbol(symbol))).toBe(written)
  })

  it.each([
    'Cmm',
    'Cmaj7maj',
    'C7sus2sus4',
    'C(',
    'C7(b9',
    'C7b7',
    'Cadd',
    'Cm#5',
    'Csus2m',
    'C7/',
  ])('reads no chord in %s', (symbol) => {
    expect(readChordSymbol(symbol)).toBeNull()
  })
})

describe('the spellings of other apps', () => {
  // Suggester 2's reader's aliases (THEORY_ENGINE.md §10).
  it.each([
    ['Cmin', 'Cm'],
    ['Cm7b5', 'Cm7♭5'],
    ['Chdim7', 'Cm7♭5'],
    ['Chdim', 'Cm7♭5'],
    ['Cmin7b5', 'Cm7♭5'],
    ['CMaj', 'C'],
    ['CmMaj', 'Cm(maj7)'],
    ['CmM', 'Cm(maj7)'],
    ['CminMaj', 'Cm(maj7)'],
    ['CminM', 'Cm(maj7)'],
    ['Caug', 'C+'],
    ['Cdim', 'C°'],
    ['C7b5', 'C7♭5'],
  ])("reads Suggester 2's %s as %s", (symbol, written) => {
    expect(chordSymbol(parseChordSymbol(symbol))).toBe(written)
  })

  /** Chordio's spellings and the tones it gives each (`chord_dictionary_tables.json`, `quality_to_components`). */
  const CHORDIO: readonly (readonly [string, readonly number[]])[] = [
    ['2', [0, 4, 7, 14]],
    ['3', [0, 4]],
    ['4', [0, 4, 7, 17]],
    ['5', [0, 7]],
    ['6', [0, 4, 7, 9]],
    ['7', [0, 4, 7, 10]],
    ['9', [0, 4, 7, 10, 14]],
    ['11', [0, 7, 10, 14, 17]],
    ['13', [0, 4, 7, 10, 14, 21]],
    ['-5', [0, 7]],
    ['sus', [0, 7]],
    ['', [0, 4, 7]],
    ['maj', [0, 4, 7]],
    ['M', [0, 4, 7]],
    ['m', [0, 3, 7]],
    ['min', [0, 3, 7]],
    ['mi', [0, 3, 7]],
    ['dim', [0, 3, 6]],
    ['b5', [0, 3, 6]],
    ['o', [0, 3, 6]],
    ['aug', [0, 4, 8]],
    ['(aug)', [0, 4, 8]],
    ['+5', [0, 4, 8]],
    ['+', [0, 4, 8]],
    ['sus2', [0, 2, 7]],
    ['(sus2)', [0, 2, 7]],
    ['sus4', [0, 5, 7]],
    ['(sus4)', [0, 5, 7]],
    ['s4', [0, 5, 7]],
    ['add6', [0, 4, 7, 9]],
    ['(7)', [0, 4, 7, 10]],
    ['(M7)', [0, 4, 7, 10]],
    ['7-5', [0, 4, 6, 10]],
    ['7_5', [0, 4, 6, 10]],
    ['7b5', [0, 4, 6, 10]],
    ['maj7b5', [0, 4, 6, 11]],
    ['7+5', [0, 4, 8, 10]],
    ['7+', [0, 4, 8, 10]],
    ['7#5', [0, 4, 8, 10]],
    ['7(#5)', [0, 4, 8, 10]],
    ['6sus2', [0, 2, 7, 9]],
    ['7sus2', [0, 2, 7, 10]],
    ['maj7sus2', [0, 2, 7, 10]],
    ['7sus4', [0, 5, 7, 10]],
    ['7(sus)', [0, 5, 7, 10]],
    ['sus7', [0, 5, 7, 10]],
    ['7sus', [0, 5, 7, 10]],
    ['m6', [0, 3, 7, 9]],
    ['m7', [0, 3, 7, 10]],
    ['m(7)', [0, 3, 7, 10]],
    ['7m', [0, 3, 7, 10]],
    ['AmMaj7', [0, 3, 7, 11]],
    ['min7', [0, 3, 7, 10]],
    ['dim7', [0, 3, 7, 10]],
    ['o7', [0, 3, 7, 10]],
    ['m7b5', [0, 3, 6, 10]],
    ['m7-5', [0, 3, 6, 10]],
    ['dim6', [0, 3, 6, 9]],
    ['M7', [0, 4, 7, 11]],
    ['7M', [0, 4, 7, 11]],
    ['Maj7', [0, 4, 7, 11]],
    ['maj7', [0, 4, 7, 11]],
    ['ma7', [0, 4, 7, 11]],
    ['M7+5', [0, 4, 8, 11]],
    ['mM7', [0, 3, 7, 11]],
    ['mmaj7', [0, 3, 7, 11]],
    ['m(maj7)', [0, 3, 7, 11]],
    ['add9', [0, 4, 7, 14]],
    ['(add9)', [0, 4, 7, 14]],
    ['madd9', [0, 3, 7, 14]],
    ['add2', [0, 2, 4, 7]],
    ['add4', [0, 4, 5, 7]],
    ['add11', [0, 4, 7, 17]],
    ['(add2)', [0, 2, 4, 7]],
    ['(add4)', [0, 4, 5, 7]],
    ['(add11)', [0, 4, 7, 17]],
    ['sus4(add13)', [0, 5, 7, 20]],
    ['6/9', [0, 4, 7, 9, 14]],
    ['6_9', [0, 4, 7, 9, 14]],
    ['6add11', [0, 4, 7, 9, 17]],
    ['6add9', [0, 4, 7, 9, 14]],
    ['m6add11', [0, 3, 7, 9, 17]],
    ['add4add9', [0, 3, 5, 7, 14]],
    ['(9)', [0, 4, 7, 10, 14]],
    ['m9', [0, 3, 7, 10, 14]],
    ['M9', [0, 4, 7, 11, 14]],
    ['maj9', [0, 4, 7, 11, 14]],
    ['9sus4', [0, 5, 7, 10, 14]],
    ['9sus', [0, 5, 7, 10, 14]],
    ['7_6', [0, 4, 7, 9, 10]],
    ['7-9', [0, 4, 7, 10, 13]],
    ['7_9', [0, 4, 7, 10, 13]],
    ['7b9', [0, 4, 7, 10, 13]],
    ['7(b9)', [0, 4, 7, 10, 13]],
    ['7+9', [0, 4, 7, 10, 15]],
    ['7(#9)', [0, 4, 7, 10, 15]],
    ['7#9', [0, 4, 7, 10, 15]],
    ['9-5', [0, 4, 6, 10, 14]],
    ['9b5', [0, 4, 6, 10, 14]],
    ['9+5', [0, 4, 8, 10, 14]],
    ['9#5', [0, 4, 8, 10, 14]],
    ['7#9b5', [0, 4, 6, 10, 15]],
    ['7#9#5', [0, 4, 8, 10, 15]],
    ['7b9b5', [0, 4, 6, 10, 13]],
    ['7b9#5', [0, 4, 8, 10, 13]],
    ['7+11', [0, 4, 7, 10, 18]],
    ['maj7#11', [0, 4, 7, 10, 18]],
    ['7#11', [0, 4, 7, 10, 18]],
    ['m7add11', [0, 3, 7, 10, 18]],
    ['maj11', [0, 4, 7, 11, 17]],
    ['m11', [0, 3, 7, 11, 17]],
    ['7b9#9', [0, 4, 7, 10, 13, 15]],
    ['7b9#11', [0, 4, 7, 10, 13, 18]],
    ['7#9#11', [0, 4, 7, 10, 15, 18]],
    ['7-13', [0, 4, 7, 10, 20]],
    ['7add13', [0, 4, 7, 10, 20]],
    ['7b13', [0, 4, 7, 10, 20]],
    ['m7add4', [0, 4, 5, 7, 10]],
    ['maj7add6', [0, 4, 7, 9, 10]],
    ['9+11', [0, 4, 7, 10, 14, 18]],
    ['m9+11', [0, 3, 7, 10, 14, 18]],
    ['9#11', [0, 4, 7, 10, 14, 18]],
    ['maj13', [0, 4, 7, 11, 14, 21]],
    ['add13', [0, 4, 7, 11, 14, 21]],
    ['madd13', [0, 3, 7, 10, 14, 21]],
    ['13sus4', [0, 5, 7, 10, 14, 21]],
    ['m13', [0, 3, 7, 10, 14, 21]],
    ['13-9', [0, 4, 7, 10, 13, 21]],
    ['13b9', [0, 4, 7, 10, 13, 21]],
    ['13+9', [0, 4, 7, 10, 15, 21]],
    ['13#9', [0, 4, 7, 10, 15, 21]],
    ['13+11', [0, 4, 7, 10, 18, 21]],
    ['m13+11', [0, 3, 7, 10, 18, 21]],
    ['13#11', [0, 4, 7, 10, 18, 21]],
    ['madd11', [0, 3, 7, 10, 14, 17]],
  ]

  /**
   * Where Chordio's own table is wrong or reads what no chart writes, what is read instead: the chord
   * the spelling writes, or none.
   */
  const READ_OTHERWISE: ReadonlyMap<string, string | null> = new Map([
    // Chordio's tones are not the chord its spelling names.
    ['11', 'C11'],
    ['sus', 'Csus4'],
    ['(M7)', 'Cmaj7'],
    ['maj7sus2', 'Cmaj7sus2'],
    ['dim7', 'C°7'],
    ['o7', 'C°7'],
    ['add4add9', 'C(add4,add9)'],
    ['maj7#11', 'Cmaj7#11'],
    ['m7add11', 'Cm7(add11)'],
    ['m11', 'Cm11'],
    ['7add13', 'C7(add13)'],
    ['madd11', 'Cm(add11)'],
    // Chordio leaves a tone of the stack out: the 9th of a maj11 and a 13#11, the 11th of an m13.
    ['maj11', 'Cmaj11'],
    ['13+11', 'C13#11'],
    ['13#11', 'C13#11'],
    ['m13', 'Cm13'],
    // A flat after the root is the root's: C♭5.
    ['b5', 'C♭5'],
    // An interval, Chordio's underscores, a root letter in the suffix, or a chord no chart writes.
    ['3', null],
    ['-5', null],
    ['7_5', null],
    ['6_9', null],
    ['7_6', null],
    ['7_9', null],
    ['AmMaj7', null],
    ['dim6', null],
    ['sus4(add13)', null],
    ['m7add4', null],
    ['maj7add6', null],
    ['add13', null],
    ['madd13', null],
    ['m13+11', null],
    ['maj7b5', null],
    ['m9+11', null],
  ])

  it.each(CHORDIO)("reads Chordio's C%s as its tones", (spelling, tones) => {
    const read = readChordSymbol(`C${spelling}`)
    const otherwise = READ_OTHERWISE.get(spelling)
    if (otherwise === undefined) {
      expect(read && tonesOf(read.quality)).toBe(pitchClasses(tones))
    } else {
      expect(read && chordSymbol(read)).toBe(otherwise)
    }
  })
})
