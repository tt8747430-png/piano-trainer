import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { choosableChordSize, entriesInKey, entryById, isOwnKey, pieceById } from './selectors'

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

describe('choosableChordSize', () => {
  it('is a progression’s own chord size where the learner may change it, else null', () => {
    expect(choosableChordSize(piece('twofive'))).toBe('sevenths')
    expect(choosableChordSize(piece('bz5'))).toBeNull()
  })
})

describe('isOwnKey', () => {
  it('holds for the piece’s tonic, however it is spelled', () => {
    expect(isOwnKey(piece('bz5'), note('G'))).toBe(true)
    expect(isOwnKey(piece('bz5'), note('A'))).toBe(false)
  })
})

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
