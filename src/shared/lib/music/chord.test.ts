import { describe, expect, it } from 'vitest'
import {
  CHORD_FAMILIES,
  CHORD_QUALITIES,
  chordBass,
  chordFamily,
  chordRootSpelling,
  chordSymbol,
  qualitiesIn,
  qualityIntervals,
  qualityRootSpelling,
  qualitySpellings,
  qualitySuffix,
  spellChord,
  writtenSymbol,
  type ChordQuality,
} from './chord'
import { parseChordSymbol } from './chord-symbol'
import { letterIndex, note, noteName, pitchClassOf, type SpelledNote } from './note'
import { pitchClass } from './pitch'

const names = (root: SpelledNote, quality: ChordQuality) =>
  spellChord(root, quality).map((tone) => noteName(tone.note))

describe('chord qualities', () => {
  it('are 46, in five families', () => {
    expect(CHORD_QUALITIES).toHaveLength(46)
    expect(CHORD_FAMILIES.map((family) => qualitiesIn(family).length)).toEqual([7, 7, 9, 14, 9])
    expect(qualitiesIn('sev').every((quality) => chordFamily(quality) === 'sev')).toBe(true)
  })

  it('never let one spelling name two qualities', () => {
    const spellings = CHORD_QUALITIES.flatMap((quality) => qualitySpellings(quality))
    expect(new Set(spellings).size).toBe(spellings.length)
  })

  it('list the suffix first among the spellings', () => {
    expect(qualitySuffix('hd')).toBe('m7♭5')
    expect(qualitySuffix('o7')).toBe('°7')
    expect(qualitySuffix('maj')).toBe('')
    expect(qualitySuffix('alt')).toBe('7alt')
    expect(qualitySpellings('hd')[0]).toBe('m7♭5')
  })
})

describe('the chord types a chord finder lists', () => {
  it('spells the power chord, its root and 5th alone', () => {
    expect(names(note('C'), 'five')).toEqual(['C', 'G'])
    expect(names(note('B', -1), 'five')).toEqual(['B♭', 'F'])
    expect(parseChordSymbol('E5')).toEqual({ root: note('E'), quality: 'five' })
    expect(chordSymbol({ root: note('A'), quality: 'five' })).toBe('A5')
  })

  it('spells the major 11th, the minor 13th and the major 13th', () => {
    expect(names(note('C'), 'maj11')).toEqual(['C', 'E', 'G', 'B', 'D', 'F'])
    expect(names(note('C'), 'm13')).toEqual(['C', 'E♭', 'G', 'B♭', 'D', 'F', 'A'])
    // Over a major 3rd the 13th leaves its 11th out, as the dominant 13th does.
    expect(names(note('C'), 'maj13')).toEqual(['C', 'E', 'G', 'B', 'D', 'A'])
    expect(names(note('E', -1), 'maj13')).toEqual(['E♭', 'G', 'B♭', 'D', 'F', 'C'])
  })

  it('spells the 13sus4, its 4th in place of the 3rd and no 11th above it', () => {
    expect(names(note('G'), 'sus13')).toEqual(['G', 'C', 'D', 'F', 'A', 'E'])
  })

  it('reads each in the ways a chart writes it', () => {
    expect(parseChordSymbol('CMaj11')).toEqual({ root: note('C'), quality: 'maj11' })
    expect(parseChordSymbol('Cmaj13')).toEqual({ root: note('C'), quality: 'maj13' })
    expect(parseChordSymbol('CΔ13')).toEqual({ root: note('C'), quality: 'maj13' })
    expect(parseChordSymbol('Dm13')).toEqual({ root: note('D'), quality: 'm13' })
    expect(parseChordSymbol('G13sus')).toEqual({ root: note('G'), quality: 'sus13' })
    expect(parseChordSymbol('G13sus4')).toEqual({ root: note('G'), quality: 'sus13' })
  })
})

describe('the 9ths of melodic minor', () => {
  it('know the 9ths of melodic minor’s tonic, its III and its vi', () => {
    expect(names(note('C'), 'mM9')).toEqual(['C', 'E♭', 'G', 'B', 'D'])
    expect(names(note('C'), 'M9s5')).toEqual(['C', 'E', 'G#', 'B', 'D'])
    expect(names(note('C'), 'hd9')).toEqual(['C', 'E♭', 'G♭', 'B♭', 'D'])
    expect(parseChordSymbol('Cø9')).toEqual({ root: note('C'), quality: 'hd9' })
  })
})

describe('spellChord', () => {
  it('spells a major triad with its degrees and roles', () => {
    const tones = spellChord(note('C'), 'maj')
    expect(tones.map((tone) => noteName(tone.note))).toEqual(['C', 'E', 'G'])
    expect(tones.map((tone) => tone.degree)).toEqual(['1', '3', '5'])
    expect(tones.map((tone) => tone.role)).toEqual(['root', '3rd', '5th'])
    expect(tones.map((tone) => tone.semitones)).toEqual([0, 4, 7])
  })

  it('spells half-diminished and diminished sevenths on their own letters', () => {
    expect(names(note('C'), 'hd')).toEqual(['C', 'E♭', 'G♭', 'B♭'])
    expect(names(note('C'), 'o7')).toEqual(['C', 'E♭', 'G♭', 'B𝄫'])
    expect(spellChord(note('C'), 'o7')[3]?.degree).toBe('𝄫7')
  })

  it('gives extensions their roles', () => {
    const tones = spellChord(note('C'), 'n13')
    expect(tones.map((tone) => noteName(tone.note))).toEqual(['C', 'E', 'G', 'B♭', 'D', 'A'])
    expect(tones.map((tone) => tone.role)).toEqual(['root', '3rd', '5th', '7th', '9th', '13th'])
  })

  it('spells the altered dominant', () => {
    expect(names(note('C'), 'alt')).toEqual(['C', 'E', 'G♭', 'G#', 'B♭', 'D♭', 'D#'])
  })

  it('spells the minor triad with an added 9th and the 13th with a flat 9th, as Gorshkov prints them', () => {
    expect(names(note('G'), 'madd9')).toEqual(['G', 'B♭', 'D', 'A'])
    expect(names(note('A'), 'b9n13')).toEqual(['A', 'C#', 'E', 'G', 'B♭', 'F#'])
  })

  it('calls a suspended 2nd a 9th', () => {
    const tones = spellChord(note('C'), 'sus2')
    expect(tones.map((tone) => noteName(tone.note))).toEqual(['C', 'D', 'G'])
    expect(tones[1]?.role).toBe('9th')
  })

  it('reaches a double sharp where the letters need one', () => {
    expect(names(note('F', 1), 's9')).toEqual(['F#', 'A#', 'C#', 'E', 'G𝄪'])
  })

  it.each(CHORD_QUALITIES)('spells %s on all 12 roots by letter steps and semitones', (quality) => {
    for (let pc = 0; pc < 12; pc++) {
      const root = chordRootSpelling(pitchClass(pc), qualityIntervals(quality))
      const tones = spellChord(root, quality)
      qualityIntervals(quality).forEach((interval, i) => {
        const tone = tones[i]
        expect(tone?.pitchClass).toBe(pitchClass(pc + interval.semitones))
        expect(tone && pitchClassOf(tone.note)).toBe(tone?.pitchClass)
        expect(tone && letterIndex(tone.note.letter)).toBe(
          (letterIndex(root.letter) + interval.steps) % 7,
        )
        expect(Math.abs(tone?.note.accidental ?? 3)).toBeLessThanOrEqual(2)
      })
    }
  })
})

describe('chordSymbol', () => {
  it.each([
    [{ root: note('C', 1), quality: 'm7' as const }, 'C#m7'],
    [{ root: note('B', -1), quality: 'maj7' as const }, 'B♭Maj7'],
    [{ root: note('D', 1), quality: 'maj' as const, bass: note('F', 2) }, 'D#/F𝄪'],
    [{ root: note('C'), quality: 'maj' as const }, 'C'],
  ])('%j → %s', (chord, symbol) => {
    expect(chordSymbol(chord)).toBe(symbol)
  })
})

describe('chordBass', () => {
  it('spells a bass that is a chord tone as that tone', () => {
    expect(chordBass(note('E'), 'maj', note('A', -1))).toEqual(note('G', 1))
  })

  it('keeps a bass as written where its tone would take a double accidental', () => {
    expect(chordBass(note('G', -1), 'm6', note('A'))).toEqual(note('A'))
    expect(chordBass(note('D', 1), 'maj', note('G'))).toEqual(note('G'))
  })

  it('keeps a bass outside the chord as written', () => {
    expect(chordBass(note('C'), 'maj', note('D'))).toEqual(note('D'))
  })
})

describe('chordRootSpelling', () => {
  it('leans sharp or flat by quality', () => {
    expect(chordRootSpelling(pitchClass(1), qualityIntervals('min'))).toEqual(note('C', 1))
    expect(chordRootSpelling(pitchClass(1), qualityIntervals('maj'))).toEqual(note('D', -1))
  })
})

describe('qualityRootSpelling', () => {
  it('names a chord of a quality from the root that reads best', () => {
    expect(qualityRootSpelling(pitchClass(1), 'min')).toEqual(note('C', 1))
    expect(qualityRootSpelling(pitchClass(1), 'maj7')).toEqual(note('D', -1))
  })

  it('names a chord from the root that spells it with no double accidental and fewer accidentals', () => {
    expect(qualityRootSpelling(pitchClass(3), 'o7')).toEqual(note('D', 1))
    expect(qualityRootSpelling(pitchClass(3), 'dim')).toEqual(note('D', 1))
    expect(qualityRootSpelling(pitchClass(10), 'o7')).toEqual(note('A', 1))
    expect(qualityRootSpelling(pitchClass(6), 'aug')).toEqual(note('G', -1))
  })

  it('keeps its lean where both roots spell the chord as plainly', () => {
    expect(qualityRootSpelling(pitchClass(3), 'min')).toEqual(note('E', -1))
    expect(qualityRootSpelling(pitchClass(6), 'maj')).toEqual(note('F', 1))
    expect(qualityRootSpelling(pitchClass(10), 'min')).toEqual(note('B', -1))
  })
})

describe('writtenSymbol', () => {
  it('writes a chord from its root and suffix, over a bass that is not its root', () => {
    expect(writtenSymbol({ root: note('G'), suffix: '13(11)' })).toBe('G13(11)')
    expect(writtenSymbol({ root: note('C'), suffix: '' }, note('E'))).toBe('C/E')
  })
})
