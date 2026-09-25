import { describe, expect, it } from 'vitest'
import { entryById, pieceById } from './selectors'

describe('lookups', () => {
  it('find a piece by id', () => {
    expect(pieceById('bz5')?.title).toBe('Мир, душа, храни')
  })

  it('find a listing only as an entry', () => {
    expect(pieceById('bz4')).toBeUndefined()
    expect(entryById('bz4')?.kind).toBe('listing')
  })

  it.each(['nope', 'constructor', ''])('find nothing for %j', (id) => {
    expect(entryById(id)).toBeUndefined()
    expect(pieceById(id)).toBeUndefined()
  })
})
