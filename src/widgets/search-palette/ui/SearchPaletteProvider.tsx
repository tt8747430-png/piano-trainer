import { lazy, Suspense, useMemo, useState, type ReactNode } from 'react'
import { SearchPaletteContext, type SearchPaletteControl } from '../model/palette-context'

// The palette and the index it searches are a chunk of their own, loaded as it first opens.
const SearchPalette = lazy(() =>
  import('./SearchPalette').then(({ SearchPalette: palette }) => ({ default: palette })),
)

/**
 * Search as a tool over the screen (rule 27): the palette, opened from anywhere in the shell, its open
 * state the screen's own, so opening and closing it writes no history.
 */
export function SearchPaletteProvider({ children }: { children: ReactNode }) {
  // Each opening starts afresh, on what it was opened with.
  const [shown, setShown] = useState<{ readonly query: string; readonly n: number } | null>(null)
  const control = useMemo<SearchPaletteControl>(
    () => ({ open: (query = '') => setShown((was) => ({ query, n: (was?.n ?? 0) + 1 })) }),
    [],
  )
  return (
    <SearchPaletteContext value={control}>
      {children}
      {shown ? (
        <Suspense fallback={null}>
          <SearchPalette key={shown.n} initial={shown.query} onClose={() => setShown(null)} />
        </Suspense>
      ) : null}
    </SearchPaletteContext>
  )
}
