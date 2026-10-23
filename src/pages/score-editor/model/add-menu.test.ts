import { describe, expect, it } from 'vitest'
import { BARLINE_CHOICES, JUMP_CHOICES, LINES } from '@/features/score-editor'
import { notate } from '@/shared/lib/notation'
import {
  ADD_TABS,
  clefBar,
  emptyBar,
  isJumpSign,
  isJumpWords,
  LINE_TILES,
  lineMusic,
} from './add-menu'

describe('the Insert menu', () => {
  it('holds only what goes at the caret: no key, time signature or staff of the song', () => {
    expect(ADD_TABS).toEqual(['bars', 'repeats', 'lines', 'expression', 'fingering', 'clef'])
  })

  it('has one tile for each line, drawn in one go', () => {
    expect(LINE_TILES.map((tile) => tile.line)).toEqual([...LINES])
  })

  it('engraves each tile’s music in C, whatever the song’s key: no signature to crowd it', () => {
    const bar = notate(emptyBar('3/4', 3))
    expect(bar.measures).toHaveLength(1)
    expect(bar.key.tonic).toMatchObject({ letter: 'C', accidental: 0 })
    expect(notate(clefBar('lh', 'treble')).key.tonic).toMatchObject({ letter: 'C' })
    for (const tile of LINE_TILES) {
      const music = lineMusic(tile)
      expect(music.notes).toHaveLength(4)
      expect(notate(music).measures).toHaveLength(1)
    }
  })

  it('shows every sign and jump as the score prints it, every barline engraved', () => {
    for (const choice of JUMP_CHOICES) expect(isJumpWords(choice) || isJumpSign(choice)).toBe(true)
    for (const choice of BARLINE_CHOICES)
      expect(isJumpWords(choice) || isJumpSign(choice)).toBe(false)
  })
})
