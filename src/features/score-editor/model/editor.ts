import { songTitle } from '@/entities/piece'
import { markBars } from './bar-marks'
import { setClef } from './clefs'
import { shownRows, staffLeftFor } from './rows'
import { setBarTicks } from './bars'
import { chosenNotes, chosenSpan, fingerPlace, shownValue, takenAway } from './chosen'
import { moveCaret, placeCaret, placed, selectionSpan, stepOf } from './caret-moves'
import { clipEdited } from './clip-edits'
import { singleStaff, staffPlace, ticksOf } from '@/shared/lib/notation'
import { chordNoteStep } from './chord-note'
import { deleteChord } from './chords'
import { midi, PIANO, type Midi } from '@/shared/lib/music'
import { isHandLayer, type Draft, type Layer } from './draft'
import { barsEdited, chordSet, chosenBars } from './form-edits'
import { commit, undone } from './history'
import { keyPlayed } from './keys-played'
import { lineOver, lineSpan } from './lines'
import { setSyllable, singsHere } from './lyrics'
import { markNotes, setTempoChange, setText, toggleNumeral } from './marks'
import {
  backFrom,
  deleteNotes,
  graceNotes,
  makeRoom,
  notesAt,
  respellNotes,
  setDuration,
  setFingers,
  shiftNotes,
  stepNotes,
  steppedKey,
  tieNotes,
  toggleAccidental,
  writeRest,
} from './notes'
import { setTime } from './meters'
import { joinSection, setSectionKey, setSectionKind } from './sections'
import { addStaff, removeStaff, renameStaff, setStaffClef } from './staves'
import { setKey, setTempo, setTempoMark, transpose } from './settings'
import { nextMode, type EditorAction, type EditorState } from './state'
import { writeTake } from './take-edits'
import { barAt, barsOf, keyAt } from './timeline'
import { toggledDot, toggledTuplet, withValue, type ChosenValue } from './values'

/**
 * Where the caret goes once the single staff at `place` is taken away (ADR 0097): from it, to the
 * staff that was under it (the piano's upper staff under the last), else the one over it; from a
 * staff under it, up with that staff; elsewhere, where it was.
 */
function rowAfterRemoving(next: Draft, layer: Layer, place: number): Layer {
  if (layer === 'chords' || isHandLayer(layer)) return layer
  const at = staffPlace(layer)
  if (at > place) return singleStaff(at - 1)
  if (at < place) return layer
  const staves = shownRows(next).filter((row) => row !== 'chords')
  return staves[place] ?? staves.at(-1) ?? staffLeftFor(next)
}

/** The chord's one note chosen, moved by `move` (null where it went past the piano's ends). */
function movedNote(state: EditorState, move: (key: Midi) => Midi | null): Partial<EditorState> {
  if (state.chordNote === null) return {}
  return { chordNote: move(state.chordNote) }
}

/**
 * A value chosen in the palette: the notes chosen made that long, else the next
 * note's; either way the value the next note is written as.
 */
function valueChosen(state: EditorState, value: ChosenValue): EditorState {
  if (state.layer === 'chords' || chosenNotes(state).length === 0)
    return { ...state, value, struck: null }
  const ticks = ticksOf(value, state.draft.meter)
  return commit(state, setDuration(state.draft, state.layer, chosenSpan(state), ticks), {
    value,
    struck: null,
    selection: state.selection,
  })
}

/** The chord's one note chosen, where a sign moved it: the note of its letter at the caret in `next`. */
function accidentalMoved(state: EditorState, next: Draft): Partial<EditorState> {
  if (state.chordNote === null || state.layer === 'chords') return {}
  const chosen = notesAt(state.draft, state.layer, state.caret).find(
    (n) => n.midi === state.chordNote,
  )
  const moved =
    chosen &&
    notesAt(next, state.layer, state.caret).find((n) => n.spelled.letter === chosen.spelled.letter)
  return moved ? { chordNote: moved.midi } : {}
}

/** The editor's state after an action. */
export function reduce(state: EditorState, action: EditorAction): EditorState {
  const { draft, layer, caret } = state
  switch (action.type) {
    case 'layer':
      return {
        ...state,
        layer: action.layer,
        caret: placed(draft, action.layer, caret),
        selection: null,
        chordNote: null,
        struck: null,
      }
    case 'value':
      return valueChosen(
        state,
        withValue(shownValue(state) ?? state.value, action.value, draft.meter),
      )
    case 'dot':
    case 'tuplet': {
      const shown = shownValue(state) ?? state.value
      const value =
        action.type === 'dot'
          ? toggledDot(shown, draft.meter, action.dots)
          : toggledTuplet(shown, action.num, draft.meter)
      return value === shown ? state : valueChosen(state, value)
    }
    case 'mode':
      return { ...state, mode: action.mode ?? nextMode(state.mode), struck: null }
    case 'move':
      return moveCaret(state, action.by, action.direction, action.extend ?? false)
    case 'place':
      return placeCaret(state, action.tick, action.layer, action.extend ?? false, action.key)
    case 'deselect':
      return state.selection === null && state.chordNote === null
        ? state
        : { ...state, selection: null, chordNote: null }
    case 'chordNote':
      return chordNoteStep(state, action.direction)
    case 'key':
      return keyPlayed(state, action.key, action.time)
    case 'rest': {
      if (layer === 'chords') return state
      // The notes chosen made rests, still chosen.
      if (state.selection) {
        const span = selectionSpan(state.selection)
        return commit(state, deleteNotes(draft, layer, span), {
          caret: span.from,
          selection: state.selection,
          struck: null,
        })
      }
      // In Insert mode a rest, like a note, is written in room made for it, the later notes pushed
      // right (ADR 0114); with none to push, as Replace writes it, stopping at the song's end.
      const room = state.mode === 'insert' ? makeRoom(draft, layer, caret, stepOf(state)) : draft
      const result = writeRest(room, layer, caret, stepOf(state))
      return commit(state, result.draft, { caret: result.end, struck: null })
    }
    case 'delete': {
      if (layer !== 'chords') {
        // The notes chosen in this row taken, the caret at their start; a chord's one note chosen,
        // that note alone (ADR 0096).
        const span = chosenSpan(state)
        if (typeof span !== 'number' && 'from' in span)
          return commit(state, takenAway(state, layer, span), {
            caret: span.from,
            selection: null,
            struck: null,
          })
        // The chord stays, so there is no gap to close.
        if (typeof span !== 'number')
          return commit(state, deleteNotes(draft, layer, span), {
            chordNote: null,
            struck: null,
          })
        const at = action.back ? backFrom(draft, layer, caret) : caret
        if (at === null) return { ...state, struck: null }
        return commit(state, takenAway(state, layer, at), { caret: at, struck: null })
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
            stepNotes(draft, layer, chosenSpan(state), action.steps),
            {
              struck: null,
              selection: state.selection,
              ...movedNote(state, (key) =>
                steppedKey(keyAt(draft, state.caret), key, action.steps),
              ),
            },
            action.joins ?? false,
          )
    case 'addStaff': {
      const next = addStaff(draft, action.place)
      // The caret on the staff added, where it was in time.
      const added = singleStaff(Math.max(0, Math.min(action.place, draft.staves.length)))
      return commit(state, next, {
        layer: added,
        caret: placed(next, added, caret),
        selection: null,
        chordNote: null,
        struck: null,
      })
    }
    case 'removeStaff': {
      const next = removeStaff(draft, action.place)
      if (next === draft) return state
      return commit(state, next, {
        layer: rowAfterRemoving(next, layer, action.place),
        selection: null,
        chordNote: null,
        struck: null,
      })
    }
    case 'renameStaff':
      return commit(state, renameStaff(draft, action.place, action.name))
    case 'piano': {
      // Never every staff out of sight: a lead sheet keeps its single staves (ADR 0114).
      if (draft.leadSheet === action.hidden || (action.hidden && draft.staves.length === 0))
        return state
      const next = { ...draft, leadSheet: action.hidden }
      // The caret leaves a hand put out of sight for the top staff's.
      const leaves = action.hidden && isHandLayer(layer)
      return commit(state, next, leaves ? { layer: staffLeftFor(next), struck: null } : {})
    }
    case 'shift':
      return layer === 'chords'
        ? state
        : commit(state, shiftNotes(draft, layer, chosenSpan(state), action.semitones), {
            struck: null,
            selection: state.selection,
            ...movedNote(state, (key) => {
              const moved = key + action.semitones
              return moved < PIANO.from || moved > PIANO.to ? key : midi(moved)
            }),
          })
    case 'accidental': {
      if (layer === 'chords') return state
      const next = toggleAccidental(draft, layer, chosenSpan(state), action.accidental)
      return commit(state, next, {
        struck: null,
        selection: state.selection,
        ...accidentalMoved(state, next),
      })
    }
    case 'grace':
      return layer === 'chords'
        ? state
        : commit(state, graceNotes(draft, layer, chosenSpan(state)), {
            struck: null,
            selection: state.selection,
          })
    case 'respell':
      return layer === 'chords'
        ? state
        : commit(state, respellNotes(draft, layer, chosenSpan(state)), {
            struck: null,
            selection: state.selection,
          })
    case 'fingers':
      return isHandLayer(layer)
        ? commit(state, setFingers(draft, layer, fingerPlace(state), action.fingers), {
            struck: null,
          })
        : state
    case 'mark': {
      if (layer === 'chords') return state
      return commit(state, markNotes(draft, layer, chosenSpan(state), action.mark), {
        struck: null,
        selection: state.selection,
      })
    }
    case 'numeral':
    case 'tempoChange':
    case 'text': {
      if (layer === 'chords') return state
      const span = chosenSpan(state)
      const next =
        action.type === 'numeral'
          ? toggleNumeral(draft, layer, span)
          : action.type === 'tempoChange'
            ? setTempoChange(draft, layer, span, action.tempo)
            : setText(draft, layer, span, action.text)
      return commit(state, next, { struck: null, selection: state.selection })
    }
    case 'line':
      if (layer === 'chords') return state
      return commit(state, lineOver(draft, layer, lineSpan(state), action.line), {
        struck: null,
        selection: state.selection,
      })
    case 'tie':
      return layer === 'chords'
        ? state
        : commit(state, tieNotes(draft, layer, caret), { struck: null })
    // The words go under the staff they are written on alone (ADR 0097).
    case 'syllable':
      return singsHere(draft, layer)
        ? commit(state, setSyllable(draft, caret, action.verse, action.text), { struck: null })
        : state
    case 'chord':
      return chordSet(state, action.chord)
    case 'take':
      return commit(state, writeTake(draft, barAt(draft, caret).start, action.parts), {
        struck: null,
      })
    case 'bars':
      return barsEdited(state, action.edit)
    case 'clip':
      return clipEdited(state, action.edit)
    case 'barMarks':
      return commit(state, markBars(draft, chosenBars(state), action.choice))
    case 'clef':
      return commit(
        state,
        isHandLayer(action.staff)
          ? setClef(draft, action.bar, action.staff, action.clef)
          : setStaffClef(draft, staffPlace(action.staff), action.clef),
      )
    // Each bar chosen, else the caret's.
    case 'barLength': {
      const { from, to } = chosenBars(state)
      let next = draft
      for (let index = from; index <= to; index++) next = setBarTicks(next, index, action.ticks)
      return commit(state, next)
    }
    case 'sectionKind':
      return commit(state, setSectionKind(draft, action.section, action.kind))
    case 'joinSection':
      return commit(state, joinSection(draft, action.section))
    case 'sectionKey': {
      const section = barsOf(draft)[action.bar]?.section ?? 0
      return commit(state, setSectionKey(draft, section, action.key))
    }
    case 'time': {
      const section = barsOf(draft)[action.bar]?.section ?? 0
      return commit(state, setTime(draft, section, action.time))
    }
    case 'settings': {
      let next = draft
      if (action.key) next = setKey(next, action.key)
      if (action.tempo !== undefined) next = setTempo(next, action.tempo)
      return commit(state, next)
    }
    case 'tempo':
      return commit(state, setTempoMark(draft, action.mark, action.unit))
    case 'transpose':
      return commit(state, transpose(draft, action.semitones, action.applies))
    case 'title': {
      const title = songTitle(action.title)
      return title === null || title === draft.title ? state : commit(state, { ...draft, title })
    }
    case 'undo':
    case 'redo':
      return undone(state, action.type)
  }
}
