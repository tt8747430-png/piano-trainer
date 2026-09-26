import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import {
  keyboardRange,
  midi,
  pitchClass,
  type KeyRange,
  type Midi,
  type PitchClass,
} from '@/shared/lib/music'
import type { Audible } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import { spellPerformedNote } from './note-names'

/**
 * The Player's keyboard: the beat group's notes in the hands asked for (the ones heard, or in Wait
 * mode the ones practised), by hand, the tune under them.
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
    .filter((n): n is PerformanceNote => n !== undefined && options.hands[n.hand])
    // The tune first, so a hand playing the same key wins it.
    .sort((a, b) => Number(b.hand === 'melody') - Number(a.hand === 'melody'))
  for (const played of notes) {
    const label = options.received?.includes(pitchClass(played.midi))
      ? '✓'
      : spellPerformedNote(performance, played).name
    marks.set(played.midi, {
      tone: played.hand,
      label,
      ...(options.fingers && played.finger ? { finger: played.finger } : {}),
    })
  }
  return marks
}

/** Two octaves around middle C: the least the Player shows. */
const AT_LEAST: KeyRange = { from: midi(48), to: midi(71) }

/** Every note of the piece on the keyboard, from a C to a B. */
export const playerRange = (performance: Performance): KeyRange =>
  keyboardRange(
    performance.notes.map((n) => n.midi),
    AT_LEAST,
  )
