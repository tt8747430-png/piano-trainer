import { describe, expect, it } from 'vitest'
import type { NoteMarks } from '@/shared/lib/music'
import { joinedNotes } from './legato'

const n = (startTick: number, marks?: NoteMarks, hand = 'rh') => ({
  startTick,
  hand,
  ...(marks ? { marks } : {}),
})

describe('joinedNotes', () => {
  it('joins the notes under a slur, from its start to its end, in the slur’s hand alone', () => {
    const notes = [
      n(0, { slurStart: true }),
      n(24),
      n(48, { slurEnd: true }),
      n(72),
      n(24, undefined, 'lh'),
    ]
    expect([...joinedNotes(notes)].sort()).toEqual([0, 1, 2])
  })

  it('joins from legato on, until leggiero', () => {
    const notes = [n(0), n(24, { expression: 'legato' }), n(48), n(72, { expression: 'leggiero' })]
    expect([...joinedNotes(notes)].sort()).toEqual([1, 2])
  })

  it('goes on joining where one slur ends and the next starts on the same note', () => {
    const notes = [n(0, { slurStart: true }), n(24, { slurEnd: true, slurStart: true }), n(48)]
    expect([...joinedNotes(notes)].sort()).toEqual([0, 1, 2])
  })
})
