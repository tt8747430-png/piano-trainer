import { useSearch } from '@tanstack/react-router'
import { libraryProgression } from '@/entities/progression-library'
import { useSetSearch } from '@/shared/lib'
import { keyFromParam, numeralsLine, parseNumerals } from '@/shared/lib/music'
import type { ProgressionsView } from '@/widgets/progression-explorer'
import { ProgressionScreen } from './ProgressionScreen'

/**
 * A line of chords typed (`/practice/progressions/line`, ADR 0052, R30-4): numerals in a key, all in
 * its URL, read and changed on its page and kept in Mine from its bar. A line the library has is
 * named as the library names it, with its ♡.
 */
export function ProgressionLinePage() {
  const view = useSearch({ from: '/shell/practice/progressions/line' })
  const set = useSetSearch<ProgressionsView>()
  const named = libraryProgression(view.p, keyFromParam(view.key).minor)
  return (
    <ProgressionScreen
      shown={{
        kind: 'line',
        title: numeralsLine(parseNumerals(view.p) ?? []),
        ...(named ? { named } : {}),
      }}
      view={view}
      onChange={(next) => set(next)}
    />
  )
}
