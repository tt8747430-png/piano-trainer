import { describe, expect, it } from 'vitest'
import type { Clef } from '@/shared/lib/music'
import { withClef } from './clef'

describe('withClef (R29 B7)', () => {
  const music = { notes: [1, 2], staves: [{ clef: 'treble' as const }, { clef: 'bass' as const }] }

  it('writes one single staff in the clef chosen, the others as they are', () => {
    expect(withClef(music, 0, 'bass')).toEqual({
      notes: [1, 2],
      staves: [{ clef: 'bass' }, { clef: 'bass' }],
    })
  })

  it('leaves music alone where the staff is not there or is in that clef already', () => {
    expect(withClef(music, 1, 'bass')).toBe(music)
    expect(withClef(music, 4, 'bass')).toBe(music)
    const bare: { notes: number[]; staves?: { clef: Clef }[] } = { notes: [] }
    expect(withClef(bare, 0, 'treble')).toBe(bare)
  })
})
