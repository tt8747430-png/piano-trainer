import { createContext, use } from 'react'
import { modifierCaps, useShortcutsPlatform } from '@/shared/lib/shortcuts'
import { toolCaps, type Tool } from '../model/shortcuts'

/**
 * How the palette's keys are laid out where they stand (its canvas, Flat's): `grid`, a section's
 * tiles wrapping under its title, each key its picture alone, named in its tooltip; `bar`, one row
 * (the phone's folded palette), the sections' titles left out.
 */
export type PaletteForm = 'grid' | 'bar'

export const PaletteFormContext = createContext<PaletteForm>('grid')

/** How the keys around are laid out. */
export const usePaletteForm = (): PaletteForm => use(PaletteFormContext)

/**
 * Which side of a key its tooltip opens on (A34): under the toolbar at the screen's top, over the
 * keys at its foot, so a tooltip never covers the bar's words or the music.
 */
export const PaletteTipSide = createContext<'top' | 'bottom'>('top')

/** A key's tooltip, as Flat's: its name, then its shortcut in brackets where it has one. */
export function useKeyTip(label: string, tool?: Tool): string {
  const caps = modifierCaps(useShortcutsPlatform())
  return tool ? `${label} (${toolCaps(tool, caps).join(' ')})` : label
}
