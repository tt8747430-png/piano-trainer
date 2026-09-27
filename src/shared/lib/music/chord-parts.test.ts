import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, qualitySuffix } from './chord'
import {
  alterationsOf,
  buildChord,
  builtRootSpelling,
  CHORD_PARTS,
  fitParts,
  partsFromParams,
  partsOf,
  partsParams,
  readAlterations,
  sizesOf,
  withAlterations,
  type ChordParts,
} from './chord-parts'
import { note, noteName } from './note'
import { pitchClass } from './pitch'

const TRIAD: ChordParts = {
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: 'none',
  alterations: [],
}
const parts = (change: Partial<ChordParts>): ChordParts => ({ ...TRIAD, ...change })
const built = (change: Partial<ChordParts>, root = note('C')) => {
  const chord = buildChord(root, parts(change))
  return `${noteName(chord.root)}${chord.suffix}: ${chord.tones.map((t) => noteName(t.note)).join(' ')}`
}

describe('buildChord', () => {
  it.each([
    [{}, 'C: C E G'],
    [{ triad: 'sus4' }, 'Csus4: C F G'],
    [{ added: 'six' }, 'C6: C E G A'],
    [{ triad: 'min', added: 'sixNine' }, 'Cm6/9: C E♭ G A D'],
    [{ triad: 'min', added: 'add9' }, 'Cm(add9): C E♭ G D'],
    [{ added: 'add2' }, 'Cadd2: C D E G'],
    [{ triad: 'min', added: 'add4' }, 'Cm(add4): C E♭ F G'],
    [{ triad: 'min', added: 'add11' }, 'Cm(add11): C E♭ G F'],
    [{ triad: 'sus4', added: 'six' }, 'C6sus4: C F G A'],
    [{ triad: 'sus4', added: 'add9' }, 'Csus4(add9): C F G D'],
  ] as const)('builds a triad and its added tone: %o → %s', (change, expected) => {
    expect(built(change)).toBe(expected)
  })

  it.each([
    [{ size: 7 }, 'C7: C E G B♭'],
    [{ size: 7, seventh: 'major' }, 'CMaj7: C E G B'],
    [{ triad: 'dim', size: 7, seventh: 'diminished' }, 'C°7: C E♭ G♭ B𝄫'],
    [{ triad: 'sus2', size: 7, seventh: 'major' }, 'CMaj7sus2: C D G B'],
    [{ triad: 'sus4', size: 9 }, 'C9sus4: C F G B♭ D'],
    [{ triad: 'sus4', size: 13 }, 'C13sus4: C F G B♭ D A'],
    [{ size: 11 }, 'C11: C E G B♭ D F'],
    [{ triad: 'min', size: 11, seventh: 'major' }, 'Cm(maj11): C E♭ G B D F'],
    [{ triad: 'dim', size: 11 }, 'Cm11♭5: C E♭ G♭ B♭ D F'],
    [{ triad: 'min', size: 13 }, 'Cm13: C E♭ G B♭ D F A'],
    [{ size: 13, seventh: 'major' }, 'CMaj13: C E G B D A'],
    [{ triad: 'aug', size: 9 }, 'C9#5: C E G# B♭ D'],
  ] as const)(
    'stacks a size, the 11th left out of a 13th over a major 3rd: %o → %s',
    (change, expected) => {
      expect(built(change)).toBe(expected)
    },
  )

  it.each([
    [{ size: 7, alterations: ['b5'] }, 'C7♭5: C E G♭ B♭'],
    [{ size: 7, alterations: ['s11'] }, 'C7#11: C E G B♭ F#'],
    [{ size: 7, alterations: ['b13'] }, 'C7♭13: C E G B♭ A♭'],
    [{ size: 7, alterations: ['b5', 'b9'] }, 'C7♭5♭9: C E G♭ B♭ D♭'],
    [{ size: 9, alterations: ['s11'] }, 'C9#11: C E G B♭ D F#'],
    [{ size: 13, alterations: ['b9'] }, 'C13♭9: C E G B♭ D♭ A'],
    [{ size: 13, alterations: ['s11'] }, 'C13#11: C E G B♭ D F# A'],
    [{ size: 13, alterations: ['b9', 'b13'] }, 'C7♭9♭13: C E G B♭ D♭ A♭'],
    [{ size: 13, seventh: 'major', alterations: ['s11'] }, 'CMaj13#11: C E G B D F# A'],
    [{ triad: 'aug', size: 7, alterations: ['s9'] }, 'C7#5#9: C E G# B♭ D#'],
  ] as const)('alters a 7th chord with a major 3rd: %o → %s', (change, expected) => {
    expect(built(change)).toBe(expected)
  })

  it('names a chord the table has as the table does, and knows its quality', () => {
    const b9s5 = buildChord(note('C'), parts({ triad: 'aug', size: 7, alterations: ['b9'] }))
    expect(b9s5).toMatchObject({ quality: 'b9s5', suffix: '7♭9#5' })
    const alt = buildChord(
      note('C'),
      parts({ triad: 'aug', size: 7, alterations: ['b5', 'b9', 's9'] }),
    )
    expect(alt).toMatchObject({ quality: 'alt', suffix: '7alt' })
    expect(buildChord(note('C'), parts({ size: 9, alterations: ['s11'] })).quality).toBeUndefined()
  })
})

describe('partsOf', () => {
  it('builds every chord of the table back into its quality', () => {
    for (const quality of CHORD_QUALITIES) {
      const chord = buildChord(note('C'), partsOf(quality))
      expect(chord.quality, quality).toBe(quality)
      expect(chord.suffix).toBe(qualitySuffix(quality))
    }
  })
})

describe('CHORD_PARTS', () => {
  it('makes 124 chords, each once', () => {
    const suffixes = CHORD_PARTS.map((each) => buildChord(note('C'), each).suffix)
    expect(new Set(suffixes).size).toBe(suffixes.length)
    expect(suffixes).toHaveLength(124)
  })

  it('holds only parts that fit', () => {
    for (const each of CHORD_PARTS) expect(fitParts(each)).toEqual(each)
  })
})

describe('what a triad and size offer', () => {
  it('stops a suspension where its own tone would stack again, and the altered triads where dictionaries do', () => {
    expect(sizesOf('maj')).toEqual([5, 7, 9, 11, 13])
    expect(sizesOf('sus2')).toEqual([5, 7])
    expect(sizesOf('sus4')).toEqual([5, 7, 9, 13])
    expect(sizesOf('dim')).toEqual([5, 7, 9, 11])
    expect(sizesOf('aug')).toEqual([5, 7, 9])
  })

  it('alters a dominant every way, a major 7th only by its #11, a minor chord not at all', () => {
    expect(alterationsOf(parts({ size: 9 }))).toEqual(['b5', 'b9', 's9', 's11', 'b13'])
    expect(alterationsOf(parts({ triad: 'aug', size: 7 }))).toEqual(['b5', 'b9', 's9', 's11'])
    expect(alterationsOf(parts({ size: 7, seventh: 'major' }))).toEqual(['s11'])
    expect(alterationsOf(parts({ triad: 'min', size: 9 }))).toEqual([])
    expect(alterationsOf(parts({}))).toEqual([])
  })
})

describe('fitParts', () => {
  it('keeps a size the triad has, else the largest below it', () => {
    expect(fitParts(parts({ triad: 'sus2', size: 13 })).size).toBe(7)
    expect(fitParts(parts({ triad: 'sus4', size: 11 })).size).toBe(9)
  })

  it('drops the parts a chord of its size does not have, and the alterations it cannot take', () => {
    expect(
      fitParts(parts({ size: 7, added: 'six', seventh: 'major', alterations: ['b9', 's11'] })),
    ).toEqual(parts({ size: 7, seventh: 'major', alterations: ['s11'] }))
    expect(fitParts(parts({ seventh: 'major', alterations: ['b9'] }))).toEqual(TRIAD)
    expect(fitParts(parts({ triad: 'dim', size: 9, seventh: 'diminished' })).seventh).toBe('minor')
    expect(fitParts(parts({ triad: 'dim', added: 'six' })).added).toBe('none')
  })
})

describe('withAlterations', () => {
  it('keeps a ♭5 or a #11, the one chosen last: they are the same key', () => {
    const flatFive = parts({ size: 7, alterations: ['b5', 'b9'] })
    expect(withAlterations(flatFive, ['b5', 'b9', 's11']).alterations).toEqual(['b9', 's11'])
    expect(withAlterations(flatFive, ['b9']).alterations).toEqual(['b9'])
    expect(fitParts(parts({ size: 7, alterations: ['b5', 's11'] })).alterations).toEqual(['b5'])
  })
})

describe('builtRootSpelling', () => {
  it('names a root sharp under a minor 3rd or a minor 9th, as the table’s chords', () => {
    expect(builtRootSpelling(pitchClass(1), parts({ triad: 'min', size: 13 }))).toEqual(
      note('C', 1),
    )
    expect(builtRootSpelling(pitchClass(1), parts({ size: 13, alterations: ['b9'] }))).toEqual(
      note('C', 1),
    )
    expect(builtRootSpelling(pitchClass(1), parts({ triad: 'sus4', size: 9 }))).toEqual(
      note('D', -1),
    )
  })
})

describe('the parts’ URL params', () => {
  it('write the alterations as a symbol does, and read back only that', () => {
    const ninthSharpEleven = parts({ size: 9, alterations: ['b9', 's11'] })
    expect(partsParams(ninthSharpEleven)).toEqual({
      triad: 'maj',
      size: 9,
      seventh: 'minor',
      added: 'none',
      alter: 'b9s11',
    })
    expect(partsFromParams(partsParams(ninthSharpEleven))).toEqual(ninthSharpEleven)
    expect(partsParams(TRIAD).alter).toBe('')
    expect(readAlterations('b5b9s9')).toEqual(['b5', 'b9', 's9'])
    expect(readAlterations('s11b9')).toEqual([])
    expect(readAlterations('b9b9')).toEqual([])
    expect(readAlterations(7)).toEqual([])
  })
})
