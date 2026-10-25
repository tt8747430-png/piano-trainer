import type { Tick } from '@/shared/lib/music'
import { itemAt } from './caret'
import { selectionSpan } from './caret-moves'
import type { Draft, DraftNote, NoteLayer } from './draft'
import { isHandLayer } from './draft'
import { closeGap, deleteNotes, fingeredNotes, isAt, notesOf, type Where } from './notes'
import type { EditorState, TickSpan } from './state'
import { valueOf, type ChosenValue } from './values'

/**
 * What an edit of notes takes (ADR 0088): the notes chosen, from the first's start to the last's end;
 * else the chord's one note chosen; else the notes at the caret.
 */
export function chosenSpan(state: EditorState): Where {
  if (state.selection) return selectionSpan(state.selection)
  if (state.chordNote !== null) return { at: state.caret, key: state.chordNote }
  return state.caret
}

/**
 * The notes the palette acts on (spec 2026-10-23): those chosen, the chord's one note, or the notes at
 * the caret; none where the caret is only an insertion point, or in the chord names' row.
 */
export const chosenNotes = (state: EditorState): DraftNote[] =>
  state.layer === 'chords' ? [] : notesOf(state.draft, state.layer).filter(isAt(chosenSpan(state)))

/** Where the fingering field writes (ADR 0096): the chord's one note chosen, else the notes at the caret. */
export const fingerPlace = ({
  caret,
  chordNote,
}: Pick<EditorState, 'caret' | 'chordNote'>): Where =>
  chordNote === null ? caret : { at: caret, key: chordNote }

/**
 * The notes the fingering field writes at the caret (ADR 0096): a hand's, a chord's bottom up, or its
 * one note chosen; none in the tune or the chord symbols.
 */
export const fingeredAt = (
  state: Pick<EditorState, 'draft' | 'layer' | 'caret' | 'chordNote'>,
): DraftNote[] =>
  isHandLayer(state.layer) ? fingeredNotes(state.draft, state.layer, fingerPlace(state)) : []

/**
 * What Delete or Cut takes away (ADR 0092): in Replace mode the notes at a tick or in a span, their
 * time left as a rest; in Insert mode what stands there (the notes, or the empty place), the later
 * notes pulled left to close the gap.
 */
export function takenAway(state: EditorState, layer: NoteLayer, where: Tick | TickSpan): Draft {
  const { draft } = state
  if (state.mode !== 'insert') return deleteNotes(draft, layer, where)
  return closeGap(draft, layer, typeof where === 'number' ? itemAt(draft, layer, where) : where)
}

/**
 * The value the palette shows pressed: the first chosen note's (none for a length no one value
 * writes, a note tied over), else the value chosen for the next note.
 */
export function shownValue(state: EditorState): ChosenValue | null {
  const [first] = chosenNotes(state)
  return first ? valueOf(first.durationTicks, state.draft.meter) : state.value
}
