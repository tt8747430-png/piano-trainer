import { describe, expect, it } from 'vitest'
import { testSong } from '../testing/test-pieces'
import { musicOf } from './music'
import { originalMusic, originalWith, pieceRecordBody } from './content-record'

const SONG = testSong(['C F G C'], {
  titleEn: 'Test',
  recording: { src: '/recordings/test.mp3', beats: [0, 1] } as never,
})

describe('a piece as the database holds it', () => {
  it('keeps its recording’s timing without the app’s own file', () => {
    expect(pieceRecordBody(SONG)).toMatchObject({ recording: { beats: [0, 1] } })
    expect(JSON.stringify(pieceRecordBody(SONG))).not.toContain('/recordings/')
  })
})

describe('the original with music written in', () => {
  it('keeps the piece’s own fields and takes every field of the music, none left from before', () => {
    const music = {
      ...musicOf(SONG),
      tempo: 90,
      sections: [{ kind: 'verse' as const, lines: ['Am'] }],
    }
    const withStaves = testSong(['C'], { staves: [{ name: 'Tune', bars: ['c'] }] as never })
    const written = originalWith(withStaves, music)
    expect(written).toMatchObject({ id: 'bz0', title: 'Test', tempo: 90 })
    expect(written).not.toHaveProperty('staves')
  })

  it('never takes a learner’s own title in place of the catalog’s', () => {
    expect(originalWith(SONG, { ...musicOf(SONG), title: 'Mine' }).title).toBe('Test')
  })
})

describe('a draft read back', () => {
  it('reads as the piece’s music where it is a copy of it whose music reads', () => {
    const body = { ...SONG, tempo: 100 }
    expect(originalMusic(SONG, body)).toMatchObject({ tempo: 100 })
  })

  it('reads as nothing where it is another piece’s, or its music does not read', () => {
    expect(originalMusic(SONG, { ...SONG, id: 'other' })).toBeUndefined()
    expect(
      originalMusic(SONG, { ...SONG, sections: [{ kind: 'verse', lines: ['Q#'] }] }),
    ).toBeUndefined()
    expect(originalMusic(SONG, null)).toBeUndefined()
  })
})
