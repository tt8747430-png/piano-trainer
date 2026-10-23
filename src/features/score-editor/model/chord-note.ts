import type { Key, Midi } from '@/shared/lib/music'
import { placed } from './caret-moves'
import type { Layer } from './draft'
import { keyStep, notesAt } from './notes'
import { shownRows } from './rows'
import type { EditorState } from './state'

/** The row over (−1) or under (1) a row among those shown, top down: the same row at either end. */
export function staffNear(layer: Layer, direction: -1 | 1, rows: readonly Layer[]): Layer {
  const at = rows.indexOf(layer)
  return rows[Math.max(0, Math.min(rows.length - 1, at + direction))] ?? layer
}

/** A key moved `steps` notes of the key up or down, as a note dragged on its staff. */
export function steppedKey(key: Key, from: Midi, steps: number): Midi {
  let moved = from
  for (let i = 0; i < Math.abs(steps); i++) moved = keyStep(key, moved, steps > 0 ? 1 : -1)
  return moved
}

/**
 * Alt ↑ ↓ as a notation app steps through a chord (ADR 0088): from the whole chord at the caret to
 * its top note (up) or its foot (down), then note by note; past its top or foot, or on a single note,
 * to the staff over or under, the whole chord there.
 */
export function chordNoteStep(state: EditorState, direction: -1 | 1): EditorState {
  const { draft, layer, caret, chordNote } = state
  const keys =
    layer === 'chords'
      ? []
      : notesAt(draft, layer, caret)
          .map((n) => n.midi)
          .sort((a, b) => a - b)
  if (keys.length > 1) {
    const at = chordNote === null ? -1 : keys.indexOf(chordNote)
    const next = at < 0 ? (direction > 0 ? keys.length - 1 : 0) : direction > 0 ? at + 1 : at - 1
    const key = keys[next]
    if (key !== undefined) return { ...state, chordNote: key, selection: null, struck: null }
  }
  // Up the music is up the page: the staff over is the row before.
  const row = staffNear(layer, direction > 0 ? -1 : 1, shownRows(draft))
  if (row === layer) return chordNote === null ? state : { ...state, chordNote: null }
  return {
    ...state,
    layer: row,
    caret: placed(draft, row, caret),
    chordNote: null,
    selection: null,
    struck: null,
  }
}
