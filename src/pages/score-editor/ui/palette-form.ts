import { createContext, use } from 'react'

/**
 * How the palette's tools are laid out where they stand (ADR 0114): `row`, the folded palette's one
 * row, each key a 44px picture named in its tooltip, its group's name with it; `sections`, the opened
 * palette's sections and the sheet's popovers, keys in grids under their names, what a key holds said
 * on it.
 */
export type PaletteForm = 'row' | 'sections'

export const PaletteFormContext = createContext<PaletteForm>('sections')

/** How the tools around are laid out. */
export const usePaletteForm = (): PaletteForm => use(PaletteFormContext)

/** The name of the category a key of the row is in, for its tooltip (ADR 0114). */
export const PaletteGroupName = createContext<string | undefined>(undefined)

/** A key's tooltip: in the row, its group's name before its own. */
export function useKeyTip(label: string): string {
  const group = use(PaletteGroupName)
  return group ? `${group} · ${label}` : label
}
