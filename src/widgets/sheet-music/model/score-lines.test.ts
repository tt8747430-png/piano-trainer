import { describe, expect, it } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { notate } from '@/shared/lib/notation'
import { scoreLines } from './score-lines'

describe('scoreLines', () => {
  it('cuts a score at the chart’s lines, each a score of its measures, the time before it said', () => {
    const score = notate(TWO_BARS)
    const split = {
      ...TWO_BARS,
      bars: TWO_BARS.bars.map((bar, index) => ({ ...bar, line: index })),
    }
    const lines = scoreLines(score, split)
    expect(lines.map((line) => [line.first, line.score.measures.length])).toEqual([
      [0, 1],
      [1, 1],
    ])
    expect(lines[0]?.timeBefore).toBeUndefined()
    expect(lines[1]?.timeBefore).toEqual(score.measures[0]?.time)
    expect(scoreLines(score, TWO_BARS)).toHaveLength(1)
  })

  it('tells each line what the next starts in, for its courtesy signature; the last none', () => {
    const score = notate(TWO_BARS)
    const split = {
      ...TWO_BARS,
      bars: TWO_BARS.bars.map((bar, index) => ({ ...bar, line: index })),
    }
    const lines = scoreLines(score, split)
    expect(lines[0]?.next).toBe(score.measures[1])
    expect(lines[1]?.next).toBeUndefined()
  })
})
