/**
 * The face chord symbols are printed in over the sheet: Literata 600 at 17px, as the sheet's labels
 * set them (`font-display text-lg font-semibold`). The engraver leaves each symbol this much room.
 */
export const CHORD_SYMBOL_FONT = '600 17px "Literata Variable"'

let measuring: CanvasRenderingContext2D | null = null

/** A chord symbol's width in CSS pixels, in its face (loaded first: `loadMusicFonts`). */
export function chordSymbolWidth(symbol: string): number {
  measuring ??= document.createElement('canvas').getContext('2d')
  if (!measuring) throw new Error('No canvas to measure a chord symbol with')
  measuring.font = CHORD_SYMBOL_FONT
  return measuring.measureText(symbol).width
}
