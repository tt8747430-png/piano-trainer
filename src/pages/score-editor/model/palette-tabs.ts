import { isHandLayer, type Layer } from '@/features/score-editor'

/**
 * The kinds of the palette's tools, as tabs: what is done to the notes at the caret (their values and
 * rhythm, their pitch, their marks, their dynamics, a hand's fingers). What is added to the score
 * (bars, lines, signatures, staves) is the + menu's; in the chord names' row the palette is theirs.
 */
export const PALETTE_TABS = ['notes', 'pitch', 'articulations', 'dynamics', 'hand'] as const
export type PaletteTab = (typeof PALETTE_TABS)[number]

/** Whether a tab's tools work where the caret writes: a hand's own only in a hand. */
export const tabOpen = (tab: PaletteTab, layer: Layer): boolean =>
  tab === 'hand' ? isHandLayer(layer) : layer !== 'chords'

/** The tab shown: the one chosen while its tools work there, else the notes'. */
export const shownTab = (chosen: PaletteTab, layer: Layer): PaletteTab =>
  tabOpen(chosen, layer) ? chosen : 'notes'

/**
 * The ways the palette writes a chord in the chord names' row (ADR 0065): tapped from the key's, built
 * from its root, quality and bass, or typed on the chord keypad.
 */
export const CHORD_TABS = ['key', 'build', 'type'] as const
export type ChordTab = (typeof CHORD_TABS)[number]
