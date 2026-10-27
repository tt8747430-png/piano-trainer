import type { Layer } from '@/features/score-editor'
import { isOneOf } from '@/shared/lib'
import type { BarMarkChoice } from '@/features/score-editor'

/**
 * The palette's categories (spec 2026-10-23), one palette for every tool as Flat's is, each acting on
 * what is chosen: the notes' values and rhythm, their pitch, their marks and dynamics with the
 * hairpins, the slurs and octave lines; the bars chosen (added, removed, broken, their length, written
 * out), their clef, the song's key and time signature, barlines and repeats; text and the pedal. What
 * is typed where it prints (ADR 0096) and opened by no tap on the sheet is a key among its kin: the
 * lyrics in Text & pedal, the fingering in Articulations (ADR 0114).
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
] as const
export type PaletteCategory = (typeof PALETTE_CATEGORIES)[number]

/** What works in any row: what acts on bars, the chord names' too. */
const ANY_ROW: readonly PaletteCategory[] = ['bar', 'key', 'time', 'repeats']

/**
 * Whether a category works where the caret writes: greyed elsewhere, never hidden. On a staff every
 * one does, a single staff's clef its whole staff's (ADR 0097).
 */
export const categoryOpen = (category: PaletteCategory, layer: Layer): boolean =>
  ANY_ROW.includes(category) || layer !== 'chords'

/** The categories whose tools act on notes chosen: greyed while none is. */
const ON_NOTES: readonly PaletteCategory[] = ['pitch', 'articulations', 'dynamics', 'lines', 'text']

/**
 * Why a category's tools are greyed (ADR 0096: each greyed key says it in its tooltip, its section
 * beside its name): not on a staff, no note chosen.
 */
export type GreyedReason = 'staff' | 'chooseNote'

/** Why a category is closed where the caret writes, whatever is chosen; null where it is open. */
export const closedBy = (category: PaletteCategory, layer: Layer): 'staff' | null =>
  categoryOpen(category, layer) ? null : 'staff'

/** Why a category's tools are greyed where the caret is, given what is chosen; null where they work. */
export function greyedBy(
  category: PaletteCategory,
  where: { readonly layer: Layer; readonly chosen: boolean },
): GreyedReason | null {
  const closed = closedBy(category, where.layer)
  if (closed) return closed
  return ON_NOTES.includes(category) && !where.chosen ? 'chooseNote' : null
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
