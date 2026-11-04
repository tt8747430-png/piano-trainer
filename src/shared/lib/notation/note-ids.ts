import type { Score } from './types'

/** Where a note is played: its onset and its key, as `tick:midi`. */
export const notePlace = (tick: number, midi: number): string => `${tick}:${midi}`

/**
 * The engraving's id of each note a score writes (`n-<staff>-<tick>-<i>`, as `scoreToMei` names
 * them), by where it is played (`notePlace`): the Player marks a take's verdicts on them (R29 B8).
 * A tied note's continuation is not its onset, and is left out.
 */
export function noteIds(score: Score): ReadonlyMap<string, readonly string[]> {
  const ids = new Map<string, string[]>()
  const continued = new Set<string>()
  for (const measure of score.measures) {
    for (const staff of score.staves) {
      for (const voice of measure.staves[staff] ?? []) {
        for (const event of voice.events) {
          if (event.kind !== 'notes') continue
          event.notes.forEach((written, i) => {
            const held = `${staff}:${written.midi}`
            const place = notePlace(event.tick, written.midi)
            if (!continued.has(held)) {
              const known = ids.get(place) ?? []
              known.push(`n-${staff}-${event.tick}-${i}`)
              ids.set(place, known)
            }
            if (written.tie) continued.add(held)
            else continued.delete(held)
          })
        }
      }
    }
  }
  return ids
}
