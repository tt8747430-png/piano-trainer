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

  it('plays a repeat once more each time Repeat ×N is tapped, up to nine, then twice again', () => {
    const times = (draft: ReturnType<typeof draftOf>) => barsOf(draft)[2]?.bar.times
    const once = markBars(four, { from: 1, to: 2 }, 'repeatTimes')
    expect(barsOf(once)[2]?.bar.barline).toBe('repeat')
    expect(times(once)).toBe(3)
    let more = once
    for (let tap = 0; tap < 6; tap += 1) more = markBars(more, { from: 1, to: 2 }, 'repeatTimes')
    expect(times(more)).toBe(9)
    expect(times(markBars(more, { from: 1, to: 2 }, 'repeatTimes'))).toBeUndefined()
  })

  it('puts the 3rd and 4th endings over the bars chosen', () => {
    expect(marks(markBars(four, { from: 2, to: 3 }, 'ending3')).map(([, , e]) => e)).toEqual([
      undefined,
      undefined,
      3,
      3,
    ])
    expect(marks(markBars(four, { from: 3, to: 3 }, 'ending4'))[3]?.[2]).toBe(4)
  })

  it('breaks the page before the first bar chosen, a new line starting there', () => {
    const paged = markBars(four, { from: 2, to: 3 }, 'pageBreak')
    expect(barsOf(paged)[2]?.bar.pageBreak).toBe(true)
    expect(paged.sections[0]?.lines.map((line) => line.length)).toEqual([2, 2])
    expect(
      barsOf(markBars(paged, { from: 2, to: 2 }, 'pageBreak'))[2]?.bar.pageBreak,
    ).toBeUndefined()
  })

  it('takes a mark off a bar that has it, and every mark with Plain', () => {
    const doubled = markBars(four, { from: 0, to: 0 }, 'double')
    expect(markBars(doubled, { from: 0, to: 0 }, 'double')).toEqual(four)
    const ending = markBars(four, { from: 1, to: 2 }, 'ending1')
    expect(marks(ending).map(([, , end]) => end)).toEqual([undefined, 1, 1, undefined])
    expect(markBars(ending, { from: 1, to: 2 }, 'plain')).toEqual(four)
  })

  it('puts the signs at the first bar chosen, and Fine, To Coda and a jump at the last', () => {
    const signed = [
      ['segno', { from: 0, to: 1 }],
      ['coda', { from: 3, to: 3 }],
      ['toCoda', { from: 0, to: 1 }],
      ['ds-coda', { from: 2, to: 2 }],
    ] as const
    const marked = signed.reduce((draft, [choice, range]) => markBars(draft, range, choice), four)
    expect(barsOf(marked).map(({ bar }) => [bar.segno, bar.coda, bar.toCoda, bar.jump])).toEqual([
      [true, undefined, undefined, undefined],
      [undefined, undefined, true, undefined],
      [undefined, undefined, undefined, 'ds-coda'],
      [undefined, true, undefined, undefined],
    ])
    expect(markBars(markBars(four, { from: 2, to: 2 }, 'dc'), { from: 2, to: 2 }, 'dc')).toEqual(
      four,
    )
    expect(markBars(marked, { from: 0, to: 3 }, 'plain')).toEqual(four)
  })
})
