import { notate, type Score, type TimedMusic } from '@/shared/lib/notation'

/** How many lines' scores are kept: a long song's, and the versions just written. */
const KEPT = 400

/**
 * Lines written as scores, the same music always the same score: a line whose music did not change is
 * never engraved again.
 */
export function createLineScores(): (music: TimedMusic) => Score {
  const written = new Map<string, Score>()
  return (music) => {
    const key = JSON.stringify(music)
    const known = written.get(key)
    if (known) return known
    const score = notate(music)
    written.set(key, score)
    if (written.size > KEPT) {
      const [oldest] = written.keys()
      if (oldest !== undefined) written.delete(oldest)
    }
    return score
  }
}
