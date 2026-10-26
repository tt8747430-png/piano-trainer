import { copyBars, deleteBars, pasteBars } from './bars'
import { selectionSpan, startOf } from './caret-moves'
import { chosenSpan, takenAway } from './chosen'
import { clipFits, copyNotes, pasteNotes, type NotesClip } from './clip'
import type { NoteLayer } from './draft'
import { barsChosen, chosenBars } from './form-edits'
import { commit } from './history'
import { deleteNotes, notesAt } from './notes'
import type { ClipEdit, EditorState } from './state'

/**
 * What Copy takes on a staff, timed from where it stands: the notes chosen, the chord's one note
 * chosen, or the chord at the caret alone (never a note starting under it, another voice of the
 * hand, as Delete takes it); null where there is nothing to take.
 */
function copied(state: EditorState, layer: NoteLayer): NotesClip | null {
  const { draft, caret } = state
  if (state.selection) {
    const clip = copyNotes(draft, layer, selectionSpan(state.selection))
    return clip.notes.length > 0 ? clip : null
  }
  const chord = notesAt(draft, layer, caret)
  const one = chord.filter((n) => n.midi === state.chordNote)
  const taken = one.length > 0 ? one : chord
  if (taken.length === 0) return null
  return {
    kind: 'notes',
    layer,
    notes: taken.map((n) => ({ ...n, startTick: 0 })),
    ticks: Math.max(...taken.map((n) => n.durationTicks)),
  }
}

/** What Copy would take (ADR 0092): the bars chosen (as printed, from 1), the notes chosen, or nothing. */
export function copyTarget(
  state: EditorState,
):
  | { readonly kind: 'bars'; readonly from: number; readonly to: number }
  | { readonly kind: 'notes'; readonly count: number }
  | null {
  if (state.layer === 'chords') {
    const { from, to } = chosenBars(state)
    return { kind: 'bars', from: from + 1, to: to + 1 }
  }
  const taken = copied(state, state.layer)
  return taken && { kind: 'notes', count: taken.notes.length }
}

/**
 * Why Paste is greyed: nothing copied yet, or the clip goes elsewhere (its notes on a staff, its
 * bars in the chord row); null where it pastes here.
 */
export function whyNoPaste(state: EditorState): 'empty' | 'toStaff' | 'toChords' | null {
  if (!state.clip) return 'empty'
  if (clipFits(state.clip, state.layer)) return null
  return state.clip.kind === 'notes' ? 'toStaff' : 'toChords'
}

/** The clipboard's edits in the chord row: the bars chosen, else the caret's. */
function barsClipped(state: EditorState, edit: ClipEdit): EditorState {
  const { draft } = state
  const range = chosenBars(state)
  switch (edit) {
    case 'copy':
      return { ...state, clip: copyBars(draft, range) }
    case 'cut': {
      const next = deleteBars(draft, range)
      return commit(state, next, {
        clip: copyBars(draft, range),
        caret: startOf(next, range.from),
        selection: null,
      })
    }
    case 'paste': {
      if (state.clip?.kind !== 'bars') return state
      const next = pasteBars(draft, range.to, state.clip)
      const first = range.to + 1
      return commit(state, next, {
        caret: startOf(next, first),
        selection: barsChosen(next, first, first + state.clip.bars.length - 1),
      })
    }
  }
}

/**
 * Copy, Cut and Paste act on what is chosen (ADR 0092, as Flat's and Dorico's): in the chord row the
 * bars chosen; on a staff the notes chosen, the chord's one note, or the chord at the caret. Cut
 * leaves their time as a rest, in Insert mode closing the gap; Paste writes the clip's notes from the
 * caret on its staff (over what is there, in Insert mode pushing it right), the caret after them and
 * the pasted notes chosen. A clip pastes only where it goes (`clipFits`).
 */
export function clipEdited(state: EditorState, edit: ClipEdit): EditorState {
  const { draft, layer, caret } = state
  if (layer === 'chords') return barsClipped(state, edit)
  if (edit === 'paste') {
    if (state.clip?.kind !== 'notes') return state
    const pasted = pasteNotes(draft, layer, caret, state.clip, state.mode === 'insert')
    const span = { from: caret, to: pasted.end }
    return commit(state, pasted.draft, {
      caret: pasted.end,
      selection: { anchor: span, head: span },
      chordNote: null,
      struck: null,
    })
  }
  const clip = copied(state, layer)
  if (!clip) return state
  if (edit === 'copy') return { ...state, clip }
  const from = state.selection ? selectionSpan(state.selection).from : caret
  // What Delete takes; the chord's one note taken leaves the chord, so no gap closes.
  const where = chosenSpan(state)
  const next =
    typeof where !== 'number' && 'key' in where
      ? deleteNotes(draft, layer, where)
      : takenAway(state, layer, where)
  return commit(state, next, { clip, caret: from, selection: null, chordNote: null, struck: null })
}
