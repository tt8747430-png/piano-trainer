import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { clefAt, setClef } from './clefs'
import { barsOf } from './timeline'

const clefsOf = (draft: ReturnType<typeof draftOf>) => barsOf(draft).map(({ bar }) => bar.clefs)

describe('setClef', () => {
  const four = draftOf({ sections: [{ kind: 'verse', lines: ['G C D G'] }] })

  it('changes a hand’s clef at a bar, and back where the bars before are in it already', () => {
    const up = setClef(four, 1, 'lh', 'treble')
    expect(clefsOf(up)).toEqual([undefined, { lh: 'treble' }, undefined, undefined])
    const down = setClef(up, 3, 'lh', 'bass')
    expect(clefsOf(down)).toEqual([undefined, { lh: 'treble' }, undefined, { lh: 'bass' }])
    expect(setClef(down, 2, 'lh', 'treble')).toEqual(down)
    expect(setClef(up, 1, 'lh', 'bass')).toEqual(four)
  })
})

describe('clefAt', () => {
  it('reads a hand’s clef at a bar, and a single staff’s whole (ADR 0097)', () => {
    const draft = draftOf({
      sections: [{ kind: 'verse', lines: ['G C D G'] }],
      staves: [
        { notes: 'G4/4 | r/4 | r/4 | r/4' },
        { clef: 'bass', notes: 'G2/4 | r/4 | r/4 | r/4' },
      ],
    })
    const up = setClef(draft, 1, 'lh', 'treble')
    expect([0, 1, 3].map((bar) => clefAt(up, bar, 'lh'))).toEqual(['bass', 'treble', 'treble'])
    expect(clefAt(up, 2, 'rh')).toBe('treble')
    expect(clefAt(up, 2, 'staff0')).toBe('treble')
    expect(clefAt(up, 2, 'staff1')).toBe('bass')
  })
})
