import { keyParam } from '@/shared/lib/music'
import { CHORD_PANELS, type ChordPlayerView } from '@/widgets/chord-player'
import { readKey, readNumerals, routeSearch, type Raw } from './read-search'

// The Chord player (R29 CP1, CP5): a saved sheet by its id; on arrival a progression or a shared
// sheet's link (R39-10), read once by the page and dropped; the rail's panel and the keys hidden (R77).

const SHEET_ID = /^sheet-\d+$/
/** A shared sheet's link: the online sheet's id. */
const LINK_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/** A panel named in the URL; Chords, the rail's first, is said by none. */
function panelOf(raw: unknown) {
  for (const each of CHORD_PANELS) if (each !== 'chords' && each === raw) return each
  return undefined
}

const sheetOf = (raw: unknown) => (typeof raw === 'string' && SHEET_ID.test(raw) ? raw : undefined)

export function readChordPlayerSearch(raw: Raw): ChordPlayerView {
  const key = readKey(raw.key)
  const p = readNumerals(raw.p, '')
  return {
    sheet: sheetOf(raw.sheet),
    p: p === '' ? undefined : p,
    key: key ? keyParam(key) : undefined,
    link: typeof raw.link === 'string' && LINK_ID.test(raw.link) ? raw.link : undefined,
    panel: panelOf(raw.panel),
    keys: raw.keys === 'off' ? 'off' : undefined,
  }
}
export const chordPlayerSearch = routeSearch(readChordPlayerSearch, {})
