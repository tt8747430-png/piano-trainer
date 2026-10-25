import { songTitle } from '@/entities/piece'
import { markBars } from './bar-marks'
import { setClef } from './clefs'
import { staffLeftFor } from './rows'
import { setBarTicks } from './bars'
import { chosenNotes, chosenSpan, shownValue, takenAway } from './chosen'
import { moveCaret, placeCaret, placed, selectionSpan, stepOf } from './caret-moves'
import { clipEdited } from './clip-edits'
import { ticksOf } from '@/shared/lib/notation'
import { chordNoteStep } from './chord-note'
import { deleteChord } from './chords'
import { midi, PIANO, type Midi } from '@/shared/lib/music'
import { isHandLayer, type Draft } from './draft'
import { barsEdited, chordSet, chosenBars } from './form-edits'
import { commit, undone } from './history'
import { keyPlayed } from './keys-played'
import { lineOver, lineSpan } from './lines'
import { setSyllable, singsHere, verseCount } from './lyrics'
import { markNotes } from './marks'
import {
  backFrom,
  deleteNotes,
  fingeredNotes,
  makeRoom,
  notesAt,
  respellNotes,
  setDuration,
  setFinger,
  shiftNotes,
  stepNotes,
  steppedKey,
  tieNotes,
  toggleAccidental,
  writeRest,
} from './notes'
import { setMeter, setSectionMeter } from './meters'
import { joinSection, setSectionKey, setSectionKind } from './sections'
import { setKey, setTempo } from './settings'
import { nextMode, type EditorAction, type EditorState } from './state'
import { writeTake } from './take-edits'
import { barAt, barsOf, keyAt } from './timeline'
import { toggledDot, toggledTriplet, withValue, type ChosenValue } from './values'

/** The chord's one note chosen, moved by `move` (null where it went past the piano's ends). */
function movedNote(state: EditorState, move: (key: Midi) => Midi | null): Partial<EditorState> {
  if (state.chordNote === null) return {}
  return { chordNote: move(state.chordNote) }
}

/**
 * A value chosen in the palette (spec 2026-10-23): the notes chosen made that long, else the next
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
        chordNote: null,
        struck: null,
      }
    case 'value':
      return valueChosen(
        state,
        withValue(shownValue(state) ?? state.value, action.value, draft.meter),
      )
    case 'dot':
    case 'triplet': {
      const shown = shownValue(state) ?? state.value
      const value =
        action.type === 'dot'
          ? toggledDot(shown, draft.meter, action.dots)
          : toggledTriplet(shown, draft.meter)
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
      // right (ADR 0092); with none to push, as Replace writes it, stopping at the song's end.
      const room = state.mode === 'insert' ? makeRoom(draft, layer, caret, stepOf(state)) : draft
      const result = writeRest(room, layer, caret, stepOf(state))
      return commit(state, result.draft, { caret: result.end, struck: null })
    }
    case 'delete': {
      if (layer !== 'chords') {
        // The notes chosen in this row taken, the caret at their start; a chord's one note chosen,
        // that note alone (ADR 0088).
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
    case 'melodyStaff': {
      if (action.on === draft.melodyStaff) return state
      // Lyrics written on the upper staff stay there; a song with none yet takes them on the tune's.
      if (action.on) {
        const lyricsOn = verseCount(draft) > 0 ? draft.lyricsOn : 'melody'
        return commit(state, { ...draft, melodyStaff: true, lyricsOn }, { layer: 'melody' })
      }
      // A lead sheet's tune taken away brings the piano back, so a staff is in sight (ADR 0083);
      // its lyrics go with its notes, and the upper staff is the one left to take them.
      const next = {
        ...draft,
        melodyStaff: false,
        melody: [],
        leadSheet: false,
        lyricsOn: 'rh' as const,
      }
      return commit(state, next, {
        layer: layer === 'melody' ? staffLeftFor(next) : layer,
        struck: null,
      })
    }
    case 'piano': {
      // Never every staff out of sight: a lead sheet keeps its tune's staff (ADR 0083).
      if (draft.leadSheet === action.hidden || (action.hidden && !draft.melodyStaff)) return state
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
    case 'respell':
      return layer === 'chords'
        ? state
        : commit(state, respellNotes(draft, layer, chosenSpan(state)), {
            struck: null,
            selection: state.selection,
          })
    case 'finger': {
      if (!isHandLayer(layer)) return state
      const where = chosenSpan(state)
      const fingered = fingeredNotes(draft, layer, where)
      if (fingered.length === 0) return state
      // Every note the finger goes on wears it already: off.
      const on = fingered.every((n) => n.finger === action.finger)
      return commit(state, setFinger(draft, layer, where, on ? null : action.finger), {
        struck: null,
        selection: state.selection,
      })
    }
    case 'mark': {
      if (layer === 'chords') return state
      return commit(state, markNotes(draft, layer, chosenSpan(state), action.mark), {
        struck: null,
        selection: state.selection,
      })
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
    // The words go under the tune's staff alone (ADR 0093).
    case 'syllable':
      return singsHere(draft, layer)
        ? commit(state, setSyllable(draft, caret, action.verse, action.text), { struck: null })
        : state
    case 'chord':
      return chordSet(state, action.chord, action.advance)
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
      return commit(state, setClef(draft, action.bar, action.hand, action.clef))
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
    case 'sectionMeter': {
      const section = barsOf(draft)[action.bar]?.section ?? 0
      return commit(state, setSectionMeter(draft, section, action.meter))
    }
    case 'settings': {
      let next = draft
      if (action.key) next = setKey(next, action.key)
      if (action.tempo !== undefined) next = setTempo(next, action.tempo)
      if (action.meter) next = setMeter(next, action.meter)
      return commit(state, next)
    }
    case 'title': {
      const title = songTitle(action.title)
      return title === null || title === draft.title ? state : commit(state, { ...draft, title })
    }
    case 'undo':
    case 'redo':
      return undone(state, action.type)
  }
}
