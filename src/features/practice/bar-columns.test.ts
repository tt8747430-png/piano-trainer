import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { arrangePiece, ownChoice } from './arrange-piece'
import { barColumns, beatLabel } from './bar-columns'

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
