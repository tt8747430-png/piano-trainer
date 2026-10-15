import type { Midi } from '@/shared/lib/music'

/** The chords played, oldest first, and the keys down now (ADR 0054). */
export interface ChordLog {
  readonly chords: readonly (readonly Midi[])[]
  /** The keys down when the log last heard. */
  readonly held: readonly Midi[]
  /** Whether a key of the newest chord has been let go: then a key struck starts the next. */
  readonly letGo: boolean
}

export const EMPTY_LOG: ChordLog = { chords: [], held: [], letGo: true }

/** The newest chord and the five before it. */
export const LOGGED_CHORDS = 6

const lowestFirst = (keys: Iterable<Midi>): Midi[] => [...new Set(keys)].sort((a, b) => a - b)

/**
 * The log once the keys down are `keys`: a key added while every key stays down grows the newest
 * chord (a chord is rarely struck at once); keys let go change no chord (it stays read); a key struck
 * after one was let go starts the next chord.
 */
export function logKeys(log: ChordLog, keys: readonly Midi[]): ChordLog {
  const held = lowestFirst(keys)
  const added = held.some((key) => !log.held.includes(key))
  const removed = log.held.some((key) => !held.includes(key))
  if (!added) return { chords: log.chords, held, letGo: log.letGo || removed }
  const newest = log.chords.at(-1)
  if (newest && !log.letGo && !removed)
    return {
      chords: [...log.chords.slice(0, -1), lowestFirst([...newest, ...held])],
      held,
      letGo: false,
    }
  return { chords: [...log.chords, held].slice(-LOGGED_CHORDS), held, letGo: false }
}
