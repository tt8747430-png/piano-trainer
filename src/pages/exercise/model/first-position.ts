import type { Performance } from '@/shared/lib/arrangement'
import type { Hand } from '@/shared/lib/music'
import type { FingeredKey } from '@/shared/ui'

/**
 * The fingering's picture: the first hand position the hand plays, each key with its finger, until
 * a finger comes back on another key (the hand has moved on). None where the music writes no fingers.
 */
export function firstPosition(performance: Performance, hand: Hand): FingeredKey[] {
  const placed: FingeredKey[] = []
  for (const note of performance.notes) {
    if (note.hand !== hand || note.finger === undefined) continue
    const same = placed.find((each) => each.finger === note.finger)
    if (same) {
      if (same.key !== note.midi) break
      continue
    }
    if (placed.some((each) => each.key === note.midi)) continue
    placed.push({ key: note.midi, finger: note.finger })
  }
  return placed.length >= 2 ? placed.sort((a, b) => a.key - b.key) : []
}
