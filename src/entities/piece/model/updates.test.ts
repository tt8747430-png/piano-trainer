import { afterEach, describe, expect, it } from 'vitest'
import { keepContent } from '@/shared/api/content'
import { entryById, pieceById, piecesPlaying } from './selectors'

afterEach(() => keepContent([]))

const kept = (body: unknown, id = 'bz5') =>
  keepContent([{ kind: 'piece', id, version: 'v2', body }])

describe('the catalog over the kept content', () => {
  it('reads the database’s newer copy of a catalog piece in its place', () => {
    const original = pieceById('bz5')
    const newer = { ...original, title: 'Still, my soul, be still (revised)' }
    kept(newer)
    expect(entryById('bz5')).toEqual(newer)
  })

  it('passes over what does not read as its piece, and what the catalog has not got', () => {
    const original = pieceById('bz5')
    for (const body of [
      { ...original, key: 'H#' },
      { ...original, kind: 'study' },
      { id: 'bz5' },
      null,
    ]) {
      kept(body)
      expect(entryById('bz5')).toBe(original)
    }
    kept({ ...original, id: 'unknown' }, 'unknown')
    expect(entryById('unknown')).toBeUndefined()
  })

  it('reads the app’s own again once nothing is kept', () => {
    const original = pieceById('bz5')
    kept({ ...original, title: 'Other' })
    keepContent([])
    expect(entryById('bz5')).toBe(original)
  })

  it('reads the pieces a pattern plays from the copies in place', () => {
    const original = pieceById('bz5')
    if (!original) throw new Error('bz5 is in the catalog')
    kept({ ...original, title: 'Other' })
    expect(piecesPlaying(original.pattern).find((piece) => piece.id === 'bz5')?.title).toBe('Other')
  })

  it('plays a newer copy’s recording from the app’s own file', () => {
    const recorded = pieceById('romashki')
    if (!recorded || !('recording' in recorded) || !recorded.recording)
      throw new Error('romashki is recorded')
    const { src: _src, ...timing } = recorded.recording
    kept({ ...recorded, recording: { ...timing, start: 4 } }, 'romashki')
    expect(pieceById('romashki')).toMatchObject({
      recording: { src: recorded.recording.src, start: 4 },
    })
  })
})
