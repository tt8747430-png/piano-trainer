/** The keyboard settings' choices, as the presentational keyboard takes them; the settings entity saves them. */
export const KEY_SIZES = ['piano', 'fit', 'large'] as const
/**
 * How wide the white keys are, smallest first (R34): all 88 keys fill the width and never scroll
 * (Songscription's), the music's range fills it (the default, as the canvas's Piano sheet's Range),
 * or large keys; the last two scroll to follow the music.
 */
export type KeySize = (typeof KEY_SIZES)[number]

export const SWIPES = ['scroll', 'glissando'] as const
/** What a finger sliding over the keys does: scroll the keyboard, or play each key it crosses. */
export type Swipe = (typeof SWIPES)[number]

export const NAMED_KEYS = ['c', 'all', 'none'] as const
/** Which keys carry their note's name: every C, every key, or none. */
export type NamedKeys = (typeof NAMED_KEYS)[number]

export const CHORD_LABELS = ['names', 'degrees', 'intervals', 'fingers', 'none'] as const
/**
 * What a chord's keys and the heads on its staff carry (canvas 89, 151): each note's name, its degree
 * in the chord, the interval up from the note below it, its finger, or nothing.
 */
export type ChordLabels = (typeof CHORD_LABELS)[number]

export const KEY_DOCKS = ['bottom', 'top'] as const
/** Where a page's keys stay while it scrolls: over the tab bar, or under the screen's bar. */
export type KeyDock = (typeof KEY_DOCKS)[number]

/**
 * The pedals the bar's Sustain works (R31-P, R34): the sustain pedal alone, or with the soft and
 * sostenuto pedals in its menu.
 */
export const PEDALS_SHOWN = ['sustain', 'all'] as const
export type PedalsShown = (typeof PEDALS_SHOWN)[number]
