import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { setClef } from './clefs'
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
