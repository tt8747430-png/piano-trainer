import { describe, expect, it } from 'vitest'
import { note, noteName, type SpelledNote } from './note'
import { pitchClass } from './pitch'
import { SCALE_KINDS, isMinorScale, scaleRootSpelling, spellScale, type ScaleKind } from './scale'

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

describe('scaleRootSpelling', () => {
  it('leans sharp for minor kinds, blues included', () => {
    expect(scaleRootSpelling(pitchClass(1), 'major')).toEqual(note('D', -1))
    expect(scaleRootSpelling(pitchClass(1), 'natural')).toEqual(note('C', 1))
    expect(
      [1, 6, 8, 3, 10].map((pc) => noteName(scaleRootSpelling(pitchClass(pc), 'blues'))),
    ).toEqual(['C#', 'F#', 'G#', 'E♭', 'B♭'])
  })

  it('knows which kinds are minor', () => {
    expect(SCALE_KINDS.filter(isMinorScale)).toEqual([
      'natural',
      'harmonic',
      'melodic',
      'mpent',
      'blues',
    ])
  })
})
