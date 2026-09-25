import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { pitchClass } from '@/shared/lib/music'
import { arrangePiece, ownChoice } from './arrange-piece'
import { playerRange, practiceMarks } from './marks'
import { spellPerformedNote } from './note-names'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'M1' })

describe('practiceMarks', () => {
  it('marks the beat group’s notes by hand, labelled with note names', () => {
    const marks = practiceMarks(performance, 0, { fingers: false })
    const group = performance.beatGroups[0]
    expect(marks.size).toBeGreaterThan(0)
    for (const index of group?.notes ?? []) {
      const played = performance.notes[index]
      if (!played || played.hand === 'melody') continue
      const mark = marks.get(played.midi)
      expect(mark?.tone).toBe(played.hand)
      expect(mark?.label).toBe(spellPerformedNote(performance, played).name)
    }
  })

  it('labels a note already played in Your turn with a tick', () => {
    const group = performance.beatGroups[0]
    const first = performance.notes[group?.notes[0] ?? -1]
    if (!first) throw new Error('empty group')
    const marks = practiceMarks(performance, 0, {
      fingers: false,
      received: [pitchClass(first.midi)],
    })
    expect(marks.get(first.midi)?.label).toBe('✓')
  })
})

describe('playerRange', () => {
  it('holds every note of the piece between a C and a B', () => {
    const { from, to } = playerRange(performance)
    const keys = performance.notes.map((n) => n.midi)
    expect(from % 12).toBe(0)
    expect(to % 12).toBe(11)
    expect(Math.min(...keys)).toBeGreaterThanOrEqual(from)
    expect(Math.max(...keys)).toBeLessThanOrEqual(to)
  })
})
