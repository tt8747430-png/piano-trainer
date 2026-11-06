import { createContext, type ReactNode } from 'react'

/**
 * The sheet's own tools for its one pill (the layout's choice): a page canvas puts them before its
 * zoom; a sheet that scrolls shows them in a pill of its own.
 */
export const SheetToolsContext = createContext<ReactNode>(null)
