import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { clefFor } from './clef-for'
import { clefAt, setClefIn } from './clefs'

const at = (midi: number) => ({ midi })

describe('clefFor (A34)', () => {
  it('keeps treble for the upper staff unless at least 70% of its notes are below G3', () => {
    // A pattern's right hand sitting low, but mostly at G3 and over: treble still.
    expect(clefFor([at(55), at(57), at(52), at(60)], 'upper')).toBe('treble')
    expect(clefFor([at(50), at(48), at(60), at(62)], 'upper')).toBe('treble')
    expect(clefFor([at(50), at(48), at(52), at(45), at(60)], 'upper')).toBe('bass')
    expect(clefFor([], 'upper')).toBe('treble')
  })

  it('keeps bass for the lower staff unless at least 70% of its notes are above F4', () => {
    expect(clefFor([at(48), at(60), at(67)], 'lower')).toBe('bass')
    expect(clefFor([at(67), at(69), at(72), at(48)], 'lower')).toBe('treble')
    expect(clefFor([], 'lower')).toBe('bass')
  })
})

describe('a clef change from the palette (R32-C, Flat’s)', () => {
  const draft = draftOf({
    sections: [{ kind: 'verse', lines: ['C C C C'] }],
    hands: { lh: 'C3/4 | C3/4 | C3/4 | C3/4' },
  })
  const clefs = (music: typeof draft) => [0, 1, 2, 3].map((bar) => clefAt(music, bar, 'lh'))

  it('changes the bars chosen alone, the clef before them back after them', () => {
    expect(clefs(setClefIn(draft, 1, 'lh', 'treble', 1))).toEqual([
      'bass',
      'treble',
      'bass',
      'bass',
    ])
    expect(clefs(setClefIn(draft, 1, 'lh', 'treble', 2))).toEqual([
      'bass',
      'treble',
      'treble',
      'bass',
    ])
  })

  it('changes from the bar until the next clef with no range chosen', () => {
    expect(clefs(setClefIn(draft, 2, 'lh', 'treble'))).toEqual(['bass', 'bass', 'treble', 'treble'])
  })
})
