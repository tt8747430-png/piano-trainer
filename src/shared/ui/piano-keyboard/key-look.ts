import type { NamedKeys } from '@/shared/lib'
import {
  isBlackKey,
  noteName,
  pitchClass,
  plainSpelling,
  printedKeyName,
  type ChordRole,
  type Finger,
  type Midi,
} from '@/shared/lib/music'

/** A chord tone's role, a hand in the Player, or a scale's note: its tonic or another (roles stay on chord tones). */
export type KeyTone = ChordRole | 'rh' | 'lh' | 'melody' | 'tonic' | 'scale'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
  /** A finger number, drawn in the finger row under the keys. */
  readonly finger?: Finger
}

/** What the keyboard shows on its keys, key by key. */
export interface KeyStates {
  readonly marks?: ReadonlyMap<Midi, KeyMark>
  /** Keys shown teal: the chord a Name chord question plays. */
  readonly lit?: ReadonlySet<Midi>
  /** A quiz's chosen keys. */
  readonly selected?: ReadonlySet<Midi>
  /** An answer's missing keys. */
  readonly outlined?: ReadonlySet<Midi>
  /** A wrong key in Wait mode, the extra keys of a quiz answer. */
  readonly wrong?: ReadonlySet<Midi>
  /** Keys down: sounding now, or held on a MIDI keyboard. */
  readonly down?: ReadonlySet<Midi>
  /** Marked keys held back while others are struck (spotlight). */
  readonly quiet?: ReadonlySet<Midi>
}

/** What a key may carry besides its marks: its note's name, and a letter of the computer keyboard. */
export interface KeyText {
  readonly namedKeys: NamedKeys
  readonly letters?: ReadonlyMap<Midi, string> | undefined
}

export type KeyFill = 'white' | 'black' | 'lit' | 'selected' | 'wrong' | KeyTone

/** A key's label: a mark's own (a degree, ✓, a note the Player spells), or its note's name, drawn smaller. */
export interface KeyLabel {
  readonly kind: 'mark' | 'name'
  readonly text: string
}

/** One key's face: its fill, whether it is down, outlined or quiet, its label and its letter. */
export interface KeyLook {
  readonly fill: KeyFill
  readonly down: boolean
  readonly outlined: boolean
  readonly quiet: boolean
  readonly label?: KeyLabel
  readonly letter?: string
}

function fillOf(key: Midi, states: KeyStates, mark: KeyMark | undefined): KeyFill {
  if (states.wrong?.has(key)) return 'wrong'
  if (states.lit?.has(key)) return 'lit'
  if (mark) return mark.tone
  if (states.selected?.has(key)) return 'selected'
  return isBlackKey(key) ? 'black' : 'white'
}

/** "C4" on every C unless no key is named; the note alone ("F#") on the other keys when all are. */
function nameOf(key: Midi, namedKeys: NamedKeys): string | undefined {
  if (namedKeys === 'none') return undefined
  const pc = pitchClass(key)
  if (pc === 0) return printedKeyName(key)
  return namedKeys === 'all' ? noteName(plainSpelling(pc, true)) : undefined
}

function labelOf(key: Midi, mark: KeyMark | undefined, namedKeys: NamedKeys): KeyLabel | undefined {
  if (mark?.label) return { kind: 'mark', text: mark.label }
  const name = nameOf(key, namedKeys)
  return name === undefined ? undefined : { kind: 'name', text: name }
}

/** How a key looks: a wrong key over a lit one, a lit one over a mark, a mark over a selection; down over all. */
export function keyLook(key: Midi, states: KeyStates, text: KeyText): KeyLook {
  const mark = states.marks?.get(key)
  const label = labelOf(key, mark, text.namedKeys)
  const letter = text.letters?.get(key)
  return {
    fill: fillOf(key, states, mark),
    down: states.down?.has(key) ?? false,
    outlined: states.outlined?.has(key) ?? false,
    quiet: mark !== undefined && (states.quiet?.has(key) ?? false),
    ...(label ? { label } : {}),
    ...(letter ? { letter } : {}),
  }
}

/** Whether two looks draw the same key: `Key`'s memo compares every field a key shows. */
export const sameLook = (a: KeyLook, b: KeyLook): boolean =>
  a.fill === b.fill &&
  a.down === b.down &&
  a.outlined === b.outlined &&
  a.quiet === b.quiet &&
  a.label?.kind === b.label?.kind &&
  a.label?.text === b.label?.text &&
  a.letter === b.letter
