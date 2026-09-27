import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { entriesInKey, entryById, pieceById } from './selectors'

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

describe('entriesInKey', () => {
  it('lists the songs, listings and studies written in a key, however their tonic is spelled', () => {
    const inG = entriesInKey({ tonic: note('G'), minor: false }).map((entry) => entry.id)
    expect(inG).toContain('bz5')
    expect(
      entriesInKey({ tonic: note('G'), minor: false }).every((e) => e.kind !== 'progression'),
    ).toBe(true)
    expect(entriesInKey({ tonic: note('D', 1), minor: true }).map((entry) => entry.id)).toEqual([
      'bz7',
    ])
    expect(entriesInKey({ tonic: note('B'), minor: false })).toEqual([])
  })
})
