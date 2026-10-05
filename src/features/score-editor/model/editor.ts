import { setBarTicks } from './bars'
import { moveCaret, placeCaret, placed, stepOf } from './caret-moves'
import { deleteChord } from './chords'
import { isHandLayer } from './draft'
import { barsEdited, chordSet } from './form-edits'
import { commit, undone } from './history'
import { keyPlayed } from './keys-played'
import {
  backToPattern,
  deleteNotes,
  respellNotes,
  setFinger,
  shiftNotes,
  writeOut,
  writeRest,
} from './notes'
import { joinSection, setSectionKind } from './sections'
import { setKey, setPattern, setTempo } from './settings'
import type { EditorAction, EditorState } from './state'
import { writeTake } from './take-edits'
import { barAt } from './timeline'
import { toggledDot, toggledTriplet, withValue } from './values'

/** The editor's state after an action (spec §6). */
export function reduce(state: EditorState, action: EditorAction): EditorState {
  const { draft, layer, caret } = state
  switch (action.type) {
    case 'layer':
      return {
        ...state,
        layer: action.layer,
        caret: placed(draft, action.layer, caret),
        selection: null,
        struck: null,
      }
    case 'value':
      return { ...state, value: withValue(state.value, action.value, draft.meter), struck: null }
    case 'dot':
    case 'triplet': {
      const toggled = action.type === 'dot' ? toggledDot : toggledTriplet
      const value = toggled(state.value, draft.meter)
      return value === state.value ? state : { ...state, value }
    }
    case 'chordMode':
      return { ...state, chord: !state.chord, struck: null }
    case 'move':
      return moveCaret(state, action.by, action.direction, action.extend ?? false)
    case 'place':
      return placeCaret(state, action.tick, action.layer, action.extend ?? false)
    case 'key':
      return keyPlayed(state, action.key, action.time)
    case 'rest': {
      if (layer === 'chords') return state
      const result = writeRest(draft, layer, caret, stepOf(state))
      return commit(state, result.draft, { caret: result.end, struck: null })
    }
    case 'delete': {
      if (layer !== 'chords') {
        return commit(state, deleteNotes(draft, layer, caret), { struck: null })
      }
      if (state.selection) return barsEdited(state, 'delete')
      const bar = barAt(draft, caret)
      return commit(state, deleteChord(draft, bar.index, caret - bar.start), { struck: null })
    }
    case 'shift':
      return layer === 'chords'
        ? state
        : commit(state, shiftNotes(draft, layer, caret, action.semitones), { struck: null })
    case 'respell':
      return layer === 'chords'
        ? state
        : commit(state, respellNotes(draft, layer, caret), { struck: null })
    case 'finger':
      return isHandLayer(layer)
        ? commit(state, setFinger(draft, layer, caret, action.midi, action.finger))
        : state
    case 'chord':
      return chordSet(state, action.chord, action.advance)
    case 'writeOut':
      return isHandLayer(layer)
        ? commit(state, writeOut(draft, layer, barAt(draft, caret).index, action.played))
        : state
    case 'backToPattern':
      return isHandLayer(layer)
        ? commit(state, backToPattern(draft, layer, barAt(draft, caret).index))
        : state
    case 'take':
      return commit(state, writeTake(draft, barAt(draft, caret).start, action.parts), {
        struck: null,
      })
    case 'bars':
      return barsEdited(state, action.edit)
    case 'barLength':
      return commit(state, setBarTicks(draft, barAt(draft, caret).index, action.ticks))
    case 'sectionKind':
      return commit(state, setSectionKind(draft, action.section, action.kind))
    case 'joinSection':
      return commit(state, joinSection(draft, action.section))
    case 'settings': {
      let next = draft
      if (action.key) next = setKey(next, action.key)
      if (action.tempo !== undefined) next = setTempo(next, action.tempo)
      if (action.pattern) next = setPattern(next, action.pattern)
      return commit(state, next)
    }
    case 'undo':
    case 'redo':
      return undone(state, action.type)
  }
}
