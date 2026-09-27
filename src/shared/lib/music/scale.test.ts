import { describe, expect, it } from 'vitest'
import type { Key } from './key'
import { note, noteName, rootSpelling, type SpelledNote } from './note'
import { pitchClass } from './pitch'
import {
  SCALE_FAMILIES,
  SCALE_KINDS,
  isMinorScale,
  modesOfKey,
  relatedScale,
  scaleGaps,
  scaleHasChords,
  scaleIntervals,
  scaleKey,
  scaleKindsIn,
  scaleRootSpelling,
  spellInKey,
  spellScale,
  type ScaleKind,
} from './scale'

const names = (root: SpelledNote, kind: ScaleKind) =>
  spellScale(root, kind).map((tone) => noteName(tone.note))

describe('spellScale', () => {
  it.each([
    [note('C'), 'major', 'C D E F G A B'],
    [note('E', -1), 'harmonic', 'E♭ F G♭ A♭ B♭ C♭ D'],
    [note('G', 1), 'harmonic', 'G# A# B C# D# E F𝄪'],
    [note('D'), 'melodic', 'D E F G A B C#'],
    [note('F', 1), 'major', 'F# G# A# B C# D# E#'],
    [note('E', -1), 'mpent', 'E♭ G♭ A♭ B♭ D♭'],
    [note('C'), 'pent', 'C D E G A'],
  ] as const)('spells %j %s as %s', (root, kind, expected) => {
    expect(names(root, kind).join(' ')).toBe(expected)
  })

  it.each([
    [note('C'), 'C E♭ F G♭ G B♭', '♭5'],
    [note('A'), 'A C D E♭ E G', '♭5'],
    [note('E', -1), 'E♭ G♭ A♭ A B♭ D♭', '#4'],
    [note('F', 1), 'F# A B C C# E', '♭5'],
    [note('C', 1), 'C# E F# G G# B', '♭5'],
  ])('spells the %j blues with its blue note', (root, expected, blueDegree) => {
    expect(names(root, 'blues').join(' ')).toBe(expected)
    expect(spellScale(root, 'blues')[3]?.degree).toBe(blueDegree)
  })

  it.each(SCALE_KINDS)('spells %s on all 12 roots', (kind) => {
    for (let pc = 0; pc < 12; pc++) {
      const root = scaleRootSpelling(pitchClass(pc), kind)
      for (const tone of spellScale(root, kind)) {
        expect(tone.pitchClass).toBe(pitchClass(pc + tone.semitones))
        expect(Math.abs(tone.note.accidental)).toBeLessThanOrEqual(2)
      }
    }
  })

  it('labels degrees and roles', () => {
    const tones = spellScale(note('C'), 'natural')
    expect(tones.map((tone) => tone.degree).join(' ')).toBe('1 2 ♭3 4 5 ♭6 ♭7')
    expect(tones[2]?.role).toBe('3rd')
    expect(tones[5]?.role).toBe('13th')
  })
})

describe('scaleIntervals', () => {
  it.each([
    ['major', [0, 2, 4, 5, 7, 9, 11]],
    ['natural', [0, 2, 3, 5, 7, 8, 10]],
    ['blues', [0, 3, 5, 6, 7, 10]],
  ] as const)('measures %s from its root', (kind, semitones) => {
    expect(scaleIntervals(kind).map((interval) => interval.semitones)).toEqual(semitones)
  })

  it('climbs one letter a degree in a seven-note scale', () => {
    expect(scaleIntervals('harmonic').map((interval) => interval.steps)).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ])
  })
})

describe('scaleRootSpelling', () => {
  it('leans sharp for minor kinds, blues included', () => {
    expect(scaleRootSpelling(pitchClass(1), 'major')).toEqual(note('D', -1))
    expect(scaleRootSpelling(pitchClass(1), 'natural')).toEqual(note('C', 1))
    expect(
      [1, 6, 8, 3, 10].map((pc) => noteName(scaleRootSpelling(pitchClass(pc), 'blues'))),
    ).toEqual(['C#', 'F#', 'G#', 'E♭', 'B♭'])
  })
})

describe('scaleGaps', () => {
  it('names the gaps between neighbouring notes up to the octave', () => {
    expect(scaleGaps('major')).toEqual(['W', 'W', 'H', 'W', 'W', 'W', 'H'])
    expect(scaleGaps('harmonic')).toEqual(['W', 'H', 'W', 'W', 'H', 'W+H', 'H'])
    expect(scaleGaps('blues')).toEqual(['W+H', 'W', 'H', 'H', 'W+H', 'W'])
  })
})

describe('the kinds', () => {
  it('are thirteen, in three families', () => {
    expect(SCALE_FAMILIES.map((family) => scaleKindsIn(family))).toEqual([
      ['major', 'natural', 'harmonic', 'melodic'],
      ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
      ['pent', 'mpent', 'majorBlues', 'blues'],
    ])
    expect(SCALE_KINDS).toHaveLength(13)
  })

  it('knows which kinds are minor: a minor 3rd above the root', () => {
    expect(SCALE_KINDS.filter(isMinorScale)).toEqual([
      'natural',
      'harmonic',
      'melodic',
      'dorian',
      'phrygian',
      'locrian',
      'mpent',
      'blues',
    ])
  })
})

describe('the modes', () => {
  it.each([
    ['dorian', note('D'), 'D E F G A B C'],
    ['phrygian', note('E'), 'E F G A B C D'],
    ['lydian', note('F'), 'F G A B C D E'],
    ['mixolydian', note('G'), 'G A B C D E F'],
    ['locrian', note('B'), 'B C D E F G A'],
  ] as const)('spell %s on %j with C major’s notes', (kind, root, expected) => {
    expect(names(root, kind).join(' ')).toBe(expected)
  })

  it('label Phrygian’s 2nd and Locrian’s 5th flat', () => {
    expect(
      spellScale(note('E'), 'phrygian')
        .map((tone) => tone.degree)
        .join(' '),
    ).toBe('1 ♭2 ♭3 4 5 ♭6 ♭7')
    expect(spellScale(note('B'), 'locrian')[4]?.degree).toBe('♭5')
  })

  it('share their parent major’s notes on every root', () => {
    for (const kind of scaleKindsIn('modes')) {
      for (let pc = 0; pc < 12; pc++) {
        const root = scaleRootSpelling(pitchClass(pc), kind)
        const parent = relatedScale(root, kind)
        if (!parent) throw new Error(kind)
        expect(parent.relation).toBe('parent')
        expect(new Set(names(root, kind))).toEqual(new Set(names(parent.root, 'major')))
      }
    }
  })
})

describe('the major blues', () => {
  it.each([
    [note('C'), 'C D E♭ E G A', '♭3'],
    [note('G'), 'G A B♭ B D E', '♭3'],
    [note('E'), 'E F# G G# B C#', '♭3'],
    [note('D', -1), 'D♭ E♭ E F A♭ B♭', '#2'],
  ])('spells %j with its blue note', (root, expected, blueDegree) => {
    expect(names(root, 'majorBlues').join(' ')).toBe(expected)
    expect(spellScale(root, 'majorBlues')[2]?.degree).toBe(blueDegree)
  })

  it('is the relative of the minor blues', () => {
    expect(relatedScale(note('C'), 'majorBlues')).toMatchObject({ root: note('A'), kind: 'blues' })
    expect(relatedScale(note('A'), 'blues')).toMatchObject({ root: note('C'), kind: 'majorBlues' })
  })
})

describe('relatedScale', () => {
  it('pairs a major scale with the natural minor on its 6th', () => {
    expect(relatedScale(note('E', -1), 'major')).toEqual({
      root: note('C'),
      kind: 'natural',
      degree: 5,
      relation: 'relative',
    })
  })

  it('gives the minors their relative major on the 3rd', () => {
    expect(relatedScale(note('A'), 'natural')).toMatchObject({ root: note('C'), kind: 'major' })
    expect(relatedScale(note('G', 1), 'harmonic')).toMatchObject({ root: note('B'), kind: 'major' })
  })

  it('pairs the pentatonics', () => {
    expect(relatedScale(note('C'), 'pent')).toMatchObject({ root: note('A'), kind: 'mpent' })
    expect(relatedScale(note('A'), 'mpent')).toMatchObject({ root: note('C'), kind: 'pent' })
  })

  it('names a mode’s parent major', () => {
    expect(relatedScale(note('D'), 'dorian')).toEqual({
      root: note('C'),
      kind: 'major',
      degree: 6,
      relation: 'parent',
    })
  })
})

describe('scaleKey', () => {
  it('writes a major or minor kind in its own key, a mode in its parent’s', () => {
    expect(scaleKey(note('E', -1), 'harmonic')).toEqual({ tonic: note('E', -1), minor: true })
    expect(scaleKey(note('C'), 'majorBlues')).toEqual({ tonic: note('C'), minor: false })
    expect(scaleKey(note('D'), 'dorian')).toEqual({ tonic: note('C'), minor: false })
  })
})

describe('scaleRootSpelling, beyond today’s kinds', () => {
  it('spells every major and minor kind’s root as the keys do', () => {
    for (const kind of [
      'major',
      'natural',
      'harmonic',
      'melodic',
      'pent',
      'mpent',
      'blues',
    ] as const) {
      for (let pc = 0; pc < 12; pc++) {
        expect(scaleRootSpelling(pitchClass(pc), kind)).toEqual(
          rootSpelling(pitchClass(pc), isMinorScale(kind)),
        )
      }
    }
  })

  it('spells a mode’s root so its signature has the fewest sharps or flats', () => {
    expect(noteName(scaleRootSpelling(pitchClass(3), 'phrygian'))).toBe('D#')
    expect(noteName(scaleRootSpelling(pitchClass(6), 'lydian'))).toBe('G♭')
    expect(noteName(scaleRootSpelling(pitchClass(10), 'locrian'))).toBe('A#')
    expect(noteName(scaleRootSpelling(pitchClass(1), 'dorian'))).toBe('C#')
  })
})

describe('scaleHasChords', () => {
  it('is true for the seven-note scales', () => {
    expect(SCALE_KINDS.filter(scaleHasChords)).toEqual([
      'major',
      'natural',
      'harmonic',
      'melodic',
      'dorian',
      'phrygian',
      'lydian',
      'mixolydian',
      'locrian',
    ])
  })
})

describe('modesOfKey', () => {
  const named = (key: Key) => modesOfKey(key).map(({ root, kind }) => `${noteName(root)} ${kind}`)

  it('names the scales that share a major key’s notes, the key’s own left out', () => {
    expect(named({ tonic: note('E', -1), minor: false })).toEqual([
      'F dorian',
      'G phrygian',
      'A♭ lydian',
      'B♭ mixolydian',
      'C natural',
      'D locrian',
    ])
  })

  it('takes a minor key’s from its relative major, the relative major included', () => {
    expect(named({ tonic: note('A'), minor: true })).toEqual([
      'C major',
      'D dorian',
      'E phrygian',
      'F lydian',
      'G mixolydian',
      'B locrian',
    ])
  })
})

describe('spellInKey', () => {
  const major = (tonic: SpelledNote): Key => ({ tonic, minor: false })

  it('spells a note of the key as its scale does', () => {
    expect(spellInKey(pitchClass(6), major(note('D', -1)))).toEqual(note('G', -1))
    expect(spellInKey(pitchClass(10), major(note('F')))).toEqual(note('B', -1))
    expect(spellInKey(pitchClass(1), major(note('E')))).toEqual(note('C', 1))
  })

  it('spells a minor key’s raised 6th and 7th', () => {
    const aMinor: Key = { tonic: note('A'), minor: true }
    expect(spellInKey(pitchClass(8), aMinor)).toEqual(note('G', 1))
    expect(spellInKey(pitchClass(6), aMinor)).toEqual(note('F', 1))
  })

  it('spells a note outside the key plainly, in the key’s direction', () => {
    expect(spellInKey(pitchClass(6), major(note('C')))).toEqual(note('G', -1))
    expect(spellInKey(pitchClass(10), major(note('G')))).toEqual(note('A', 1))
  })
})
