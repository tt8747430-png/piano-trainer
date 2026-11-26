import { describe, expect, it } from 'vitest'
import { chordDragId, dropMove, endDragId, keyDragId, readDragId, sectionDragId } from './sheet-dnd'

describe('the Chord player’s one drag (R32)', () => {
  it('reads its ids back, and nothing else', () => {
    expect(readDragId(sectionDragId(2))).toEqual({ kind: 'section', section: 2 })
    expect(readDragId(chordDragId(1, 4))).toEqual({ kind: 'chord', section: 1, index: 4 })
    expect(readDragId(endDragId(3))).toEqual({ kind: 'end', section: 3 })
    expect(readDragId(keyDragId(5))).toEqual({ kind: 'key', index: 5 })
    expect(readDragId('box-1-4')).toBeNull()
    expect(readDragId(7)).toBeNull()
  })

  it('moves a chord within its section, and a section among the sections', () => {
    expect(dropMove(chordDragId(0, 0), chordDragId(0, 2))).toEqual({
      kind: 'chord',
      from: { section: 0, index: 0 },
      to: { section: 0, index: 2 },
    })
    expect(dropMove(sectionDragId(2), sectionDragId(0))).toEqual({
      kind: 'section',
      from: 2,
      to: 0,
    })
  })

  it('moves a chord into another section, before a chord or at its end, an empty one too', () => {
    expect(dropMove(chordDragId(0, 1), chordDragId(1, 1))).toEqual({
      kind: 'chord',
      from: { section: 0, index: 1 },
      to: { section: 1, index: 1 },
    })
    expect(dropMove(chordDragId(0, 1), endDragId(2))).toEqual({
      kind: 'chord',
      from: { section: 0, index: 1 },
      to: { section: 2, index: Number.MAX_SAFE_INTEGER },
    })
  })

  it('puts one of the key’s chords where it is dropped', () => {
    expect(dropMove(keyDragId(3), chordDragId(1, 0))).toEqual({
      kind: 'key',
      key: 3,
      to: { section: 1, index: 0 },
    })
  })

  it('lands nothing across kinds, or on itself', () => {
    expect(dropMove(chordDragId(0, 1), sectionDragId(0))).toBeNull()
    expect(dropMove(sectionDragId(1), chordDragId(1, 0))).toBeNull()
    expect(dropMove(keyDragId(1), sectionDragId(0))).toBeNull()
    expect(dropMove(chordDragId(0, 1), chordDragId(0, 1))).toBeNull()
    expect(dropMove(sectionDragId(1), sectionDragId(1))).toBeNull()
    expect(dropMove(sectionDragId(1), null)).toBeNull()
  })
})
