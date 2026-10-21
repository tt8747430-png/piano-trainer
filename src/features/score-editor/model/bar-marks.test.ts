import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { markBars } from './bar-marks'
import { barsOf } from './timeline'

const marks = (draft: ReturnType<typeof draftOf>) =>
  barsOf(draft).map(({ bar }) => [bar.repeatStart, bar.barline, bar.ending])

describe('markBars', () => {
  const four = draftOf({ sections: [{ kind: 'verse', lines: ['G C D G'] }] })

  it('starts a repeat at the first bar chosen and ends one, or another barline, at the last', () => {
    const repeated = markBars(
      markBars(four, { from: 1, to: 2 }, 'repeatStart'),
      { from: 1, to: 2 },
      'repeatEnd',
    )
    expect(marks(repeated)).toEqual([
      [undefined, undefined, undefined],
      [true, undefined, undefined],
      [undefined, 'repeat', undefined],
      [undefined, undefined, undefined],
    ])
    expect(marks(markBars(four, { from: 3, to: 3 }, 'final'))[3]).toEqual([
      undefined,
      'final',
      undefined,
    ])
  })

  it('takes a mark off a bar that has it, and every mark with Plain', () => {
    const doubled = markBars(four, { from: 0, to: 0 }, 'double')
    expect(markBars(doubled, { from: 0, to: 0 }, 'double')).toEqual(four)
    const ending = markBars(four, { from: 1, to: 2 }, 'ending1')
    expect(marks(ending).map(([, , end]) => end)).toEqual([undefined, 1, 1, undefined])
    expect(markBars(ending, { from: 1, to: 2 }, 'plain')).toEqual(four)
  })
})
