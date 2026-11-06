import type { Layer } from '@/features/score-editor'
import { isOneOf } from '@/shared/lib'
import type { BarMarkChoice } from '@/features/score-editor'

/**
 * The palette's categories in Flat's order (ADR 0114), one palette for every tool, each acting on what
 * is chosen: the notes (the editing modes, the values and rhythm, the accidentals), their pitch and
 * octave lines, articulations with the slur and the fingering, ornaments, dynamics with the hairpins
 * and the pedal; the bars chosen (added, removed, broken), their clef, the song's key and time
 * signature, barlines and repeats; text: the chord symbols, the lyrics and the expression words. What
 * is typed where it prints (ADR 0096) has its key among its kin. Only what acts where the caret is
 * and on what is chosen is shown, never greyed (R32-B).
 */
export const PALETTE_CATEGORIES = [
  'notes',
  'pitch',
  'articulations',
  'ornaments',
  'dynamics',
  'measures',
  'clef',
  'key',
  'time',
  'repeats',
  'text',
] as const
export type PaletteCategory = (typeof PALETTE_CATEGORIES)[number]
export const isPaletteCategory = isOneOf(PALETTE_CATEGORIES)

/** What works in any row: the note values (the chord row's lengths too) and what acts on bars. */
const ANY_ROW: readonly PaletteCategory[] = ['notes', 'measures', 'key', 'time', 'repeats']

/**
 * Whether a category acts where the caret writes (R32-B: shown there, else left out of the strip). On
 * a staff every one does, a single staff's clef its whole staff's (ADR 0097); in the chord row only
 * the values and what acts on bars.
 */
export const categoryOpen = (category: PaletteCategory, layer: Layer): boolean =>
  ANY_ROW.includes(category) || layer !== 'chords'

/** The categories in the strip where the caret writes, in Flat's order. */
export const openCategories = (layer: Layer): readonly PaletteCategory[] =>
  PALETTE_CATEGORIES.filter((category) => categoryOpen(category, layer))

/**
 * The categories whose every tool acts on notes chosen (R32-B): with none chosen, they say to choose
 * one in place of their tools.
 */
const ON_NOTES: readonly PaletteCategory[] = ['pitch', 'articulations', 'ornaments', 'dynamics']

/** Whether a category waits for a note to be chosen before it has a tool to show. */
export const needsNote = (category: PaletteCategory, chosen: boolean): boolean =>
  !chosen && ON_NOTES.includes(category)

/**
 * The repeats' marks a score prints as a sign or words (as `scoreToMei` prints them), which their
 * keys show as such rather than drawn over a bar.
 */
export const JUMP_SIGNS = {
  segno: '\u{1D10B}',
} as const satisfies Partial<Readonly<Record<BarMarkChoice, string>>>
/** The jumps printed as words. */
export const JUMP_WORDS = {
  toCoda: 'To Coda',
  fine: 'Fine',
  dc: 'D.C.',
  'dc-fine': 'D.C. al Fine',
  'dc-coda': 'D.C. al Coda',
  ds: 'D.S.',
  'ds-fine': 'D.S. al Fine',
  'ds-coda': 'D.S. al Coda',
} as const satisfies Partial<Readonly<Record<BarMarkChoice, string>>>
export type JumpWords = keyof typeof JUMP_WORDS
export const isJumpWords = isOneOf(Object.keys(JUMP_WORDS) as JumpWords[])
