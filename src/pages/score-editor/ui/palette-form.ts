import { createContext, use } from 'react'
import { modifierCaps, useShortcutsPlatform } from '@/shared/lib/shortcuts'
import type { PaletteCategory } from '../model/palette-categories'
import { toolCaps, type Tool } from '../model/shortcuts'

/**
 * How the palette's keys are laid out where they stand (ADR 0114, Flat's): `grid`, a section's
 * bordered table of square cells, each its picture alone, named in its tooltip; `list`, the phone's
 * list mode, each key its picture and its name in two columns; `bar`, the note-entry toolbar over the
 * sheet (a laptop) or the sheet's quick row (a phone), the everyday tools in one row.
 */
export type PaletteForm = 'grid' | 'list' | 'bar'

export const PaletteFormContext = createContext<PaletteForm>('grid')

/** How the keys around are laid out. */
export const usePaletteForm = (): PaletteForm => use(PaletteFormContext)

/**
 * Where the palette stands (ADR 0114): `panel`, docked at the sheet's left, its sections folding
 * one by one; `sheet`, docked at the sheet's foot, its sections stacked under a bar of categories.
 */
export type PaletteDock = 'panel' | 'sheet'

export const PaletteDockContext = createContext<PaletteDock>('sheet')

/** Where the palette around stands. */
export const usePaletteDock = (): PaletteDock => use(PaletteDockContext)

/** A key's tooltip, as Flat's: its name, then its shortcut in brackets where it has one. */
export function useKeyTip(label: string, tool?: Tool): string {
  const caps = modifierCaps(useShortcutsPlatform())
  return tool ? `${label} (${toolCaps(tool, caps).join(' ')})` : label
}

/** What the sections folded open are in the panel, and how one is folded or opened (ADR 0114). */
export const PanelSections = createContext<{
  readonly open: ReadonlySet<PaletteCategory>
  readonly toggle: (category: PaletteCategory) => void
}>({ open: new Set(), toggle: () => {} })
