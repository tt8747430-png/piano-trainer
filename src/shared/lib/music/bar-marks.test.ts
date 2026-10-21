import { describe, expect, it } from 'vitest'
import { playOrder, type BarMarks } from './bar-marks'

const bars = (...marks: BarMarks[]) => marks

describe('playOrder', () => {
  it('plays the bars as written where nothing repeats', () => {
    expect(playOrder(bars({}, {}, { barline: 'double' }, { barline: 'final' }))).toEqual([0, 1, 2, 3])
  })

  it('goes back to the repeat’s start, or the piece’s, once', () => {
    expect(playOrder(bars({}, { repeatStart: true }, { barline: 'repeat' }, {}))).toEqual([
      0, 1, 2, 1, 2, 3,
    ])
    expect(playOrder(bars({}, { barline: 'repeat' }, {}))).toEqual([0, 1, 0, 1, 2])
  })

  it('takes the 1st ending the first time and the 2nd the second', () => {
    expect(
      playOrder(
        bars(
          { repeatStart: true },
          {},
          { ending: 1 },
          { ending: 1, barline: 'repeat' },
          { ending: 2 },
          { barline: 'final' },
        ),
      ),
    ).toEqual([0, 1, 2, 3, 0, 1, 4, 5])
  })

  it('repeats two passages one after the other', () => {
    expect(
      playOrder(
        bars({ repeatStart: true }, { barline: 'repeat' }, { repeatStart: true }, { barline: 'repeat' }),
      ),
    ).toEqual([0, 1, 0, 1, 2, 3, 2, 3])
  })
})
