import { keyParam } from '@/shared/lib/music'
import type { ChordPlayerSettingsView, ChordPlayerView } from '@/widgets/chord-player'
import { readKey, readNumerals, routeSearch, type Raw } from './read-search'

// The Chord player (R29 CP1, CP5): a saved sheet by its id; on arrival a progression or a shared
// sheet's link (R39-10), read once by the page and dropped.

const SHEET_ID = /^sheet-\d+$/
/** A shared sheet's link: the online sheet's id. */
const LINK_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

const sheetOf = (raw: unknown) => (typeof raw === 'string' && SHEET_ID.test(raw) ? raw : undefined)

export function readChordPlayerSearch(raw: Raw): ChordPlayerView {
  const key = readKey(raw.key)
  const p = readNumerals(raw.p, '')
  return {
    sheet: sheetOf(raw.sheet),
    p: p === '' ? undefined : p,
    key: key ? keyParam(key) : undefined,
    link: typeof raw.link === 'string' && LINK_ID.test(raw.link) ? raw.link : undefined,
  }
}
export const chordPlayerSearch = routeSearch(readChordPlayerSearch, {})

export const readChordPlayerSettingsSearch = (raw: Raw): ChordPlayerSettingsView => ({
  sheet: sheetOf(raw.sheet),
})
export const chordPlayerSettingsSearch = routeSearch(readChordPlayerSettingsSearch, {})
