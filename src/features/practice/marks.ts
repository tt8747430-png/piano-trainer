import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import {
  keyboardRange,
  midi,
  noteName,
  pitchClass,
  type KeyRange,
  type Midi,
  type PitchClass,
} from '@/shared/lib/music'
import { isAudible, type Audible } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import type { DiagramChord } from './chord-diagram'

/**
 * The Player's keyboard: the beat group's notes in the hands asked for (the ones heard, or in Wait
 * mode the ones practised), by hand, a staff's heard over the piano (ADR 0097) under them.
 */
export function practiceMarks(
  performance: Performance,
  beatGroup: number,
  options: {
    readonly hands: Audible
    readonly fingers: boolean
    readonly received?: readonly PitchClass[]
  },
): Map<Midi, KeyMark> {
  const marks = new Map<Midi, KeyMark>()
  const notes = (performance.beatGroups[beatGroup]?.notes ?? [])
    .map((index) => performance.notes[index])
    .filter((n): n is PerformanceNote => n !== undefined && isAudible(n, options.hands))
    // A staff's first, so a hand playing the same key wins it.
    .sort((a, b) => Number(b.hand === 'staff') - Number(a.hand === 'staff'))
  for (const played of notes) {
    const label = options.received?.includes(pitchClass(played.midi))
      ? '✓'
      : noteName(played.spelled)
    marks.set(played.midi, {
      tone: played.hand,
      label,
      ...(options.fingers && played.finger ? { finger: played.finger } : {}),
    })
  }
  return marks
}

/**
 * The Player's keyboard in a chord view while Listen plays (ADR 0101): the chord sounding as its
 * diagram draws it, each key named as the chord spells it; the bass it rings, which the chord has
 * not, the left hand's, the rest the right's.
 */
export function diagramMarks(chord: DiagramChord): Map<Midi, KeyMark> {
  return new Map(
    chord.keys.flatMap((key, i) => {
      const spelled = chord.notes[i]
      if (!spelled) return []
      const mark: KeyMark = { tone: key === chord.ring ? 'lh' : 'rh', label: noteName(spelled) }
      return [[key, mark] as const]
    }),
  )
}

/** Two octaves around middle C: the least the Player shows. */
const AT_LEAST: KeyRange = { from: midi(48), to: midi(71) }

/** Every note of the piece on the keyboard, from a C to a B. */
export const playerRange = (performance: Performance): KeyRange =>
  keyboardRange(
    performance.notes.map((n) => n.midi),
    AT_LEAST,
  )
