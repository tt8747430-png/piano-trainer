import type { Draft } from '@/features/score-editor'
import { notate, type Score } from '@/shared/lib/notation'
import { lineMusic, oneLine } from './line-music'

/**
 * The whole draft as one score, as a printed page lays it out (A40, the Layout's preview): every bar
 * from the first, its words unless the View hides them; none for a draft of no bars.
 */
export function wholeScore(draft: Draft, lyrics = true): Score | null {
  const [line] = oneLine(draft)
  return line ? notate(lineMusic(draft, line, lyrics)) : null
}
