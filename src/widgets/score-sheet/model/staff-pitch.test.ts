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
    expect(noteAtStaffY('treble', 60, lines, { tonic: note('F'), minor: false })).toMatchObject({
      midi: 71 - 1,
      spelled: note('B', -1),
    })
  })

  it('reads every clef’s lines, an octave clef’s an octave from where it is written (ADR 0114)', () => {
    const C_MAJOR = { tonic: note('C'), minor: false }
    // The alto's middle line is middle C; the tenor's fourth.
    expect(noteAtStaffY('alto', 60, lines, C_MAJOR)).toMatchObject({ midi: 60 })
    expect(noteAtStaffY('tenor', 50, lines, C_MAJOR)).toMatchObject({ midi: 60 })
    // A treble 8vb's top line sounds F4, a bass 8va's A4.
    expect(noteAtStaffY('treble-8vb', 40, lines, C_MAJOR)).toMatchObject({ midi: 65 })
    expect(noteAtStaffY('bass-8va', 40, lines, C_MAJOR)).toMatchObject({ midi: 69 })
  })
})

describe('stepsDragged', () => {
  it('counts a staff’s steps, up positive', () => {
    expect([-10, -4, 0, 6, 11].map((dy) => stepsDragged(dy, lines))).toEqual([2, 1, 0, -1, -2])
  })
})
