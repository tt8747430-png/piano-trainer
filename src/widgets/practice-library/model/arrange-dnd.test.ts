import { describe, expect, it } from 'vitest'
import { arrangeDrop, placeDragId, readArrangeId, rowDragId } from './arrange-dnd'

const PLACES = ['technique', 'jonny', 'folder-1']
const ROWS: Record<string, string[]> = { technique: ['five-finger', 'hanon'], jonny: ['modes'] }
const rowsOf = (place: string) => ROWS[place] ?? []

describe('a library’s Edit drag (R32)', () => {
  it('reads its ids back, ids with colons in them too', () => {
    expect(readArrangeId(placeDragId('jonny'))).toEqual({ kind: 'place', place: 'jonny' })
    expect(readArrangeId(rowDragId('technique', 'pattern:a1'))).toEqual({
      kind: 'row',
      place: 'technique',
      id: 'pattern:a1',
    })
    expect(readArrangeId('box-1')).toBeNull()
  })

  it('moves a place among the places, a row within its place, where the other stood', () => {
    expect(arrangeDrop(placeDragId('folder-1'), placeDragId('technique'), PLACES, rowsOf)).toEqual({
      kind: 'places',
      order: ['folder-1', 'technique', 'jonny'],
    })
    expect(
      arrangeDrop(
        rowDragId('technique', 'hanon'),
        rowDragId('technique', 'five-finger'),
        PLACES,
        rowsOf,
      ),
    ).toEqual({ kind: 'rows', place: 'technique', order: ['hanon', 'five-finger'] })
  })

  it('lands nothing across places or kinds, or on itself', () => {
    expect(
      arrangeDrop(rowDragId('technique', 'hanon'), rowDragId('jonny', 'modes'), PLACES, rowsOf),
    ).toBeNull()
    expect(
      arrangeDrop(placeDragId('jonny'), rowDragId('jonny', 'modes'), PLACES, rowsOf),
    ).toBeNull()
    expect(arrangeDrop(placeDragId('jonny'), placeDragId('jonny'), PLACES, rowsOf)).toBeNull()
  })
})
