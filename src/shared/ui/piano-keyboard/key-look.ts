import type { NamedKeys } from '@/shared/lib'
import {
  isBlackKey,
  noteName,
  pitchClass,
  plainSpelling,
  printedKeyName,
  CHORD_ROLES,
  type ChordRole,
  type Finger,
  type Midi,
  type Tone,
} from '@/shared/lib/music'

/** A chord tone's role, a hand in the Player, or a scale's note: its tonic or another (roles stay on chord tones). */
export type KeyTone = ChordRole | 'rh' | 'lh' | 'staff' | 'tonic' | 'scale'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
  /** A second, smaller line over the label: a degree's numeral over its chord. */
  readonly caption?: string
  /** The note it marks, as the page spells it (E, F♯), named under the label while marked notes are named. */
  readonly note?: string
  /** A finger number, drawn in the finger row under the keys. */
  readonly finger?: Finger
  /** Its finger crosses (the thumb passing under, a finger over it): its circle in the link's sky. */
  readonly crossing?: true
  /**
   * Where a voice was a moment ago (a voice's letter on the key it left): the key plain, its label
   * faint, so the voice's move shows.
   */
  readonly ghost?: true
}

/** What the keyboard shows on its keys, key by key. */
export interface KeyStates {
  readonly marks?: ReadonlyMap<Midi, KeyMark>
  /** Keys shown in the action's yellow: the chord a Name chord question plays. */
  readonly lit?: ReadonlySet<Midi>
  /** A quiz's chosen keys. */
  readonly selected?: ReadonlySet<Midi>
  /** An answer's missing keys. */
  readonly outlined?: ReadonlySet<Midi>
  /** A wrong key in Wait mode, the extra keys of a quiz answer. */
  readonly wrong?: ReadonlySet<Midi>
  /** Keys down: sounding now, or held on a MIDI keyboard. */
  readonly down?: ReadonlySet<Midi>
}

/** What a key may carry besides its marks: its note's name, and a letter of the computer keyboard. */
export interface KeyText {
  readonly namedKeys: NamedKeys
  readonly letters?: ReadonlyMap<Midi, string> | undefined
  /** A marked key names its note under its label. */
  readonly markNotes: boolean
}

export type KeyFill = 'white' | 'black' | 'lit' | 'selected' | 'wrong' | KeyTone

/** A key's label: a mark's own (a degree, ✓, a note the Player spells), ✕ on a wrong key, or its note's name, drawn smaller. */
export interface KeyLabel {
  readonly kind: 'mark' | 'name'
  readonly text: string
  /** A mark's second line, over its text. */
  readonly caption?: string
  /** A mark's note, under its text. */
  readonly note?: string
  /** A voice's letter left behind on the key it moved from: drawn faint. */
  readonly ghost?: true
}

/** One key's face: its fill, whether it is down or outlined, its label and its letter. */
export interface KeyLook {
  readonly fill: KeyFill
  readonly down: boolean
  readonly outlined: boolean
  readonly label?: KeyLabel
  readonly letter?: string
}

function fillOf(key: Midi, states: KeyStates, mark: KeyMark | undefined): KeyFill {
  if (states.wrong?.has(key)) return 'wrong'
  if (states.lit?.has(key)) return 'lit'
  if (mark && !mark.ghost) return mark.tone
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

/** A wrong key's own mark where nothing else labels it: crimson is never its only cue. */
const WRONG_MARK = '✕'

function labelOf(
  key: Midi,
  mark: KeyMark | undefined,
  wrong: boolean,
  text: KeyText,
): KeyLabel | undefined {
  if (mark?.label) {
    return {
      kind: 'mark',
      text: mark.label,
      ...(mark.caption ? { caption: mark.caption } : {}),
      ...(mark.note && text.markNotes ? { note: mark.note } : {}),
      ...(mark.ghost ? { ghost: true as const } : {}),
    }
  }
  if (wrong) return { kind: 'mark', text: WRONG_MARK }
  const name = nameOf(key, text.namedKeys)
  return name === undefined ? undefined : { kind: 'name', text: name }
}

/** A chord's or a scale's tone marked on its key: its role's colour (or `tone`), its degree and its spelled note. */
export const toneMark = (
  tone: Pick<Tone, 'role' | 'degree' | 'note'>,
  face: KeyTone = tone.role,
): KeyMark => ({ tone: face, label: tone.degree, note: noteName(tone.note) })

/** How a key looks: a wrong key over a lit one, a lit one over a mark, a mark over a selection; down over all. */
export function keyLook(key: Midi, states: KeyStates, text: KeyText): KeyLook {
  const mark = states.marks?.get(key)
  const label = labelOf(key, mark, states.wrong?.has(key) ?? false, text)
  const letter = text.letters?.get(key)
  return {
    fill: fillOf(key, states, mark),
    down: states.down?.has(key) ?? false,
    outlined: states.outlined?.has(key) ?? false,
    ...(label ? { label } : {}),
    ...(letter ? { letter } : {}),
  }
}

/** The words a key's state is said in, after its note. */
export type KeyStateWords = Readonly<Record<'wrong' | 'missing' | 'lit', string>> & {
  /** Each chord tone's role in words: a mark's numeral alone (1, ♭7) says little aloud. */
  readonly roles: Readonly<Record<ChordRole, string>>
}

const isChordRole = (fill: KeyFill): fill is ChordRole =>
  (CHORD_ROLES as readonly string[]).includes(fill)

/**
 * What a key says besides its note, for a screen reader: a chord tone's role, what its mark prints
 * (a numeral over its degree), and whether it is wrong, missing or the chord played. Empty where it says nothing more.
 */
export function keyDescription(look: KeyLook, words: KeyStateWords): string {
  const { label } = look
  const role = isChordRole(look.fill) ? [words.roles[look.fill]] : []
  const printed =
    label?.kind === 'mark' && label.text !== WRONG_MARK
      ? [...(label.caption ? [label.caption] : []), label.text]
      : []
  const states = [
    ...(look.fill === 'wrong' ? [words.wrong] : []),
    ...(look.fill === 'lit' ? [words.lit] : []),
    ...(look.outlined ? [words.missing] : []),
  ]
  return [...role, ...printed, ...states].join(', ')
}

/** Whether two looks draw the same key: `Key`'s memo compares every field a key shows. */
export const sameLook = (a: KeyLook, b: KeyLook): boolean =>
  a.fill === b.fill &&
  a.down === b.down &&
  a.outlined === b.outlined &&
  a.label?.kind === b.label?.kind &&
  a.label?.text === b.label?.text &&
  a.label?.caption === b.label?.caption &&
  a.label?.note === b.label?.note &&
  a.label?.ghost === b.label?.ghost &&
  a.letter === b.letter
