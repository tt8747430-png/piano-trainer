import { describe, expect, it } from 'vitest'
import { playOrder, type BarMarks } from './bar-marks'

const bars = (...marks: BarMarks[]) => marks

describe('playOrder', () => {
  it('plays four endings, then a repeat ×3 straight after', () => {
    const order = playOrder(
      bars(
        { repeatStart: true },
        {},
        { ending: 1, barline: 'repeat' },
        { ending: 2, barline: 'repeat' },
        { ending: 3, barline: 'repeat' },
        { ending: 4, barline: 'double' },
        { repeatStart: true },
        { barline: 'repeat', times: 3 },
        {},
      ),
    )
    expect(order).toEqual([0, 1, 2, 0, 1, 3, 0, 1, 4, 0, 1, 5, 6, 7, 6, 7, 6, 7, 8])
  })

  it('plays the bars as written where nothing repeats', () => {
    expect(playOrder(bars({}, {}, { barline: 'double' }, { barline: 'final' }))).toEqual([
      0, 1, 2, 3,
    ])
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

  it('plays a passage the times its repeat says (Flat’s repeat ×N)', () => {
    expect(playOrder(bars({ repeatStart: true }, { barline: 'repeat', times: 3 }, {}))).toEqual([
      0, 1, 0, 1, 0, 1, 2,
    ])
  })

  it('takes the 3rd and 4th endings on the third and fourth times', () => {
    expect(
      playOrder(
        bars(
          { repeatStart: true },
          { ending: 1, barline: 'repeat' },
          { ending: 2, barline: 'repeat' },
          { ending: 3, barline: 'repeat' },
          { ending: 4 },
          { barline: 'final' },
        ),
      ),
    ).toEqual([0, 1, 0, 2, 0, 3, 0, 4, 5])
  })

  it('repeats two passages one after the other', () => {
    expect(
      playOrder(
        bars(
          { repeatStart: true },
          { barline: 'repeat' },
          { repeatStart: true },
          { barline: 'repeat' },
        ),
      ),
    ).toEqual([0, 1, 0, 1, 2, 3, 2, 3])
  })

  it('goes back to the start once at D.C., and on to the end', () => {
    expect(playOrder(bars({}, {}, { jump: 'dc' }))).toEqual([0, 1, 2, 0, 1, 2])
  })

  it('stops at Fine the second time, and plays on past it the first', () => {
    expect(playOrder(bars({}, { fine: true }, {}, { jump: 'dc-fine' }))).toEqual([0, 1, 2, 3, 0, 1])
  })

  it('goes back to the sign at D.S., and from To Coda to the coda', () => {
    expect(
      playOrder(
        bars({}, { segno: true }, { toCoda: true }, { jump: 'ds-coda' }, { coda: true }, {}),
      ),
    ).toEqual([0, 1, 2, 3, 1, 2, 4, 5])
  })

  it('takes no repeat and no 1st ending after a jump', () => {
    expect(
      playOrder(
        bars(
          { repeatStart: true },
          { ending: 1, barline: 'repeat' },
          { ending: 2 },
          { jump: 'dc' },
        ),
      ),
    ).toEqual([0, 1, 0, 2, 3, 0, 2, 3])
  })

  it('takes a repeat before the jump at the same bar’s end', () => {
    expect(playOrder(bars({ fine: true }, {}, { barline: 'repeat', jump: 'dc-fine' }))).toEqual([
      0, 1, 2, 0, 1, 2, 0,
    ])
  })
})
