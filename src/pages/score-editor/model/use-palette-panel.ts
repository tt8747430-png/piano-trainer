import { useMediaQuery } from '@/shared/lib'

/**
 * Room for the palette's panel beside the sheet: 48rem across, a tablet's and a laptop's at any
 * window size, and a phone on its side's, whose height is too short for a sheet at the foot. Width
 * alone decides, not the pointer: a tablet's finger needs the panel as much as a laptop's mouse.
 */
const PANEL_ROOM = '(min-width: 48rem)'

/**
 * Whether the palette is a panel docked at the sheet's left (ADR 0114, Flat's desktop), with the
 * note-entry toolbar over the sheet; else a sheet docked at its foot (Flat's phone).
 */
export function usePalettePanel(): boolean {
  return useMediaQuery(PANEL_ROOM)
}
