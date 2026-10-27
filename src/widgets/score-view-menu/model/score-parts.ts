/**
 * What the sheet music shows besides its staves, each a switch in the View, in the order offered
 * (ADR 0108): the chord symbols, the chord positions beside them, the words, the fingers and the
 * notes' names. The Player's sheet music has every one.
 */
export const SHEET_PARTS = ['chordNames', 'positions', 'lyrics', 'fingers', 'noteNames'] as const
export type SheetPart = (typeof SHEET_PARTS)[number]

/**
 * What a score prints, the editor's View's alone: the chord positions and the notes' names are what
 * only practice shows (ADR 0114).
 */
export const PRINTED_PARTS = [
  'chordNames',
  'lyrics',
  'fingers',
] as const satisfies readonly SheetPart[]
