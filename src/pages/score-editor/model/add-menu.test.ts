import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { ADD_TABS, emptyBar, LINE_TILES, lineMusic } from './add-menu'

describe('the Insert menu', () => {
  it('holds only what goes at the caret: no key, time signature or staff of the song', () => {
    expect(ADD_TABS).toEqual(['bars', 'repeats', 'lines', 'text', 'fingers', 'clefs'])
  })

  it('engraves each tile’s music: an empty bar, or four notes with the line over them', () => {
    expect(notate(emptyBar({ tonic: note('A'), minor: false }, '3/4', 3)).measures).toHaveLength(1)
    for (const tile of LINE_TILES) {
      const music = lineMusic(tile)
      expect(music.notes).toHaveLength(4)
      expect(notate(music).measures).toHaveLength(1)
    }
  })
})
