import { isBlackKey, type ChordRole, type Midi } from '@/shared/lib/music'

/** A chord tone's role, a hand in the Player, or a scale's note (the palette law keeps roles on chord tones). */
export type KeyTone = ChordRole | 'rh' | 'lh' | 'melody' | 'scale'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
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
}

export type KeyFill = 'white' | 'black' | 'lit' | 'selected' | 'wrong' | Exclude<KeyTone, 'scale'>

/** One key's face: its fill, whether it is down, an outline, a scale's band, and its label. */
export interface KeyLook {
  readonly fill: KeyFill
  readonly down: boolean
  readonly outlined: boolean
  /** A scale's note: the key keeps its white or black and wears a band with the label. */
  readonly band: boolean
  readonly label?: string
}

function fillOf(key: Midi, states: KeyStates, mark: KeyMark | undefined): KeyFill {
  if (states.wrong?.has(key)) return 'wrong'
  if (states.lit?.has(key)) return 'lit'
  if (mark && mark.tone !== 'scale') return mark.tone
  if (states.selected?.has(key)) return 'selected'
  return isBlackKey(key) ? 'black' : 'white'
}

/** How a key looks: a wrong key over a lit one, a lit one over a mark, a mark over a selection; down over all. */
export function keyLook(key: Midi, states: KeyStates): KeyLook {
  const mark = states.marks?.get(key)
  return {
    fill: fillOf(key, states, mark),
    down: states.down?.has(key) ?? false,
    outlined: states.outlined?.has(key) ?? false,
    band: mark?.tone === 'scale',
    ...(mark?.label ? { label: mark.label } : {}),
  }
}

export const sameLook = (a: KeyLook, b: KeyLook): boolean =>
  a.fill === b.fill &&
  a.down === b.down &&
  a.outlined === b.outlined &&
  a.band === b.band &&
  a.label === b.label
