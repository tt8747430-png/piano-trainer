import { markBars } from './bar-marks'
import { setClef } from './clefs'
import { setBarTicks } from './bars'
import { moveCaret, placeCaret, placed, stepOf } from './caret-moves'
import { deleteChord } from './chords'
import { DEFAULT_INSTRUMENT } from '@/shared/lib/music'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import { isHandLayer, isVoiceLayer, voiceIndex } from './draft'
import { barsEdited, chordSet, selectedBars } from './form-edits'
import { commit, undone } from './history'
import { keyPlayed } from './keys-played'
import { markNotes } from './marks'
import {
  backToPattern,
  deleteBack,
  deleteNotes,
  respellNotes,
  setFinger,
  shiftNotes,
  stepNotes,
  tieNotes,
  writeOut,
  writeRest,
} from './notes'
import { joinSection, setSectionKind, setSectionPattern } from './sections'
import { setKey, setMeter, setTempo } from './settings'
import type { EditorAction, EditorState } from './state'
import { writeTake } from './take-edits'
import { barAt, barsOf } from './timeline'
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
      const value =
        action.type === 'dot'
          ? toggledDot(state.value, draft.meter, action.dots)
          : toggledTriplet(state.value, draft.meter)
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
        if (!action.back) return commit(state, deleteNotes(draft, layer, caret), { struck: null })
        const taken = deleteBack(draft, layer, caret)
        return commit(state, taken.draft, { caret: taken.caret, struck: null })
      }
      if (state.selection) return barsEdited(state, 'delete')
      const bar = barAt(draft, caret)
      const at = caret - bar.start
      const here = bar.bar.chords.some((chord) => chord.at === at)
      const before = bar.bar.chords.findLast((chord) => chord.at < at)
      const target = here || !action.back || !before ? at : before.at
      return commit(state, deleteChord(draft, bar.index, target), {
        caret: bar.start + target,
        struck: null,
      })
    }
    case 'step':
      return layer === 'chords'
        ? state
        : commit(
            state,
            stepNotes(draft, layer, caret, action.steps),
            { struck: null },
            action.joins ?? false,
          )
    case 'melodyStaff': {
      if (action.on === draft.melodyStaff) return state
      if (action.on) return commit(state, { ...draft, melodyStaff: true }, { layer: 'melody' })
      return commit(
        state,
        { ...draft, melodyStaff: false, melody: [] },
        { layer: layer === 'melody' ? 'rh' : layer, struck: null },
      )
    }
    case 'hide': {
      if (draft.hidden.includes(action.row) === action.hidden) return state
      const hidden = action.hidden
        ? [...draft.hidden, action.row]
        : draft.hidden.filter((row) => row !== action.row)
      // The caret leaves a row put out of sight for the right hand's.
      const leaves = action.hidden && layer === action.row
      return commit(state, { ...draft, hidden }, leaves ? { layer: 'rh', struck: null } : {})
    }
    case 'instrument': {
      if (action.part > draft.voices.length) return state
      const instruments = draft.voices.map((_, i) => draft.instruments[i + 1] ?? DEFAULT_INSTRUMENT)
      const all = [draft.instruments[0] ?? DEFAULT_INSTRUMENT, ...instruments]
      all[action.part] = action.instrument
      return commit(state, { ...draft, instruments: all })
    }
    case 'voiceStaff': {
      const index = voiceIndex(action.voice)
      if (action.on) {
        // The next voice's staff, under the last one added: a voice never stands over an empty gap.
        const next = draft.voices.length
        if (next >= EXTRA_VOICES.length) return state
        const voice = EXTRA_VOICES[next] ?? action.voice
        const instruments = [
          ...draft.instruments.slice(0, next + 1),
          action.instrument ?? DEFAULT_INSTRUMENT,
        ]
        return commit(
          state,
          { ...draft, voices: [...draft.voices, []], instruments },
          { layer: voice },
        )
      }
      if (index >= draft.voices.length) return state
      const voices = draft.voices.filter((_, i) => i !== index)
      const instruments = draft.instruments.filter((_, i) => i !== index + 1)
      const stays = !isVoiceLayer(layer) || voiceIndex(layer) < voices.length
      return commit(
        state,
        { ...draft, voices, instruments },
        stays ? { struck: null } : { layer: 'rh', struck: null },
      )
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
    case 'mark': {
      if (layer === 'chords') return state
      const chosen = state.selection && selectedBars(state.selection)
      const bars = barsOf(draft)
      const from = chosen && bars[chosen.from]
      const to = chosen && bars[chosen.to]
      const span = from && to ? { from: from.start, to: to.start + to.bar.ticks } : caret
      return commit(state, markNotes(draft, layer, span, action.mark), {
        struck: null,
        selection: state.selection,
      })
    }
    case 'tie':
      return layer === 'chords'
        ? state
        : commit(state, tieNotes(draft, layer, caret), { struck: null })
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
    case 'barMarks': {
      const range = state.selection
        ? selectedBars(state.selection)
        : { from: barAt(draft, caret).index, to: barAt(draft, caret).index }
      return commit(state, markBars(draft, range, action.choice))
    }
    case 'clef':
      return commit(state, setClef(draft, barAt(draft, caret).index, action.hand, action.clef))
    case 'barLength':
      return commit(state, setBarTicks(draft, barAt(draft, caret).index, action.ticks))
    case 'sectionKind':
      return commit(state, setSectionKind(draft, action.section, action.kind))
    case 'joinSection':
      return commit(state, joinSection(draft, action.section))
    case 'sectionPattern':
      return commit(state, setSectionPattern(draft, action.section, action.pattern))
    case 'settings': {
      let next = draft
      if (action.key) next = setKey(next, action.key)
      if (action.tempo !== undefined) next = setTempo(next, action.tempo)
      if (action.meter) next = setMeter(next, action.meter)
      return commit(state, next)
    }
    case 'undo':
    case 'redo':
      return undone(state, action.type)
  }
}
