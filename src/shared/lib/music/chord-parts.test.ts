import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, qualitySuffix } from './chord'
import {
  addedOf,
  alterationsOf,
  buildChord,
  builtRootSpelling,
  CHORD_PARTS,
  fitParts,
  partsOf,
  seventhsOf,
  sizesOf,
  withAdded,
  withAlterations,
  type ChordParts,
} from './chord-parts'
import { note, noteName } from './note'
import { pitchClass } from './pitch'
import { availableTensions } from './tensions'

const TRIAD: ChordParts = {
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: [],
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
    [{ added: ['add6'] }, 'C6: C E G A'],
    [{ triad: 'min', added: ['add6', 'add9'] }, 'Cm6/9: C E♭ G A D'],
    [{ triad: 'min', added: ['add9'] }, 'Cm(add9): C E♭ G D'],
    [{ added: ['add2'] }, 'Cadd2: C D E G'],
    [{ triad: 'min', added: ['add4'] }, 'Cm(add4): C E♭ F G'],
    [{ triad: 'min', added: ['add11'] }, 'Cm(add11): C E♭ G F'],
    [{ triad: 'sus4', added: ['add6'] }, 'C6sus4: C F G A'],
    [{ triad: 'sus4', added: ['add9'] }, 'Csus4(add9): C F G D'],
    [{ triad: 'sus4', added: ['add6', 'add9'] }, 'C6/9sus4: C F G A D'],
    [{ triad: 'sus2', added: ['add6'] }, 'C6sus2: C D G A'],
    [{ triad: 'aug', added: ['add9'] }, 'C+(add9): C E G# D'],
    [{ added: ['addS11'] }, 'Cadd#11: C E G F#'],
    [{ added: ['add2', 'add4'] }, 'C(add2,add4): C D E F G'],
    [{ added: ['add6', 'add11'] }, 'C6(add11): C E G A F'],
    [{ triad: 'min', added: ['add6', 'add9', 'add11'] }, 'Cm6/9(add11): C E♭ G A D F'],
  ] as const)('builds a triad and the tones it adds: %o → %s', (change, expected) => {
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
    [{ triad: 'sus4', size: 7, alterations: ['b9'] }, 'C7sus4♭9: C F G B♭ D♭'],
    [{ triad: 'sus4', size: 13, alterations: ['b9'] }, 'C13sus4♭9: C F G B♭ D♭ A'],
  ] as const)('alters a 7th chord with a major 3rd: %o → %s', (change, expected) => {
    expect(built(change)).toBe(expected)
  })

  it.each([
    [{ size: 7, added: ['add13'] }, 'C7(add13): C E G B♭ A'],
    [{ size: 7, seventh: 'major', added: ['add13'] }, 'CMaj7(add13): C E G B A'],
    [{ triad: 'min', size: 7, added: ['add11'] }, 'Cm7(add11): C E♭ G B♭ F'],
    [{ triad: 'min', size: 7, added: ['add11', 'add13'] }, 'Cm7(add11,add13): C E♭ G B♭ F A'],
    [{ triad: 'min', size: 9, added: ['add13'] }, 'Cm9(add13): C E♭ G B♭ D A'],
    [{ triad: 'dim', size: 7, added: ['add11'] }, 'Cm7♭5(add11): C E♭ G♭ B♭ F'],
    [{ size: 7, alterations: ['b9'], added: ['add13'] }, 'C7♭9(add13): C E G B♭ D♭ A'],
  ] as const)('adds to a 7th chord a tone its stack skipped: %o → %s', (change, expected) => {
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
  it('makes 172 chords, each once', () => {
    const suffixes = CHORD_PARTS.map((each) => buildChord(note('C'), each).suffix)
    expect(new Set(suffixes).size).toBe(suffixes.length)
    expect(suffixes).toHaveLength(172)
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

  it('alters a dominant every way, a major 7th only by its #11, a 7sus4 by its ♭9, a minor chord not at all', () => {
    expect(alterationsOf(parts({ size: 9 }))).toEqual(['b5', 'b9', 's9', 's11', 'b13'])
    expect(alterationsOf(parts({ triad: 'aug', size: 7 }))).toEqual(['b5', 'b9', 's9', 's11'])
    expect(alterationsOf(parts({ size: 7, seventh: 'major' }))).toEqual(['s11'])
    expect(alterationsOf(parts({ triad: 'sus4', size: 7 }))).toEqual(['b9'])
    expect(alterationsOf(parts({ triad: 'sus4', size: 13 }))).toEqual(['b9'])
    expect(alterationsOf(parts({ triad: 'sus4' }))).toEqual([])
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
      fitParts(parts({ size: 7, added: ['add6'], seventh: 'major', alterations: ['b9', 's11'] })),
    ).toEqual(parts({ size: 7, seventh: 'major', alterations: ['s11'] }))
    expect(fitParts(parts({ seventh: 'major', alterations: ['b9'] }))).toEqual(TRIAD)
    expect(fitParts(parts({ triad: 'dim', size: 9, seventh: 'diminished' })).seventh).toBe('minor')
    expect(fitParts(parts({ triad: 'dim', added: ['add6'] })).added).toEqual([])
    expect(fitParts(parts({ size: 9, added: ['add13'] })).added).toEqual([])
  })

  it('keeps one of the tones an octave apart, and an added 13th over a ♭13', () => {
    expect(fitParts(parts({ added: ['add9', 'add2', 'add11', 'add4'] })).added).toEqual([
      'add2',
      'add4',
    ])
    expect(fitParts(parts({ size: 7, added: ['add13'], alterations: ['b9', 'b13'] }))).toEqual(
      parts({ size: 7, added: ['add13'], alterations: ['b9'] }),
    )
  })
})

describe('what a chord may add', () => {
  it('offers a triad the tones dictionaries name, and a 7th chord the ones its stack skipped', () => {
    expect(addedOf(parts({}))).toEqual(['add2', 'add4', 'add6', 'add9', 'add11', 'addS11'])
    expect(addedOf(parts({ triad: 'min' }))).toEqual(['add2', 'add4', 'add6', 'add9', 'add11'])
    expect(addedOf(parts({ triad: 'sus4' }))).toEqual(['add6', 'add9'])
    expect(addedOf(parts({ triad: 'sus2' }))).toEqual(['add6'])
    expect(addedOf(parts({ triad: 'aug' }))).toEqual(['add9'])
    expect(addedOf(parts({ triad: 'dim' }))).toEqual([])
    expect(addedOf(parts({ size: 7 }))).toEqual(['add13'])
    expect(addedOf(parts({ triad: 'min', size: 7 }))).toEqual(['add11', 'add13'])
    expect(addedOf(parts({ triad: 'dim', size: 7 }))).toEqual(['add11'])
    expect(addedOf(parts({ triad: 'min', size: 9 }))).toEqual(['add13'])
    expect(addedOf(parts({ size: 9 }))).toEqual([])
    expect(addedOf(parts({ triad: 'min', size: 11 }))).toEqual([])
    expect(addedOf(parts({ triad: 'sus4', size: 7 }))).toEqual([])
  })
})

describe('withAdded', () => {
  it('keeps the one chosen last of the tones an octave apart', () => {
    const second = parts({ added: ['add2', 'add6'] })
    expect(withAdded(second, ['add2', 'add6', 'add9']).added).toEqual(['add6', 'add9'])
    expect(withAdded(parts({ added: ['add11'] }), ['add11', 'addS11']).added).toEqual(['addS11'])
    expect(withAdded(second, ['add6']).added).toEqual(['add6'])
  })

  it('takes an added 13th in place of a ♭13, and a ♭13 in place of it', () => {
    const flat = parts({ size: 7, alterations: ['b9', 'b13'] })
    expect(withAdded(flat, ['add13'])).toEqual(
      parts({ size: 7, added: ['add13'], alterations: ['b9'] }),
    )
    const natural = parts({ size: 7, added: ['add13'] })
    expect(withAlterations(natural, ['b13'])).toEqual(parts({ size: 7, alterations: ['b13'] }))
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

describe('the builder’s alterations', () => {
  /** What each alteration puts in, above the root. */
  const ADDS = { b9: 13, s9: 15, s11: 18, b13: 20 } as const

  it('are the available tensions of the 7th chord they alter, but for the ♭5, which alters the chord', () => {
    for (const triad of ['maj', 'aug', 'sus4'] as const) {
      for (const size of sizesOf(triad)) {
        if (size === 5) continue
        for (const seventh of seventhsOf(triad, size)) {
          const parts = { triad, size, seventh, added: [], alterations: [] } as const
          if (alterationsOf(parts).length === 0) continue
          const base = buildChord(note('C'), { ...parts, size: 7 }).quality
          if (!base) throw new Error(`the table has no ${triad} ${seventh} 7th`)
          const tensions = availableTensions(base).map((tension) => tension.semitones)
          for (const alteration of alterationsOf(parts)) {
            if (alteration === 'b5') continue
            expect(tensions, `${triad} ${seventh} ${alteration}`).toContain(ADDS[alteration])
          }
        }
      }
    }
  })
})
