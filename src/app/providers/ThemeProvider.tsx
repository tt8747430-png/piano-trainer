import { type ReactNode, useLayoutEffect } from 'react'
import { resolveTheme, selectTheme, useSettings } from '@/entities/settings'
import { THEME_COLORS } from '@/shared/config'
import { useMediaQuery } from '@/shared/lib'

const DARK_SCHEME = '(prefers-color-scheme: dark)'

/**
 * Keeps `data-theme` and the browser toolbar's colour on the saved theme; on "system" it follows the
 * OS. index.html's #theme-boot script paints the same theme before React loads.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettings(selectTheme)
  const prefersDark = useMediaQuery(DARK_SCHEME)
  const painted = resolveTheme(theme, prefersDark)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = painted
    // One colour per scheme is declared in index.html; a chosen theme overrides both.
    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
      meta.content = THEME_COLORS[painted]
    }
  }, [painted])

  return children
}
