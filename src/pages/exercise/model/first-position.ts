import type { Performance } from '@/shared/lib/arrangement'
import { printedNote, type Hand, type Midi } from '@/shared/lib/music'
import type { KeyMark, ShownKeys } from '@/shared/ui'

/**
 * The first hand position the hand plays: each key until a finger comes back on another key (the
 * hand has moved on). Where the music writes no fingers, the keys of its first bar for that hand.
 */
function positionKeys(performance: Performance, hand: Hand): Midi[] {
  const placed: { key: Midi; finger: number }[] = []
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
  if (placed.length >= 2) return placed.map((each) => each.key)
  const end = performance.bars[1]?.startTick ?? performance.totalTicks
  return [
    ...new Set(
      performance.notes
        .filter((note) => note.hand === hand && note.startTick < end)
        .map((note) => note.midi),
    ),
  ]
}

/**
 * The keys an exercise's page lights over its title (canvas 185): its first position, each key named
 * as written, in the Scales page's tones: its tonic and the scale's other notes. No fingers on the keys.
 */
export function firstPosition(performance: Performance, hand: Hand, tonic: number): ShownKeys {
  const keys = positionKeys(performance, hand).sort((a, b) => a - b)
  const marks = new Map<Midi, KeyMark>()
  for (const key of keys) {
    const spelled = performance.notes.find((note) => note.midi === key)?.spelled
    marks.set(key, {
      tone: key % 12 === tonic ? 'tonic' : 'scale',
      ...(spelled ? { label: printedNote(spelled) } : {}),
    })
  }
  return { keys, marks }
}
