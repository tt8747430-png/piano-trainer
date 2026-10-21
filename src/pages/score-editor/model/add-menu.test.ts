import { describe, expect, it } from 'vitest'
import { keyParam, keySignature, note } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { emptyBar, keyTiles, LINE_TILES, lineMusic, timeTiles } from './add-menu'

describe('the + menu', () => {
  it('lists the fifteen keys of each mode, C or A first, then sharps, then flats, fewest first', () => {
    const majors = keyTiles(false)
    expect(majors.map(keyParam)).toEqual([
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'C#',
      'F',
      'Bb',
      'Eb',
      'Ab',
      'Db',
      'Gb',
      'Cb',
    ])
    const minors = keyTiles(true)
    expect(minors).toHaveLength(15)
    expect(minors.map(keySignature)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4, -5, -6, -7])
  })

  it('offers the meters of the song’s kind, and the lengths the caret’s bar may take', () => {
    expect(timeTiles('4/4').meters).toEqual(['2/4', '3/4', '4/4'])
    expect(timeTiles('6/8').meters).toEqual(['6/8', '12/8'])
    expect(timeTiles('3/4').lengths).toHaveLength(6)
  })

  it('engraves each tile’s music: an empty bar, or two notes with the line between them', () => {
    expect(notate(emptyBar({ tonic: note('A'), minor: false }, '3/4', 3)).measures).toHaveLength(1)
    for (const tile of LINE_TILES) {
      const music = lineMusic(tile)
      expect(music.notes).toHaveLength(4)
      expect(notate(music).measures).toHaveLength(1)
    }
  })
})
