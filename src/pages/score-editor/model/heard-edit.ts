import { notesAt, type EditorAction, type EditorState } from '@/features/score-editor'
import type { Midi } from '@/shared/lib/music'

/** The edits that change a note's pitch, heard as they are made (MuseScore's Play notes when editing). */
const PITCH_EDITS = new Set<EditorAction['type']>(['step', 'shift', 'accidental', 'chordNote'])

/**
 * The keys an edit sounds (round 28): a note chosen by a click on the score, a note or chord whose
 * pitch was moved, a chord's one note stepped to; none for what sounds itself (a key played) or
 * changes no pitch. A chord's one note chosen sounds alone, else every note at the caret on its staff.
 */
export function heardEdit(
  action: EditorAction,
  before: EditorState,
  after: EditorState,
): readonly Midi[] {
  const placed = action.type === 'place' && !action.extend
  if (!placed && !PITCH_EDITS.has(action.type)) return []
  if (after.draft === before.draft && !placed && action.type !== 'chordNote') return []
  if (after.layer === 'chords' || after.grace) return []
  if (after.chordNote !== null) return [after.chordNote]
  return notesAt(after.draft, after.layer, after.caret).map((n) => n.midi)
}
