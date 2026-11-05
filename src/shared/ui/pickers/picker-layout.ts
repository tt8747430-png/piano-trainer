import { createContext, use } from 'react'

/**
 * How a picker's signs are laid out (R31-E, R32-C): `grid`, its bordered grid with what it asks
 * besides (a key's mode), as a sheet or a new song shows it; `palette`, the score editor's palette's
 * section as Flat's, its signs bare in a table; `row`, its signs alone in one row, as the editor's
 * folded palette shows them (Flat's).
 */
export type PickerLayout = 'grid' | 'palette' | 'row'

export const PickerLayoutContext = createContext<PickerLayout>('grid')

/** How the pickers around lay their signs out. */
export const usePickerLayout = (): PickerLayout => use(PickerLayoutContext)
