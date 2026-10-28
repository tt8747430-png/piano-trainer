import { describe, expect, it } from 'vitest'
import { draftOf, shape } from '../testing/test-draft'
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

  describe('bar repeats and multi-bar rests (Flat’s)', () => {
    const written = draftOf({
      sections: [{ kind: 'verse', lines: ['G C D G'] }],
      hands: { rh: 'B4/2 D5/2 | E5/4 | F#5/4 | G5/4', lh: 'G2/4 | C3/4 | D3/4 | G2/4' },
    })
    const symbols = (draft: ReturnType<typeof draftOf>) =>
      barsOf(draft).map(({ bar }) => bar.chords.map((chord) => chord.chord.root.letter).join(''))

    it('writes the bar before again into each bar chosen, marked a bar repeat; again takes the mark off', () => {
      const repeated = markBars(written, { from: 1, to: 2 }, 'barRepeat1')
      expect(barsOf(repeated).map(({ bar }) => bar.barRepeat)).toEqual([undefined, 1, 1, undefined])
      expect(shape(repeated.hands.rh)).toEqual([
        'B4@0/2',
        'D5@2/2',
        'B4@4/2',
        'D5@6/2',
        'B4@8/2',
        'D5@10/2',
        'G5@12/4',
      ])
      expect(shape(repeated.hands.lh)).toEqual(['G2@0/4', 'G2@4/4', 'G2@8/4', 'G2@12/4'])
      expect(symbols(repeated)).toEqual(['G', 'G', 'G', 'G'])
      const off = markBars(repeated, { from: 1, to: 2 }, 'barRepeat1')
      expect(barsOf(off).map(({ bar }) => bar.barRepeat)).toEqual([
        undefined,
        undefined,
        undefined,
        undefined,
      ])
      expect(off.hands).toEqual(repeated.hands)
      expect(markBars(written, { from: 0, to: 0 }, 'barRepeat1')).toBe(written)
    })

    it('writes the two bars before again into a pair, marked at its first', () => {
      const repeated = markBars(written, { from: 2, to: 2 }, 'barRepeat2')
      expect(barsOf(repeated).map(({ bar }) => bar.barRepeat)).toEqual([
        undefined,
        undefined,
        2,
        undefined,
      ])
      expect(shape(repeated.hands.lh)).toEqual(['G2@0/4', 'C3@4/4', 'G2@8/4', 'C3@12/4'])
      expect(markBars(written, { from: 1, to: 1 }, 'barRepeat2')).toBe(written)
      expect(markBars(written, { from: 3, to: 3 }, 'barRepeat2')).toBe(written)
    })

    it('rests the bars chosen, drawn as one, a lone bar with the next', () => {
      const rested = markBars(written, { from: 1, to: 2 }, 'multiRest')
      expect(barsOf(rested).map(({ bar }) => bar.multiRest)).toEqual([
        undefined,
        2,
        undefined,
        undefined,
      ])
      expect(shape(rested.hands.lh)).toEqual(['G2@0/4', 'G2@12/4'])
      expect(
        barsOf(markBars(written, { from: 3, to: 3 }, 'multiRest'))[3]?.bar.multiRest,
      ).toBeUndefined()
      expect(barsOf(markBars(written, { from: 2, to: 2 }, 'multiRest'))[2]?.bar.multiRest).toBe(2)
      const off = markBars(rested, { from: 1, to: 1 }, 'multiRest')
      expect(barsOf(off)[1]?.bar.multiRest).toBeUndefined()
    })
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
