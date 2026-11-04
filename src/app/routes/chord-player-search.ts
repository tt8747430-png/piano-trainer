import { keyParam } from '@/shared/lib/music'
import type { ChordPlayerSettingsView, ChordPlayerView } from '@/widgets/chord-player'
import { readKey, readNumerals, routeSearch, type Raw } from './read-search'

// The Chord player (R29 CP1, CP5): a saved sheet by its id; on arrival a progression or a shared
// sheet's text, read once by the page and dropped.

const SHEET_ID = /^sheet-\d+$/
/** A shared sheet's text, at most this long: a sheet of twelve full sections fits. */
const SHARE_MAX = 4000

const sheetOf = (raw: unknown) => (typeof raw === 'string' && SHEET_ID.test(raw) ? raw : undefined)

export function readChordPlayerSearch(raw: Raw): ChordPlayerView {
  const key = readKey(raw.key)
  const p = readNumerals(raw.p, '')
  return {
    sheet: sheetOf(raw.sheet),
    p: p === '' ? undefined : p,
    key: key ? keyParam(key) : undefined,
    share:
      typeof raw.share === 'string' && raw.share.length <= SHARE_MAX && raw.share.trim() !== ''
        ? raw.share
        : undefined,
  }
}
export const chordPlayerSearch = routeSearch(readChordPlayerSearch, {})

export const readChordPlayerSettingsSearch = (raw: Raw): ChordPlayerSettingsView => ({
  sheet: sheetOf(raw.sheet),
})
export const chordPlayerSettingsSearch = routeSearch(readChordPlayerSettingsSearch, {})
