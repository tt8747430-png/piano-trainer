import { createContext, use } from 'react'

/**
 * How a picker's signs are laid out (R31-E): `grid`, its bordered grid with what it asks besides (a
 * key's mode, a clef's reach); `row`, its signs alone in one row, as the score editor's folded
 * palette shows them (Flat's).
 */
export type PickerLayout = 'grid' | 'row'

export const PickerLayoutContext = createContext<PickerLayout>('grid')

/** How the pickers around lay their signs out. */
export const usePickerLayout = (): PickerLayout => use(PickerLayoutContext)
