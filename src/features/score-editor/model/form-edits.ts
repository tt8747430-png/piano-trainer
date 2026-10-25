import type { Chord } from '@/shared/lib/music'
import { deleteBars, insertBar, insertBarBefore, joinLine, newLine, type BarRange } from './bars'
import { snapToChord } from './caret'
import { selectionSpan, startOf } from './caret-moves'
import type { Draft } from './draft'
import { setChord } from './chords'
import { commit } from './history'
import { newSection } from './sections'
import type { BarEdit, EditorState, Selection } from './state'
import { barAt, barsOf } from './timeline'

/** The bars the notes chosen are in, first to last: what an edit of the form acts on (ADR 0088). */
export function selectedBars(draft: Draft, selection: Selection): BarRange {
  const { from, to } = selectionSpan(selection)
  return { from: barAt(draft, from).index, to: barAt(draft, Math.max(from, to - 1)).index }
}

/** Bars `first` to `last` chosen whole: from the first's start to the last's end. */
export function barsChosen(draft: Draft, first: number, last: number): Selection {
  const bars = barsOf(draft)
  const start = bars[first]?.start ?? 0
  const end = bars[last] ? bars[last].start + bars[last].bar.ticks : start
  return { anchor: { from: start, to: end }, head: { from: start, to: end } }
}

/** The bars an edit of the form acts on: those chosen, else the caret's. */
export function chosenBars(state: EditorState): BarRange {
  if (state.selection) return selectedBars(state.draft, state.selection)
  const { index } = barAt(state.draft, state.caret)
  return { from: index, to: index }
}

/** A chord set at the caret's place in the chords, the caret staying there. */
export function chordSet(state: EditorState, chord: Chord): EditorState {
  const caret = snapToChord(state.draft, state.caret)
  const bar = barAt(state.draft, caret)
  return commit(state, setChord(state.draft, bar.index, caret - bar.start, chord), {
    caret,
    struck: null,
  })
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
    case 'insertBefore': {
      const next = insertBarBefore(draft, range.from)
      return commit(state, next, { caret: startOf(next, range.from), selection: null })
    }
    case 'delete': {
      const next = deleteBars(draft, range)
      return commit(state, next, { caret: startOf(next, range.from), selection: null })
    }
    case 'newLine':
      return commit(state, newLine(draft, range.from), { selection: null })
    case 'joinLine':
      return commit(state, joinLine(draft, range.from), { selection: null })
    case 'newSection':
      return commit(state, newSection(draft, range.from), { selection: null })
  }
}
