import { type ReactNode, useLayoutEffect } from 'react'
import { resolveTheme, selectTheme, useSettings } from '@/entities/settings'
import { BAR_COLORS, THEME_COLORS } from '@/shared/config'
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
    const root = document.documentElement
    root.dataset.theme = painted
    // One colour per scheme is declared in index.html; a chosen theme overrides both. A screen whose
    // own bar continues into the status bar (`data-status-bar="card"`, PhoneBand) paints it its bar's.
    const paint = () => {
      const colour = root.dataset.statusBar === 'card' ? BAR_COLORS[painted] : THEME_COLORS[painted]
      for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
        meta.content = colour
      }
    }
    paint()
    const watch = new MutationObserver(paint)
    watch.observe(root, { attributeFilter: ['data-status-bar'] })
    return () => watch.disconnect()
  }, [painted])

  return children
}
