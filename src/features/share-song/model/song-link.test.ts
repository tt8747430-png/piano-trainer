import { describe, expect, it } from 'vitest'
import type { SharedSong } from '@/entities/piece'
import { readSongLink, songLinkData } from './song-link'

const SONG: SharedSong = {
  title: 'Morning',
  music: {
    key: 'G',
    meter: '3/4',
    tempo: 84,
    pattern: 'r1',
    sections: [{ kind: 'verse', n: 1, lines: ['G C G D'] }],
    melody: 'G4/3 | B4/3 | D5/3 | D5/3',
  },
}

describe('a song’s link', () => {
  it('carries the song there and back, in text a URL keeps as it is', async () => {
    const data = await songLinkData(SONG)
    expect(data).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(await readSongLink(data)).toEqual(SONG)
  })

  it('reads no song from text that is cut short, changed, or not a song', async () => {
    const data = await songLinkData(SONG)
    expect(await readSongLink(data.slice(0, 10))).toBeNull()
    expect(await readSongLink('not-a-song')).toBeNull()
    expect(await readSongLink('')).toBeNull()
  })

  it('reads no song whose music would not be saved', async () => {
    const data = await songLinkData({ ...SONG, music: { ...SONG.music, tempo: 1000 } })
    expect(await readSongLink(data)).toBeNull()
  })
})
