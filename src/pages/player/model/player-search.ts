import { hasMethodCodes, pieceKey, type Piece } from '@/entities/piece'
import { ownChoice, type PracticeChoice, type PracticeMode } from '@/features/practice'
import { noteFromParam, noteParam, pitchClassOf, tonicSpelling } from '@/shared/lib/music'
import type { SetupChange, SetupParams } from '@/widgets/player-setup'

/** The Player's URL: the setup, and the mode it practises in. */
export type PlayerSearch = SetupParams & { readonly mode: PracticeMode }

/** The params that decide the arrangement; hands and tempo play the same arrangement differently. */
export type ArrangementParams = Pick<SetupParams, 'key' | 'pattern' | 'rh' | 'lh' | 'chordSize'>

/** The Player's URL read against its piece: what the URL leaves out is the piece's own. */
export function resolveChoice(
  piece: Piece,
  search: ArrangementParams,
  melody: boolean,
): PracticeChoice {
  const own = ownChoice(piece)
  const { minor } = pieceKey(piece)
  const chartWithoutMethods = search.pattern === 'chart' && !hasMethodCodes(piece)
  return {
    tonic: search.key ? tonicSpelling(pitchClassOf(noteFromParam(search.key)), minor) : own.tonic,
    pattern: search.pattern === undefined || chartWithoutMethods ? own.pattern : search.pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    chordSize:
      piece.kind === 'progression' && piece.chordSize.choosable ? (search.chordSize ?? null) : null,
    melody,
  }
}

/** A Setup change as the URL writes it: a key, tempo, pattern or chord size equal to the piece's own is left out. */
export function searchPatch(piece: Piece, change: SetupChange): SetupChange {
  const own = ownChoice(piece)
  const ownChordSize = piece.kind === 'progression' ? piece.chordSize.default : undefined
  const unlessOwn = <V>(value: V, ownValue: V): V | undefined =>
    value === ownValue ? undefined : value
  return {
    ...change,
    ...('key' in change ? { key: unlessOwn(change.key, noteParam(own.tonic)) } : {}),
    ...('tempo' in change ? { tempo: unlessOwn(change.tempo, piece.tempo) } : {}),
    ...('pattern' in change ? { pattern: unlessOwn(change.pattern, own.pattern) } : {}),
    ...('chordSize' in change ? { chordSize: unlessOwn(change.chordSize, ownChordSize) } : {}),
  }
}
