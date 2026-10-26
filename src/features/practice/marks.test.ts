import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { noteName, pitchClass } from '@/shared/lib/music'
import { audibleHands } from '@/shared/lib/schedule'
import { arrangePiece, ownChoice } from './arrange-piece'
import { diagramChord } from './chord-diagram'
import { TWO_BARS_UNDER_A_STAFF } from './testing/performances'
import { diagramMarks, playerRange, practiceMarks } from './marks'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'M1' }, BUILT_IN_PATTERNS)

const BOTH = audibleHands('both')

describe('practiceMarks', () => {
  it('marks only the hands asked for', () => {
    const group = performance.beatGroups[0]
    const played = (group?.notes ?? []).map((index) => performance.notes[index])
    const left = played.filter((n) => n?.hand === 'lh').map((n) => n?.midi)
    expect(left.length).toBeGreaterThan(0)
    const marks = practiceMarks(performance, 0, {
      hands: { rh: false, lh: true, staff: false },
      fingers: false,
    })
    expect([...marks.keys()].sort()).toEqual([...left].sort())
    expect([...marks.values()].every((mark) => mark.tone === 'lh')).toBe(true)
  })

  it('gives each mark its finger with Finger numbers, the label keeping the note’s name', () => {
    const fingered = practiceMarks(performance, 0, { hands: BOTH, fingers: true })
    const plain = practiceMarks(performance, 0, { hands: BOTH, fingers: false })
    const group = performance.beatGroups[0]
    for (const index of group?.notes ?? []) {
      const played = performance.notes[index]
      if (!played || played.hand === 'staff') continue
      const mark = fingered.get(played.midi)
      expect(mark?.label).toBe(noteName(played.spelled))
      expect(mark?.finger).toBe(played.finger)
      expect(plain.get(played.midi)?.finger).toBeUndefined()
    }
  })

  it('marks the beat group’s notes by hand, labelled with note names', () => {
    const marks = practiceMarks(performance, 0, { hands: BOTH, fingers: false })
    const group = performance.beatGroups[0]
    expect(marks.size).toBeGreaterThan(0)
    for (const index of group?.notes ?? []) {
      const played = performance.notes[index]
      if (!played || played.hand === 'staff') continue
      const mark = marks.get(played.midi)
      expect(mark?.tone).toBe(played.hand)
      expect(mark?.label).toBe(noteName(played.spelled))
    }
  })

  it('marks a single staff’s notes where it is heard, never the tune left unheard (ADR 0097)', () => {
    const tones = (played: typeof performance) =>
      played.beatGroups.flatMap((_, group) =>
        [...practiceMarks(played, group, { hands: BOTH, fingers: false }).values()].map(
          (mark) => mark.tone,
        ),
      )
    const heard = TWO_BARS_UNDER_A_STAFF
    const unheard = {
      ...heard,
      notes: heard.notes.map((n) => (n.hand === 'staff' ? { ...n, silent: true as const } : n)),
    }
    expect(tones(heard)).toContain('staff')
    expect(tones(unheard)).not.toContain('staff')
  })

  it('labels a note already played in Wait mode with a tick', () => {
    const group = performance.beatGroups[0]
    const first = performance.notes[group?.notes[0] ?? -1]
    if (!first) throw new Error('empty group')
    const marks = practiceMarks(performance, 0, {
      hands: BOTH,
      fingers: false,
      received: [pitchClass(first.midi)],
    })
    expect(marks.get(first.midi)?.label).toBe('✓')
  })
})

describe('diagramMarks', () => {
  /** bz5's chord of this symbol as its diagram draws it. */
  const drawn = (symbol: string) => {
    const chord = diagramChord(
      performance,
      performance.chords.findIndex((each) => each.symbol === symbol),
    )
    if (!chord) throw new Error(`bz5 has ${symbol}`)
    return chord
  }

  it('marks a chord’s keys as its diagram draws them, each named as the chord spells it', () => {
    // G/B: B3 D4 G4, its bass one of its tones.
    expect([...diagramMarks(drawn('G/B'))]).toEqual([
      [59, { tone: 'rh', label: 'B' }],
      [62, { tone: 'rh', label: 'D' }],
      [67, { tone: 'rh', label: 'G' }],
    ])
  })

  it('marks the bass it rings as the left hand’s', () => {
    // C/E folds G3 C4 E4, its bass E4 ringed.
    expect([...diagramMarks(drawn('C/E'))]).toEqual([
      [55, { tone: 'rh', label: 'G' }],
      [60, { tone: 'rh', label: 'C' }],
      [64, { tone: 'lh', label: 'E' }],
    ])
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
