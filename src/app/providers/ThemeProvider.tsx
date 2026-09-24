import { type ReactNode, useLayoutEffect } from 'react'
import { selectTheme, useSettings } from '@/entities/settings'
import { DARK_QUERY, resolveTheme } from './resolve-theme'

/** Keeps `data-theme` on the saved theme; on "system" it follows the OS for as long as it stays so. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettings(selectTheme)

  useLayoutEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const paint = () => {
      document.documentElement.dataset.theme = resolveTheme(theme, media.matches)
    }
    paint()
    if (theme !== 'system') return
    media.addEventListener('change', paint)
    return () => media.removeEventListener('change', paint)
  }, [theme])

  return children
}
