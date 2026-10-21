import type { NoteHand } from '@/shared/lib/arrangement'
import type { NoteMarks, Tick } from '@/shared/lib/music'

/**
 * The notes played joined, each held to the next (by index into `notes`): those under a slur, from
 * the note it starts on to the one it ends on, and those from a legato mark on until leggiero, each in
 * its own hand, as a player phrases them (ADR 0068).
 */
export function joinedNotes(
  notes: readonly {
    readonly startTick: Tick
    readonly hand: NoteHand
    readonly marks?: NoteMarks
  }[],
): Set<number> {
  const joined = new Set<number>()
  const hands = new Map<NoteHand, number[]>()
  notes.forEach((note, index) => hands.set(note.hand, [...(hands.get(note.hand) ?? []), index]))
  for (const indexes of hands.values()) {
    // The hand's onsets in order, the notes struck together at each.
    const onsets = new Map<Tick, number[]>()
    for (const index of indexes) {
      const tick = notes[index]?.startTick ?? 0
      onsets.set(tick, [...(onsets.get(tick) ?? []), index])
    }
    let slur = false
    let legato = false
    for (const [, struck] of [...onsets].sort(([a], [b]) => a - b)) {
      const marks = struck.map((index) => notes[index]?.marks)
      if (marks.some((each) => each?.expression === 'legato')) legato = true
      if (marks.some((each) => each?.expression === 'leggiero')) legato = false
      const starts = marks.some((each) => each?.slurStart)
      if (starts) slur = true
      if (slur || legato) for (const index of struck) joined.add(index)
      // A slur ends on the notes its end is written on, they joined to it; one starting there goes on.
      if (!starts && marks.some((each) => each?.slurEnd)) slur = false
    }
  }
  return joined
}
