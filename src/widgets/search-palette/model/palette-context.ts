import { createContext, use } from 'react'

/** The Search palette's way in: open it over the screen, with what to search for already typed. */
export interface SearchPaletteControl {
  readonly open: (query?: string) => void
}

/** Outside the shell (the Player, a widget tested alone) there is no palette to open. */
export const SearchPaletteContext = createContext<SearchPaletteControl>({ open: () => undefined })

/** Opens the Search palette (rule 27): ⌘K, the sidebar's Search, a place's search button. */
export const useSearchPalette = (): SearchPaletteControl => use(SearchPaletteContext)
