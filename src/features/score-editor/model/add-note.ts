import { LETTERS, midiOf, note, topLineStep, type Midi, type Tick } from '@/shared/lib/music'
import { clefAt } from './clefs'
import type { Draft, NoteLayer } from './draft'
import { notesOf } from './notes'
import { barAt } from './timeline'

/**
 * The key Add note writes at `at` (R31-E, Flat's Add note): the pitch of the last note starting
 * there or before it, the highest of a chord, so a line goes on where it was; on a staff with none
 * before it, the note on the staff's middle line in its clef (B4 in the treble, D3 in the bass).
 * Its pitch is then moved with ↑ ↓ as any note's.
 */
export function addNoteKey(draft: Draft, layer: NoteLayer, at: Tick): Midi {
  const before = notesOf(draft, layer).filter((n) => n.startTick <= at)
  const last = before.reduce<(typeof before)[number] | undefined>(
    (best, n) =>
      !best ||
      n.startTick > best.startTick ||
      (n.startTick === best.startTick && n.midi > best.midi)
        ? n
        : best,
    undefined,
  )
  if (last) return last.midi
  const middle = topLineStep(clefAt(draft, barAt(draft, at).index, layer)) - 4
  return midiOf(note(LETTERS[middle % 7] ?? 'B', 0), Math.floor(middle / 7))
}
