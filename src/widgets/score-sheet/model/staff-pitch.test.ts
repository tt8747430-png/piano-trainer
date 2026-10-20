import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { noteAtStaffY, stepsDragged } from './staff-pitch'

const lines = { top: 40, bottom: 80 }
const G_MAJOR = { tonic: note('G'), minor: false }

describe('noteAtStaffY', () => {
  it('names the line or space nearest a point, in the key', () => {
    expect(noteAtStaffY('treble', 40, lines, G_MAJOR)).toMatchObject({ midi: 78 })
    expect(noteAtStaffY('treble', 80, lines, G_MAJOR)).toMatchObject({ midi: 64 })
    expect(noteAtStaffY('treble', 91, lines, G_MAJOR)).toMatchObject({ midi: 60 })
    expect(noteAtStaffY('bass', 40, lines, G_MAJOR)).toMatchObject({ midi: 57 })
    expect(noteAtStaffY('melody', 60, lines, { tonic: note('F'), minor: false })).toMatchObject({
      midi: 71 - 1,
      spelled: note('B', -1),
    })
  })
})

describe('stepsDragged', () => {
  it('counts a staff’s steps, up positive', () => {
    expect([-10, -4, 0, 6, 11].map((dy) => stepsDragged(dy, lines))).toEqual([2, 1, 0, -1, -2])
  })
})
