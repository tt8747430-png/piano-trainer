import { describe, expect, it } from 'vitest'
import { chordDragId, dropMove, readDragId, sectionDragId } from './sheet-dnd'

describe('the Chord player’s one drag (R32)', () => {
  it('reads its ids back, and nothing else', () => {
    expect(readDragId(sectionDragId(2))).toEqual({ kind: 'section', section: 2 })
    expect(readDragId(chordDragId(1, 4))).toEqual({ kind: 'chord', section: 1, index: 4 })
    expect(readDragId('box-1-4')).toBeNull()
    expect(readDragId(7)).toBeNull()
  })

  it('moves a chord within its section, and a section among the sections', () => {
    expect(dropMove(chordDragId(0, 0), chordDragId(0, 2))).toEqual({
      kind: 'chord',
      section: 0,
      from: 0,
      to: 2,
    })
    expect(dropMove(sectionDragId(2), sectionDragId(0))).toEqual({
      kind: 'section',
      from: 2,
      to: 0,
    })
  })

  it('lands nothing across kinds or sections, or on itself', () => {
    expect(dropMove(chordDragId(0, 1), chordDragId(1, 1))).toBeNull()
    expect(dropMove(chordDragId(0, 1), sectionDragId(0))).toBeNull()
    expect(dropMove(sectionDragId(1), chordDragId(1, 0))).toBeNull()
    expect(dropMove(chordDragId(0, 1), chordDragId(0, 1))).toBeNull()
    expect(dropMove(sectionDragId(1), null)).toBeNull()
  })
})
