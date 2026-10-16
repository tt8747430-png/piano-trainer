/** The keyboard settings' choices, as the presentational keyboard takes them; the settings entity saves them. */
export const KEY_SIZES = ['piano', 'fit', 'large'] as const
/**
 * How wide the white keys are, smallest first: the whole piano fills the width, the range fills it,
 * or large keys.
 */
export type KeySize = (typeof KEY_SIZES)[number]

/** The key size a zoom step out (−1) or in (1) from `size`; null at either end. */
export function zoomKeySize(size: KeySize, by: -1 | 1): KeySize | null {
  return KEY_SIZES[KEY_SIZES.indexOf(size) + by] ?? null
}

export const SWIPES = ['scroll', 'glissando'] as const
/** What a finger sliding over the keys does: scroll the keyboard, or play each key it crosses. */
export type Swipe = (typeof SWIPES)[number]

export const NAMED_KEYS = ['c', 'all', 'none'] as const
/** Which keys carry their note's name: every C, every key, or none. */
export type NamedKeys = (typeof NAMED_KEYS)[number]

/** The choice after `named`, going round. */
export function nextNamedKeys(named: NamedKeys): NamedKeys {
  return NAMED_KEYS[(NAMED_KEYS.indexOf(named) + 1) % NAMED_KEYS.length] ?? named
}

export const KEY_DOCKS = ['bottom', 'top'] as const
/** Where a page's keys stay while it scrolls: over the tab bar, or under the screen's bar. */
export type KeyDock = (typeof KEY_DOCKS)[number]

export const KEY_LENGTHS = ['long', 'short'] as const
/** How long the keys are: a piano's proportion, or short, leaving the page more of the screen. */
export type KeyLength = (typeof KEY_LENGTHS)[number]

/**
 * The controls the keys' rail can hold, in its order: how the keys look (their size, the note names,
 * the chord a hand holds, the typing letters), then how they play (a MIDI keyboard's sound,
 * glissando, the pedal). The learner keeps on it the ones they want.
 */
export const RAIL_CONTROLS = [
  'zoom',
  'noteNames',
  'chordNames',
  'typing',
  'midiSound',
  'glissando',
  'pedal',
] as const
export type RailControl = (typeof RAIL_CONTROLS)[number]

/** A saved list of the rail's controls: each one it names, once, in the rail's order; else `current`. */
export function railControls(value: unknown, current: readonly RailControl[]): RailControl[] {
  if (!Array.isArray(value)) return [...current]
  return RAIL_CONTROLS.filter((control) => value.includes(control))
}
