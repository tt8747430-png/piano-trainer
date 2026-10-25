import type { CaretMove, ChosenValue, EditorAction, Layer } from '@/features/score-editor'
import type { KeyPress } from '@/shared/lib/shortcuts'
import type { SheetField } from '@/widgets/score-sheet'

/** A shortcut: an editor action, or a field opened to type in where it is printed (ADR 0096). */
type Shortcut = EditorAction | { readonly type: 'field'; readonly field: SheetField['kind'] }

/** The fields opened with Cmd or Ctrl and a letter, as Flat's: K a chord symbol, L the lyrics. */
const FIELD_KEYS = { KeyK: 'chord', KeyL: 'lyrics' } as const satisfies Readonly<
  Record<string, SheetField['kind']>
>
const isFieldKey = (code: string): code is keyof typeof FIELD_KEYS =>
  Object.hasOwn(FIELD_KEYS, code)

/** The value keys, by physical key so every layout chooses the same: 1 a whole note to 6 a 32nd. */
const VALUES: Readonly<Record<string, ChosenValue['value']>> = {
  Digit1: 1,
  Digit2: 2,
  Digit3: 4,
  Digit4: 8,
  Digit5: 16,
  Digit6: 32,
}

/** The clipboard's edits by letter, with Cmd or Ctrl (the platform's own copy, cut and paste). */
const CLIP_EDITS = { KeyC: 'copy', KeyX: 'cut', KeyV: 'paste' } as const
const isClipKey = (code: string): code is keyof typeof CLIP_EDITS => Object.hasOwn(CLIP_EDITS, code)

/**
 * The editor's shortcut for a key press in a layer (spec §6), or null. Only keys the typing keys leave
 * free: digits, the full stop, arrows (Shift extending what is chosen by a note, with Alt by a bar,
 * with Cmd to an end; Alt with ↑ ↓ through a chord's notes, then to the staff over or under, ADR
 * 0088; ↑ ↓ the notes a step in the key, with Shift a semitone, with Cmd an octave), Home, End, Backspace, Delete, Enter and Escape (letting go of what is chosen), and Cmd or
 * Ctrl with Z, Y, and C, X, V (what is chosen, ADR 0092), K and L (the chord-symbol and Lyrics fields, ADR 0096), and Shift with F (the fingering field); a letter alone plays the piano, but for I,
 * which typing leaves free: on a staff it cycles the editing modes, as Dorico's I does (ADR 0092).
 */
export function shortcutOf(press: KeyPress, layer: Layer): Shortcut | null {
  const mod = press.metaKey || press.ctrlKey
  if (mod) {
    if (press.code === 'KeyZ') return { type: press.shiftKey ? 'redo' : 'undo' }
    if (press.code === 'KeyY' && press.ctrlKey) return { type: 'redo' }
    if (isClipKey(press.code)) return { type: 'clip', edit: CLIP_EDITS[press.code] }
    if (isFieldKey(press.code) && !press.shiftKey && !press.altKey)
      return { type: 'field', field: FIELD_KEYS[press.code] }
  }
  const move = (by: CaretMove, direction: -1 | 1): Shortcut => ({
    type: 'move',
    by,
    direction,
    extend: press.shiftKey,
  })
  switch (press.key) {
    case 'ArrowLeft':
    case 'ArrowRight': {
      const direction = press.key === 'ArrowLeft' ? -1 : 1
      return move(mod ? 'end' : press.altKey ? 'bar' : 'step', direction)
    }
    case 'Home':
      return move('end', -1)
    case 'End':
      return move('end', 1)
    case 'ArrowUp':
    case 'ArrowDown': {
      const direction = press.key === 'ArrowUp' ? 1 : -1
      if (press.altKey) return { type: 'chordNote', direction }
      if (layer === 'chords') return null
      // A step in the key, as Flat and Dorico move a note; Shift a semitone, Cmd an octave.
      if (mod) return { type: 'shift', semitones: direction * 12 }
      if (press.shiftKey) return { type: 'shift', semitones: direction }
      return { type: 'step', steps: direction }
    }
    // Backspace as a text field's: the notes chosen, else the last before the caret; Delete, those chosen.
    case 'Backspace':
      return mod ? null : { type: 'delete', back: true }
    case 'Delete':
      return mod ? null : { type: 'delete' }
    case 'Escape':
      return mod ? null : { type: 'deselect' }
    // Enter goes on a line; Shift, back a line.
    case 'Enter':
      if (mod) return null
      return { type: 'move', by: 'line', direction: press.shiftKey ? -1 : 1, extend: false }
  }
  if (mod || press.altKey) return null
  // F with Shift, a letter typing leaves free so, the fingering field (ADR 0036, 0096; Dorico's).
  if (press.code === 'KeyF' && press.shiftKey) return { type: 'field', field: 'fingering' }
  const value = VALUES[press.code]
  if (value !== undefined) return { type: 'value', value }
  if (press.code === 'Period') return { type: 'dot' }
  if (press.code === 'Digit0') return { type: 'rest' }
  if (press.code === 'KeyI') return layer === 'chords' ? null : { type: 'mode' }
  return null
}
