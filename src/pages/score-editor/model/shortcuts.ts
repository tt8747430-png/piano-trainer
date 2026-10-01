import type { EditorAction, Layer, NoteValue } from '@/features/score-editor'

/** What a key press is made of, as the browser's KeyboardEvent says it. */
export interface KeyPress {
  readonly code: string
  readonly key: string
  readonly metaKey: boolean
  readonly ctrlKey: boolean
  readonly shiftKey: boolean
  readonly altKey: boolean
}

/** A shortcut: an editor action, or the Chord field to type in. */
export type Shortcut = EditorAction | { readonly type: 'chordField' }

/** The value keys, by physical key so every layout chooses the same: 1 a whole note to 5 a sixteenth. */
const VALUES: Readonly<Record<string, NoteValue['value']>> = {
  Digit1: 1,
  Digit2: 2,
  Digit3: 4,
  Digit4: 8,
  Digit5: 16,
}

/** The bar edits by letter, with Cmd or Ctrl (the platform's own copy, cut and paste). */
const BAR_EDITS = { KeyC: 'copy', KeyX: 'cut', KeyV: 'paste' } as const
const isBarEditKey = (code: string): code is keyof typeof BAR_EDITS =>
  Object.hasOwn(BAR_EDITS, code)

/**
 * The editor's shortcut for a key press in a layer (spec §6), or null. Only keys the typing keys leave
 * free: digits, the full stop, arrows, Home, End, Backspace, Delete and Enter, and Cmd or Ctrl with
 * Z, Y, C, X, V; a letter alone plays the piano.
 */
export function shortcutOf(press: KeyPress, layer: Layer): Shortcut | null {
  const mod = press.metaKey || press.ctrlKey
  if (mod) {
    if (press.code === 'KeyZ') return { type: press.shiftKey ? 'redo' : 'undo' }
    if (press.code === 'KeyY' && press.ctrlKey) return { type: 'redo' }
    if (isBarEditKey(press.code)) return { type: 'bars', edit: BAR_EDITS[press.code] }
  }
  const move = (by: 'step' | 'bar' | 'end', direction: -1 | 1): Shortcut => ({
    type: 'move',
    by,
    direction,
    extend: press.shiftKey && layer === 'chords',
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
      if (layer === 'chords') return null
      return { type: 'shift', semitones: (press.key === 'ArrowUp' ? 1 : -1) * (mod ? 12 : 1) }
    case 'Backspace':
    case 'Delete':
      return mod ? null : { type: 'delete' }
    case 'Enter':
      return layer === 'chords' && !mod ? { type: 'chordField' } : null
  }
  if (mod || press.altKey) return null
  const value = VALUES[press.code]
  if (value !== undefined) return { type: 'value', value }
  if (press.code === 'Period') return { type: 'dot' }
  if (press.code === 'Digit0') return { type: 'rest' }
  return null
}
