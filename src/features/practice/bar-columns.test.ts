import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { arrangePiece, ownChoice } from './arrange-piece'
import { barColumns, beatInBar, beatLabel } from './bar-columns'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'M1' })

describe('beatLabel', () => {
  it('counts beats and names their subdivisions', () => {
    expect([0, 3, 6, 9, 12, 16, 20].map(beatLabel)).toEqual([
      '1',
      '1e',
      '1&',
      '1a',
      '2',
      '2⅓',
      '2⅔',
    ])
  })
})

describe('beatInBar', () => {
  it('finds the beat a beat group falls on, from 0, and how many beats its bar has', () => {
    const second = performance.beatGroups.findIndex((group) => group.tick === 12)
    expect(beatInBar(performance, 0)).toEqual({ beat: 0, beats: 4 })
    expect(beatInBar(performance, second)).toEqual({ beat: 1, beats: 4 })
  })

  it('has no beat for a beat group the performance does not have', () => {
    expect(beatInBar(performance, 9999)).toBeNull()
  })
})

describe('barColumns', () => {
  it('lists each beat group of a bar with its notes, high to low, by hand', () => {
    const columns = barColumns(performance, 0)
    expect(columns[0]?.beat).toBe('1')
    expect(columns.every((column) => performance.beatGroups[column.beatGroup]?.bar === 0)).toBe(
      true,
    )
    const rh = columns[0]?.notes.rh.map((n) => n.label) ?? []
    expect(rh.length).toBeGreaterThan(0)
    expect(rh.every((label) => /^[A-G](#|♭)?\d$/.test(label))).toBe(true)
  })

  it('is empty for a bar the piece does not have', () => {
    expect(barColumns(performance, 999)).toEqual([])
  })
})
