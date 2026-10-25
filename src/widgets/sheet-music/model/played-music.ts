import type { Performance } from '@/shared/lib/arrangement'
import type { TimedMusic } from '@/shared/lib/notation'

/**
 * The music the Player's sheet writes: the performance itself, its single staves over the piano as
 * the song writes them, heard or not (ADR 0097); the piano's staves left out of a lead sheet (`piano`
 * off, ADR 0083); its words left out where the View hides them (`lyrics` off, ADR 0093).
 */
export function playedMusic(
  performance: Performance,
  { lyrics = true, piano = true }: { readonly lyrics?: boolean; readonly piano?: boolean } = {},
): TimedMusic {
  if (lyrics && piano) return performance
  return {
    ...performance,
    ...(piano ? {} : { piano: false }),
    notes: lyrics
      ? performance.notes
      : performance.notes.map(({ lyrics: _sung, ...silent }) => silent),
  }
}
