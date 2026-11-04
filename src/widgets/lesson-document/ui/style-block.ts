import { createContext } from 'react'

/** Opens block `index`'s style in the style editor's sheet (R29 B9): its ⋯ › Style. */
export const StyleBlock = createContext<((index: number) => void) | null>(null)
