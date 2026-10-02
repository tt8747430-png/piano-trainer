import { pitchClassOf } from '@/shared/lib/music'
import { barTicksOf } from './chart'
import { entryById, selectVersion, versionableEntry } from './selectors'
import { pieceKey, isPiece, type ChartPiece, type Entry, type Listing, type Piece } from './types'
import { withMusic, type PieceMusic } from './music'
import { isOwnSongId, type OwnSong } from './own'
import type { PiecesState } from './store'

/** The pieces a learner can play: the catalog's in their versions, and their own songs (spec §2). */
export interface Repertoire {
  /** A catalog entry in the learner's version, or an own song. */
  entry(id: string): Entry | undefined
  /** The same, where it opens in the Player. */
  piece(id: string): Piece | undefined
  /** The catalog's own entry: what Reset to the original brings back. */
  original(id: string): Entry | undefined
  readonly ownSongs: readonly ChartPiece[]
}

/** Whether the music keeps the original's timeline: its key, meter and every bar's length. */
function sameTimeline(original: ChartPiece, version: ChartPiece): boolean {
  const [a, b] = [pieceKey(original), pieceKey(version)]
  if (pitchClassOf(a.tonic) !== pitchClassOf(b.tonic) || a.minor !== b.minor) return false
  if (original.meter !== version.meter) return false
  const [before, after] = [barTicksOf(original), barTicksOf(version)]
  return before.length === after.length && before.every((ticks, i) => ticks === after[i])
}

/**
 * A catalog song, study or listing played in the learner's music: its titles, credits, source and note
 * kept; a listing becomes a song; a recording kept only on the original's timeline.
 */
export function versionOf(original: ChartPiece | Listing, music: PieceMusic): ChartPiece {
  if (original.kind === 'listing') return { ...original, ...music, kind: 'song' }
  const { recording, ...piece } = withMusic(original, music)
  return recording && sameTimeline(original, { ...piece, recording })
    ? { ...piece, recording }
    : piece
}

const ownPiece = (song: OwnSong): ChartPiece => ({ ...song, kind: 'song' })

export function repertoire({
  versions,
  songs,
}: Pick<PiecesState, 'versions' | 'songs'>): Repertoire {
  const own = new Map(songs.map((song) => [song.id, ownPiece(song)]))
  // Each version is worked out once, so a screen's memos over it hold.
  const played = new Map<string, ChartPiece>()
  const entry = (id: string): Entry | undefined => {
    const mine = isOwnSongId(id) ? own.get(id) : undefined
    if (mine) return mine
    const original = versionableEntry(id)
    const music = selectVersion({ versions }, id)
    if (!original || !music) return entryById(id)
    const known = played.get(id)
    if (known) return known
    const version = versionOf(original, music)
    played.set(id, version)
    return version
  }
  return {
    entry,
    piece: (id) => {
      const found = entry(id)
      return found && isPiece(found) ? found : undefined
    },
    original: entryById,
    ownSongs: [...own.values()],
  }
}
