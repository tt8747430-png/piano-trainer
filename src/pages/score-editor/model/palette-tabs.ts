import type { Layer } from '@/features/score-editor'

/**
 * The kinds of the palette's tools, as tabs: what is done to every note at the caret (their values
 * and rhythm, their pitch, their marks, their dynamics). What is added to the score (bars, lines,
 * signatures, staves, a hand's fingers and written bars) is the + menu's; in the chord names' row
 * the palette is theirs.
 */
export const PALETTE_TABS = ['notes', 'pitch', 'articulations', 'dynamics'] as const
export type PaletteTab = (typeof PALETTE_TABS)[number]

/** Whether the notes' tools work where the caret writes: in any row but the chord names'. */
export const tabOpen = (layer: Layer): boolean => layer !== 'chords'

/**
 * The ways the palette writes a chord in the chord names' row (ADR 0065): tapped from the key's, built
 * from its root, quality and bass, or typed on the chord keypad.
 */
export const CHORD_TABS = ['key', 'build', 'type'] as const
export type ChordTab = (typeof CHORD_TABS)[number]
