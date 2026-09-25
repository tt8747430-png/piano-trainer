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
  qualitySpellings,
  qualitySuffix,
  spellChord,
  type ChordQuality,
} from './chord'
import { letterIndex, note, noteName, pitchClassOf, type SpelledNote } from './note'
import { pitchClass } from './pitch'

const names = (root: SpelledNote, quality: ChordQuality) =>
  spellChord(root, quality).map((tone) => noteName(tone.note))

describe('chord qualities', () => {
  it('are 33, in five families', () => {
    expect(CHORD_QUALITIES).toHaveLength(33)
    expect(CHORD_FAMILIES.map((family) => qualitiesIn(family).length)).toEqual([6, 5, 9, 5, 8])
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
      const root = chordRootSpelling(pitchClass(pc), quality)
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
    expect(chordBass(note('D', 1), 'maj', note('G'))).toEqual(note('F', 2))
  })

  it('keeps a bass outside the chord as written', () => {
    expect(chordBass(note('C'), 'maj', note('D'))).toEqual(note('D'))
  })
})

describe('chordRootSpelling', () => {
  it('leans sharp or flat by quality', () => {
    expect(chordRootSpelling(pitchClass(1), 'min')).toEqual(note('C', 1))
    expect(chordRootSpelling(pitchClass(1), 'maj')).toEqual(note('D', -1))
  })
})
