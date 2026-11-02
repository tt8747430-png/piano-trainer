import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { OPEN_PLAINLY } from '@/shared/lib'
import { useSearchPalette } from '@/widgets/search-palette'

/**
 * Search's link (rule 27): `/search?q=` is no page of its own. It opens the Search palette on what it
 * names, over Learn, in its own place in the history.
 */
export function SearchPage() {
  const { q } = useSearch({ from: '/shell/search' })
  const palette = useSearchPalette()
  const navigate = useNavigate()
  useEffect(() => {
    palette.open(q)
    void navigate({ to: '/', replace: true, state: OPEN_PLAINLY })
  }, [palette, q, navigate])
  return null
}
