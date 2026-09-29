import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { readChord } from './read-chord'

describe('readChord', () => {
  it('reads a chord as typed, spaces around it ignored', () => {
    expect(readChord(' Am7 ')).toEqual({ root: note('A'), quality: 'm7' })
  })

  it('reads nothing it cannot', () => {
    expect(readChord('Qx')).toBeNull()
    expect(readChord('')).toBeNull()
  })
})
