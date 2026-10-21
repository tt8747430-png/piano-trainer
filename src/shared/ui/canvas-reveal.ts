import { createContext, useContext } from 'react'

export const RevealContext = createContext<((element: Element) => void) | null>(null)

/**
 * What brings an element of the canvas into sight (the caret's line, the line playing), inside a
 * `PageCanvas` (ADR 0075); null outside one, where the element scrolls into view as a page's does.
 */
export const useCanvasReveal = () => useContext(RevealContext)
