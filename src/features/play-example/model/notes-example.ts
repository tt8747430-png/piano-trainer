import { noteName, type Midi } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { KeyMark, ShownKeys } from '@/shared/ui'

/** The keys a line of notes plays, each once, marked with its note's name as written. */
export function notesShown(line: TimedMusic): ShownKeys {
  const marks = new Map<Midi, KeyMark>()
  for (const n of line.notes) marks.set(n.midi, { tone: 'scale', label: noteName(n.spelled) })
  return { keys: [...marks.keys()].sort((a, b) => a - b), marks }
}
