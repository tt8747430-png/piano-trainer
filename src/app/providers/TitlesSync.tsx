import { useLayoutEffect } from 'react'
import { selectTitles, useSettings } from '@/entities/settings'

/** Keeps `data-titles` on the saved title size: `theme.css` makes every screen's title small by it. */
export function TitlesSync() {
  const titles = useSettings(selectTitles)
  useLayoutEffect(() => {
    document.documentElement.dataset.titles = titles
  }, [titles])
  return null
}
