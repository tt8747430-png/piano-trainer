import type { CaretMove, ChosenValue, EditorAction, Layer } from '@/features/score-editor'
import type { KeyPress } from '@/shared/lib/shortcuts'

/** A shortcut: an editor action, or the Chord field to type in. */
type Shortcut = EditorAction | { readonly type: 'chordField' }

/** The value keys, by physical key so every layout chooses the same: 1 a whole note to 6 a 32nd. */
const VALUES: Readonly<Record<string, ChosenValue['value']>> = {
  Digit1: 1,
  Digit2: 2,
  Digit3: 4,
  Digit4: 8,
  Digit5: 16,
  Digit6: 32,
}

/** The bar edits by letter, with Cmd or Ctrl (the platform's own copy, cut and paste). */
const BAR_EDITS = { KeyC: 'copy', KeyX: 'cut', KeyV: 'paste' } as const
const isBarEditKey = (code: string): code is keyof typeof BAR_EDITS =>
  Object.hasOwn(BAR_EDITS, code)

/**
 * The editor's shortcut for a key press in a layer (spec §6), or null. Only keys the typing keys leave
 * free: digits, the full stop, arrows (Shift extending what is chosen by a note, with Alt by a bar,
 * with Cmd to an end; Alt with ↑ ↓ through a chord's notes, then to the staff over or under, ADR
 * 0086), Home, End, Backspace, Delete, Enter and Escape (letting go of what is chosen), and Cmd or
 * Ctrl with Z, Y, and C, X, V (the bars, in the chords); a letter alone plays the piano.
 */
export function shortcutOf(press: KeyPress, layer: Layer): Shortcut | null {
  const mod = press.metaKey || press.ctrlKey
  if (mod) {
    if (press.code === 'KeyZ') return { type: press.shiftKey ? 'redo' : 'undo' }
    if (press.code === 'KeyY' && press.ctrlKey) return { type: 'redo' }
    if (isBarEditKey(press.code)) {
      return layer === 'chords' ? { type: 'bars', edit: BAR_EDITS[press.code] } : null
    }
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
    case 'ArrowDown':
      if (press.altKey) return { type: 'chordNote', direction: press.key === 'ArrowUp' ? 1 : -1 }
      if (layer === 'chords') return null
      return { type: 'shift', semitones: (press.key === 'ArrowUp' ? 1 : -1) * (mod ? 12 : 1) }
    // Backspace as a text field's: the notes chosen, else the last before the caret; Delete, those chosen.
    case 'Backspace':
      return mod ? null : { type: 'delete', back: true }
    case 'Delete':
      return mod ? null : { type: 'delete' }
    case 'Escape':
      return mod ? null : { type: 'deselect' }
    // Enter goes on a line (Shift, back a line); in the chords it opens the field to type one in.
    case 'Enter':
      if (mod) return null
      if (layer === 'chords' && !press.shiftKey) return { type: 'chordField' }
      return { type: 'move', by: 'line', direction: press.shiftKey ? -1 : 1, extend: false }
  }
  if (mod || press.altKey) return null
  const value = VALUES[press.code]
  if (value !== undefined) return { type: 'value', value }
  if (press.code === 'Period') return { type: 'dot' }
  if (press.code === 'Digit0') return { type: 'rest' }
  return null
}
