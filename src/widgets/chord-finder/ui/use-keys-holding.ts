import { keysHolding, type FoundChord } from '@/shared/lib/music'

/** The keys that hold the chord found (piano.org's key finder), each with the chord's numeral there. */
export function useKeysHolding(found: FoundChord | undefined) {
  const { root, quality } = found?.chord ?? {}
  return root && quality ? keysHolding(root, quality) : []
}
