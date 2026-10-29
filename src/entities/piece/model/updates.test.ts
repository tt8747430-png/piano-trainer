import { afterEach, describe, expect, it } from 'vitest'
import { keepContent } from '@/shared/api/content'
import { readsAsMadeSong } from './content-record'
import { entryById, pieceById, piecesPlaying, songCollections } from './selectors'

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

describe('a song an editor made (content as data)', () => {
  const made = {
    id: 'made-song',
    kind: 'song',
    title: 'A made song',
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['C C F G'] }],
    collection: 'hymns',
  }

  it('is in the catalog and at its collection’s end once published', () => {
    kept(made, 'made-song')
    expect(pieceById('made-song')).toMatchObject({ id: 'made-song', title: 'A made song' })
    const hymns = songCollections().find((collection) => collection.id === 'hymns')
    expect(hymns?.entries.at(-1)?.id).toBe('made-song')
  })

  it('reads as a made song only with a song collection and music that reads', () => {
    expect(readsAsMadeSong('made-song', made)).toBe(true)
    for (const body of [
      { ...made, collection: 'studies' },
      { ...made, collection: undefined },
      { ...made, key: 'H' },
      { ...made, sections: 'none' },
      { ...made, id: 'other' },
    ])
      expect(readsAsMadeSong('made-song', body)).toBe(false)
  })

  it('is not there without reading as one', () => {
    kept({ ...made, collection: 'nowhere' }, 'made-song')
    expect(entryById('made-song')).toBeUndefined()
    expect(
      songCollections().flatMap((collection) => collection.entries.map(({ id }) => id)),
    ).not.toContain('made-song')
  })
})
