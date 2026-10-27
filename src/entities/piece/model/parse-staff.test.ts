import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { ContentError } from './content-error'
import { parseStaff } from './parse-staff'
import { testSong } from '../testing/test-pieces'

const staffOf = (notes: string) => parseStaff(testSong(['C'], { staves: [{ notes }] }), 0)

describe('parseStaff', () => {
  it('reads notes as written and rests, in beats, ignoring bar lines', () => {
    expect(staffOf('E4/1 D4/.5 r/1 | C#5/1.5')).toEqual([
      { midi: 64, spelled: note('E'), startTick: 0, durationTicks: 24 },
      { midi: 62, spelled: note('D'), startTick: 24, durationTicks: 12 },
      { midi: 73, spelled: note('C', 1), startTick: 60, durationTicks: 36 },
    ])
  })

  it('reads flats written either way', () => {
    expect(staffOf('Bb3/1 B♭3/1').map((n) => n.midi)).toEqual([58, 58])
  })

  it('reads the staff at its place, top down, and nothing of a staff the piece has not', () => {
    const piece = testSong(['C'], { staves: [{ notes: 'E4/1' }, { notes: 'C3/4', clef: 'bass' }] })
    expect(parseStaff(piece, 1).map((n) => n.midi)).toEqual([48])
    expect(parseStaff(piece, 2)).toEqual([])
    expect(parseStaff(testSong(['C']), 0)).toEqual([])
  })

  it.each(['X4/1', 'E4', 'E4/0', 'E4/0.3', 'E/1', 'E4/25', 'E4/1e8', 'C9/1', 'B#8/1', 'Ab0/1'])(
    'names the staff and the note it cannot read: %j',
    (token) => {
      let caught: unknown
      try {
        parseStaff(testSong(['C'], { staves: [{ notes: 'C4/4' }, { notes: `C4/1 ${token}` }] }), 1)
      } catch (error) {
        caught = error
      }
      expect(caught).toBeInstanceOf(ContentError)
      expect((caught as ContentError).position).toEqual({ staff: 2, note: 2 })
      expect((caught as ContentError).message).toContain(token)
    },
  )
})
