import { describe, expect, it } from 'vitest'
import type { CellBar } from '@/features/practice'
import { pageOf, stripPages } from './strip-pages'

/** Bars of `beats` beats each, on the chart's lines as given. */
const bars = (...lines: number[][]): CellBar[] =>
  lines.flatMap((line, at) =>
    line.map((beats) => ({
      written: 0,
      played: 0,
      section: 0,
      line: at,
      cells: Array.from({ length: beats }, (_, beat) => ({ from: beat, beats: 1 })),
    })),
  ) as unknown as CellBar[]

describe('stripPages (R29: the strip turns by part)', () => {
  it('puts each line of the chart on a page of its own', () => {
    expect(stripPages(bars([4, 4, 4, 4], [4, 4]), Infinity)).toEqual([
      [0, 1, 2, 3],
      [4, 5],
    ])
  })

  it('splits a line wider than the room into pages of whole bars', () => {
    expect(stripPages(bars([4, 4, 4, 4]), 10)).toEqual([
      [0, 1],
      [2, 3],
    ])
  })

  it('gives a bar wider than the room a page alone', () => {
    expect(stripPages(bars([4, 12, 4]), 8)).toEqual([[0], [1], [2]])
  })
})

describe('pageOf', () => {
  it('finds the page a bar is on', () => {
    const pages = [
      [0, 1],
      [2, 3],
    ]
    expect(pageOf(pages, 0)).toBe(0)
    expect(pageOf(pages, 3)).toBe(1)
  })
})
