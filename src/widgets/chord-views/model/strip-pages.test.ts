import { describe, expect, it } from 'vitest'
import type { CellBar } from '@/features/practice'
import { pageOf, stripPages } from './strip-pages'

/** Bars of `beats` beats each, on the chart's lines as given. */
const bars = (...lines: number[][]): CellBar[] =>
  lines
    .flatMap((line, at) => line.map((beats) => ({ beats, at })))
    .map(({ beats, at }, written) => ({
      written,
      played: 0,
      section: 0,
      line: at,
      cells: Array.from({ length: beats }, (_, beat) => ({ from: beat, beats: 1 })),
    })) as unknown as CellBar[]

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

/** Bars as played: each its written bar, its section and its line in it, four beats. */
const played = (...bars: [written: number, section: number, line: number][]): CellBar[] =>
  bars.map(([written, section, line]) => ({
    written,
    played: 0,
    section,
    line,
    cells: Array.from({ length: 4 }, (_, beat) => ({ from: beat, beats: 1 })),
  })) as unknown as CellBar[]

describe('stripPages by part (R29 review)', () => {
  it('turns where a section of one line ends and the next begins', () => {
    expect(stripPages(played([0, 0, 0], [1, 0, 0], [2, 1, 0], [3, 1, 0]), Infinity)).toEqual([
      [0, 1],
      [2, 3],
    ])
  })

  it('turns where a repeated line starts again', () => {
    expect(stripPages(played([0, 0, 0], [1, 0, 0], [0, 0, 0], [1, 0, 0]), Infinity)).toEqual([
      [0, 1],
      [2, 3],
    ])
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
