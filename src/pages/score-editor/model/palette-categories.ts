import { isHandLayer, type Layer } from '@/features/score-editor'
import { isOneOf } from '@/shared/lib'
import type { BarMarkChoice } from '@/features/score-editor'

/**
 * The palette's categories (spec 2026-10-23), one palette for every tool as Flat's is, each acting on
 * what is chosen: the notes' values and rhythm, their pitch, their marks and dynamics with the
 * hairpins, the slurs and octave lines; the bars chosen (added, removed, broken, their length, written
 * out), their clef, the song's key and time signature, barlines and repeats; text and the pedal; a
 * hand's fingering; and, in the chord names' row, the chords.
 */
export const PALETTE_CATEGORIES = [
  'notes',
  'pitch',
  'articulations',
  'dynamics',
  'lines',
  'bar',
  'clef',
  'key',
  'time',
  'repeats',
  'text',
  'fingering',
  'chords',
] as const
export type PaletteCategory = (typeof PALETTE_CATEGORIES)[number]

/** What acts on bars, in any row: the chord names' too. */
const BARS: readonly PaletteCategory[] = ['bar', 'key', 'time', 'repeats']
/** A hand's own: a clef change and fingers are the piano's staves'. */
const HANDS: readonly PaletteCategory[] = ['clef', 'fingering']

/** Whether a category works where the caret writes: greyed elsewhere, never hidden. */
export function categoryOpen(category: PaletteCategory, layer: Layer): boolean {
  if (BARS.includes(category)) return true
  if (layer === 'chords') return category === 'chords'
  if (category === 'chords') return false
  return HANDS.includes(category) ? isHandLayer(layer) : true
}

/** The categories whose tools act on notes chosen: greyed while none is. */
const ON_NOTES: readonly PaletteCategory[] = ['pitch', 'articulations', 'dynamics', 'lines', 'text']

/**
 * Why a category's tools are greyed (ADR 0096: each greyed key says it in its tooltip, its section
 * beside its name): written in the chord symbols, not on this staff, not a hand's staff, no note
 * chosen, or a whole chord chosen where a finger goes on one note (ADR 0091).
 */
export type GreyedReason = 'chordRow' | 'staff' | 'hand' | 'chooseNote' | 'chordNote'

/** Why a category is closed where the caret writes, whatever is chosen; null where it is open. */
export function closedBy(
  category: PaletteCategory,
  layer: Layer,
): 'chordRow' | 'staff' | 'hand' | null {
  if (categoryOpen(category, layer)) return null
  if (category === 'chords') return 'chordRow'
  return layer === 'chords' ? 'staff' : 'hand'
}

/** Why a category's tools are greyed where the caret is, given what is chosen; null where they work. */
export function greyedBy(
  category: PaletteCategory,
  where: { readonly layer: Layer; readonly chosen: boolean; readonly fingerable: boolean },
): GreyedReason | null {
  const closed = closedBy(category, where.layer)
  if (closed) return closed
  if (ON_NOTES.includes(category) && !where.chosen) return 'chooseNote'
  if (category === 'fingering' && !where.chosen) return 'chooseNote'
  if (category === 'fingering' && !where.fingerable) return 'chordNote'
  return null
}

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
