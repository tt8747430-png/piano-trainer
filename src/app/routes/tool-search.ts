import type { ChordFinderView } from '@/pages/chord-finder'
import { keyListParam, readKeyList } from '@/shared/lib'
import { keyParam } from '@/shared/lib/music'
import { C_MAJOR_PARAM, readKey, routeSearch, type Raw } from './read-search'

// The Chord finder (ADR 0054): the keys tapped, a chord to send as a link, and the key it is spelled in.
export const CHORD_FINDER_DEFAULTS: ChordFinderView = { keys: '', key: C_MAJOR_PARAM }
export function readChordFinderSearch(raw: Raw): ChordFinderView {
  const key = readKey(raw.key)
  return {
    keys: keyListParam(readKeyList(raw.keys)),
    key: key ? keyParam(key) : CHORD_FINDER_DEFAULTS.key,
  }
}
export const chordFinderSearch = routeSearch(readChordFinderSearch, CHORD_FINDER_DEFAULTS)
/** What the Chord finder keeps when it is opened plainly: the key it spells in. */
export const CHORD_FINDER_KEPT = ['key'] as const satisfies readonly (keyof ChordFinderView)[]
