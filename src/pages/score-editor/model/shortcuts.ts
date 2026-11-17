import type { CaretMove, ChosenValue, EditorAction, Layer } from '@/features/score-editor'
import type { KeyPress } from '@/shared/lib/shortcuts'
import type { TupletCount } from '@/shared/lib/notation'
import type { SheetField } from '@/widgets/score-sheet'

/** A shortcut: an editor action, or a field opened to type in where it is printed (ADR 0096). */
type Shortcut = EditorAction | { readonly type: 'field'; readonly field: SheetField['kind'] }

/** A tool's key: a physical key (`code`), its cap as printed, and the modifiers held with it. */
interface ToolCombo {
  readonly code: string
  readonly cap: string
  readonly shift?: true
  readonly mod?: true
  readonly alt?: true
}

/** A tool's shortcut, with what it does. */
interface ToolShortcut extends ToolCombo {
  readonly does: Shortcut
}

const tuplet = (num: TupletCount): ToolShortcut => ({
  code: `Digit${num}`,
  cap: String(num),
  shift: true,
  does: { type: 'tuplet', num },
})

const value = (chosen: ChosenValue['value'], digit: number): ToolShortcut => ({
  code: `Digit${digit}`,
  cap: String(digit),
  does: { type: 'value', value: chosen },
})

/**
 * The palette's tools by Flat's keys (its help's Keyboard shortcuts), where the typing keys leave
 * them free: a letter alone plays the piano, so Flat's J, S, T and P take Shift (ADR 0114). What
 * each does, and the caps its tooltip and the shortcuts' sheet print. By physical key, so every
 * layout presses the same.
 */
export const TOOL_SHORTCUTS = {
  whole: value(1, 1),
  half: value(2, 2),
  quarter: value(4, 3),
  eighth: value(8, 4),
  sixteenth: value(16, 5),
  thirtySecond: value(32, 6),
  sixtyFourth: value(64, 7),
  rest: { code: 'Digit8', cap: '8', does: { type: 'rest' } },
  // Flat's and Dorico's R; a letter alone plays the piano, so Shift (research F13).
  repeat: { code: 'KeyR', cap: 'R', shift: true, does: { type: 'repeat' } },
  grace: { code: 'Digit9', cap: '9', does: { type: 'grace', kind: 'appoggiatura' } },
  acciaccatura: {
    code: 'Digit9',
    cap: '9',
    shift: true,
    does: { type: 'grace', kind: 'acciaccatura' },
  },
  natural: { code: 'Digit0', cap: '0', does: { type: 'accidental', accidental: 0 } },
  sharp: { code: 'Equal', cap: '=', does: { type: 'accidental', accidental: 1 } },
  flat: { code: 'Minus', cap: '−', does: { type: 'accidental', accidental: -1 } },
  respell: { code: 'KeyJ', cap: 'J', shift: true, does: { type: 'respell' } },
  dot: { code: 'Period', cap: '.', does: { type: 'dot' } },
  doubleDot: { code: 'Period', cap: '.', alt: true, does: { type: 'dot', dots: 2 } },
  tie: { code: 'Comma', cap: ',', does: { type: 'tie' } },
  // Flat's ⇧2–⇧8: a tuplet of two to eight on the value; ⇧9 is the acciaccatura's, so nine takes
  // its key alone (ADR 0097).
  tuplet2: tuplet(2),
  tuplet3: tuplet(3),
  tuplet4: tuplet(4),
  tuplet5: tuplet(5),
  tuplet6: tuplet(6),
  tuplet7: tuplet(7),
  tuplet8: tuplet(8),
  slur: { code: 'KeyS', cap: 'S', shift: true, does: { type: 'line', line: 'slur' } },
  cresc: { code: 'Comma', cap: '<', shift: true, does: { type: 'line', line: 'cresc' } },
  dim: { code: 'Period', cap: '>', shift: true, does: { type: 'line', line: 'dim' } },
  '8va': { code: 'Digit8', cap: '8', shift: true, mod: true, does: { type: 'line', line: '8va' } },
  '8vb': { code: 'Digit9', cap: '9', shift: true, mod: true, does: { type: 'line', line: '8vb' } },
  trill: {
    code: 'KeyT',
    cap: 'T',
    shift: true,
    does: { type: 'mark', mark: { kind: 'ornament', ornament: 'trill' } },
  },
  pedal: {
    code: 'KeyP',
    cap: 'P',
    shift: true,
    does: { type: 'mark', mark: { kind: 'pedal', pedal: 'down' } },
  },
  // Flat's: ⌥Enter a bar after, ⌘⇧Enter one at the end, ⌘Enter the system break (research F14).
  barAfter: { code: 'Enter', cap: 'Enter', alt: true, does: { type: 'bars', edit: 'insert' } },
  barEnd: {
    code: 'Enter',
    cap: 'Enter',
    shift: true,
    mod: true,
    does: { type: 'bars', edit: 'insertEnd' },
  },
  barDelete: {
    code: 'Backspace',
    cap: 'Backspace',
    mod: true,
    does: { type: 'bars', edit: 'delete' },
  },
  newLine: { code: 'Enter', cap: 'Enter', mod: true, does: { type: 'bars', edit: 'newLine' } },
  repeatStart: {
    code: 'BracketLeft',
    cap: '[',
    does: { type: 'barMarks', choice: 'repeatStart' },
  },
  repeatEnd: { code: 'BracketRight', cap: ']', does: { type: 'barMarks', choice: 'repeatEnd' } },
  mode: { code: 'KeyI', cap: 'I', does: { type: 'mode' } },
  chord: { code: 'KeyK', cap: 'K', mod: true, does: { type: 'field', field: 'chord' } },
  lyrics: { code: 'KeyL', cap: 'L', mod: true, does: { type: 'field', field: 'lyrics' } },
  fingering: { code: 'KeyF', cap: 'F', shift: true, does: { type: 'field', field: 'fingering' } },
  // Flat's ⌘E an annotation, ⌘⇧K a Roman numeral (ADR 0097).
  annotation: { code: 'KeyE', cap: 'E', mod: true, does: { type: 'field', field: 'text' } },
  numeral: { code: 'KeyK', cap: 'K', shift: true, mod: true, does: { type: 'numeral' } },
} as const satisfies Readonly<Record<string, ToolShortcut>>
export type Tool = keyof typeof TOOL_SHORTCUTS
/** Whether a name is a tool's with a shortcut: a line's, a mark's. */
export const isTool = (name: string): name is Tool => Object.hasOwn(TOOL_SHORTCUTS, name)

const TOOLS: readonly ToolShortcut[] = Object.values(TOOL_SHORTCUTS)

/** The tool a press is the key of: its key with exactly its modifiers. */
const toolOf = (press: KeyPress): ToolShortcut | undefined =>
  TOOLS.find(
    (tool) =>
      tool.code === press.code &&
      (tool.shift === true) === press.shiftKey &&
      (tool.alt === true) === press.altKey &&
      (tool.mod === true) === (press.metaKey || press.ctrlKey),
  )

/** A tool's keycaps in the order they are pressed, with the modifiers' caps this keyboard prints. */
export function toolCaps(
  tool: Tool,
  caps: { readonly mod: string; readonly alt: string; readonly shift: string },
): readonly string[] {
  const combo: ToolCombo = TOOL_SHORTCUTS[tool]
  return [
    ...(combo.mod ? [caps.mod] : []),
    ...(combo.alt ? [caps.alt] : []),
    ...(combo.shift ? [caps.shift] : []),
    combo.cap,
  ]
}

/** The clipboard's edits by letter, with Cmd or Ctrl (the platform's own copy, cut and paste). */
const CLIP_EDITS = { KeyC: 'copy', KeyX: 'cut', KeyV: 'paste' } as const
const isClipKey = (code: string): code is keyof typeof CLIP_EDITS => Object.hasOwn(CLIP_EDITS, code)

/**
 * The editor's shortcut for a key press in a layer, or null. The tools' keys (`TOOL_SHORTCUTS`),
 * then the caret's and the edits': arrows (Shift extending what is chosen by a note, with Cmd by a
 * bar, as Flat and Dorico; Home and End to an end; Alt with ↑ ↓ through a chord's notes, then to the staff over or under,
 * ADR 0096; ↑ ↓ the notes a step in the key, with Shift a semitone, with Cmd an octave), Home, End,
 * Backspace, Delete, Enter and Escape (letting go of what is chosen), and Cmd or Ctrl with Z, Y,
 * and C, X, V (what is chosen, ADR 0114); Alt with 2 to 8 a note a 2nd to an octave above what is
 * chosen or just written, with Shift below (research F7). A letter alone plays the piano, but for I, which typing
 * leaves free: on a staff it cycles the editing modes, as Dorico's I does (ADR 0114).
 */
export function shortcutOf(press: KeyPress, layer: Layer): Shortcut | null {
  const mod = press.metaKey || press.ctrlKey
  if (mod) {
    if (press.code === 'KeyZ') return { type: press.shiftKey ? 'redo' : 'undo' }
    if (press.code === 'KeyY' && press.ctrlKey) return { type: 'redo' }
    if (isClipKey(press.code)) return { type: 'clip', edit: CLIP_EDITS[press.code] }
    if (press.code === 'KeyA' && !press.shiftKey && !press.altKey) return { type: 'selectAll' }
  }
  const tool = toolOf(press)
  if (tool) return tool.does.type === 'mode' && layer === 'chords' ? null : tool.does
  // Alt with 2 to 8 a note a 2nd to an octave above, with Shift below (Flat's addNoteInterval).
  const interval = /^Digit([2-8])$/.exec(press.code)?.[1]
  if (press.altKey && !mod && interval && layer !== 'chords')
    return { type: 'interval', steps: (Number(interval) - 1) * (press.shiftKey ? -1 : 1) }
  const move = (by: CaretMove, direction: -1 | 1): Shortcut => ({
    type: 'move',
    by,
    direction,
    extend: press.shiftKey,
  })
  switch (press.key) {
    case 'ArrowLeft':
    case 'ArrowRight': {
      // Cmd a bar, as Flat's and Dorico's; Home and End the score's ends (research F10).
      if (press.altKey) return null
      const direction = press.key === 'ArrowLeft' ? -1 : 1
      return move(mod ? 'bar' : 'step', direction)
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
      if (mod || press.altKey) return null
      return { type: 'move', by: 'line', direction: press.shiftKey ? -1 : 1, extend: false }
  }
  return null
}
