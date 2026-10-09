/** What a key press is made of, as the browser's KeyboardEvent says it. */
export interface KeyPress {
  readonly code: string
  readonly key: string
  readonly metaKey: boolean
  readonly ctrlKey: boolean
  readonly shiftKey: boolean
  readonly altKey: boolean
}

/**
 * The keys of a shortcut. A letter or a digit is named by its physical key (`code`), so every layout
 * presses the same key, as the typing keys do; a named key (Escape, ArrowLeft, Enter, the space) or
 * a character a layout reaches its own way (`?`, `/`) by `key`.
 */
export type Combo = ({ readonly code: string } | { readonly key: string }) & {
  /** The platform's modifier: Cmd on a Mac, Ctrl elsewhere. */
  readonly mod?: boolean
  readonly alt?: boolean
  readonly shift?: boolean
}

/** A character is one a layout types, Shift or not; the space is a named key. */
const isCharacter = (key: string) => key.length === 1 && key !== ' '

/** Whether a key press is the combo's: its key, and exactly the modifiers it names. */
export function matches(press: KeyPress, combo: Combo, mac: boolean): boolean {
  const mod = mac ? press.metaKey : press.ctrlKey
  const other = mac ? press.ctrlKey : press.metaKey
  if (other || mod !== (combo.mod ?? false) || press.altKey !== (combo.alt ?? false)) return false
  if ('code' in combo) return press.code === combo.code && press.shiftKey === (combo.shift ?? false)
  if (press.key !== combo.key) return false
  return isCharacter(combo.key) || press.shiftKey === (combo.shift ?? false)
}

/** How a named key is printed on a keycap. */
const PRINTED: Readonly<Record<string, string>> = {
  ' ': 'Space',
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  ArrowDown: '↓',
  Escape: 'Esc',
}

/** A physical key's cap: the letter of `KeyR`, the digit of `Digit1`. */
const capOf = (code: string) => code.replace(/^(Key|Digit)/, '')

/** The modifiers' caps, as the platform's keyboard prints them. */
export const modifierCaps = (mac: boolean) =>
  mac ? { mod: '⌘', alt: '⌥', shift: '⇧' } : { mod: 'Ctrl', alt: 'Alt', shift: 'Shift' }

/** A combo's keycaps in the order they are pressed, as the platform's keyboard prints them. */
export function comboKeys(combo: Combo, mac: boolean): readonly string[] {
  const caps = modifierCaps(mac)
  return [
    ...(combo.mod ? [caps.mod] : []),
    ...(combo.alt ? [caps.alt] : []),
    ...(combo.shift ? [caps.shift] : []),
    'code' in combo ? capOf(combo.code) : (PRINTED[combo.key] ?? combo.key),
  ]
}

/** A control's name with its shortcut after it, for the hint a pointer resting on it reads. */
export const keyHint = (label: string, combo: Combo, mac = false): string =>
  `${label} (${comboKeys(combo, mac).join(' ')})`
