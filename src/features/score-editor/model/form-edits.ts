import { TICKS_PER_BEAT, type Chord } from '@/shared/lib/music'
import {
  copyBars,
  deleteBars,
  insertBar,
  joinLine,
  newLine,
  pasteBars,
  type BarRange,
} from './bars'
import { nextCaret, snapToChord } from './caret'
import { startOf } from './caret-moves'
import { setChord } from './chords'
import { commit } from './history'
import { newSection } from './sections'
import type { BarEdit, ChordAdvance, EditorState, Selection } from './state'
import { barAt, barsOf } from './timeline'

/** The bars chosen, first to last. */
export const selectedBars = ({ anchor, head }: Selection): BarRange => ({
  from: Math.min(anchor, head),
  to: Math.max(anchor, head),
})

/** The bars an edit of the form acts on: those chosen, else the caret's. */
function chosenBars(state: EditorState): BarRange {
  if (state.selection) return selectedBars(state.selection)
  const { index } = barAt(state.draft, state.caret)
  return { from: index, to: index }
}

/** A chord set at the caret's place in the chords, the caret moving on as `advance` says. */
export function chordSet(state: EditorState, chord: Chord, advance: ChordAdvance): EditorState {
  const caret = snapToChord(state.draft, state.caret)
  const bar = barAt(state.draft, caret)
  const set = setChord(state.draft, bar.index, caret - bar.start, chord)
  if (advance === 'beat') {
    return commit(state, set, {
      caret: nextCaret(set, 'chords', caret, TICKS_PER_BEAT, 1),
      struck: null,
    })
  }
  const last = bar.index === barsOf(set).length - 1
  const grown = last && advance === 'barAdding' ? insertBar(set, bar.index) : set
  return commit(state, grown, { caret: startOf(grown, bar.index + 1), struck: null })
}

/** An edit of the form on the bars chosen, else the caret's. */
export function barsEdited(state: EditorState, edit: BarEdit): EditorState {
  const { draft } = state
  const range = chosenBars(state)
  switch (edit) {
    case 'insert': {
      const next = insertBar(draft, range.to)
      return commit(state, next, { caret: startOf(next, range.to + 1), selection: null })
    }
    case 'delete': {
      const next = deleteBars(draft, range)
      return commit(state, next, { caret: startOf(next, range.from), selection: null })
    }
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
      if (!state.clip) return state
      const next = pasteBars(draft, range.to, state.clip)
      const first = range.to + 1
      return commit(state, next, {
        caret: startOf(next, first),
        selection: { anchor: first, head: first + state.clip.bars.length - 1 },
      })
    }
    case 'newLine':
      return commit(state, newLine(draft, range.from), { selection: null })
    case 'joinLine':
      return commit(state, joinLine(draft, range.from), { selection: null })
    case 'newSection':
      return commit(state, newSection(draft, range.from), { selection: null })
  }
}
