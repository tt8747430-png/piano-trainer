import { createContext, useContext } from 'react'

/** What a canvas brings into sight: an element of it, or a box on the screen (the room ahead of a playhead). */
export type Revealed =
  | Element
  | { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number }

export const RevealContext = createContext<((revealed: Revealed) => void) | null>(null)

/**
 * What brings an element of the canvas into sight (the caret's line, the line playing), or a box on
 * the screen, inside a `PageCanvas` (ADR 0075); null outside one, where the element scrolls into view
 * as a page's does.
 */
export const useCanvasReveal = () => useContext(RevealContext)
