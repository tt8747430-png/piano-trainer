import { hasMethodCodes, pieceKey, type Piece } from '@/entities/piece'
import { ownChoice, type PracticeChoice, type PracticeMode } from '@/features/practice'
import { noteFromParam, noteParam, pitchClassOf, tonicSpelling } from '@/shared/lib/music'
import type { SetupChange, SetupParams } from '@/widgets/player-setup'

/** The Player's URL: the setup, and the mode it practises in. */
export type PlayerSearch = SetupParams & { readonly mode: PracticeMode }

/** The params that decide the arrangement; hands and tempo play the same arrangement differently. */
export type ArrangementParams = Pick<SetupParams, 'key' | 'pattern' | 'rh' | 'lh' | 'voicing'>

/** The Player's URL read against its piece: what the URL leaves out is the piece's own. */
export function resolveChoice(
  piece: Piece,
  search: ArrangementParams,
  melody: boolean,
): PracticeChoice {
  const own = ownChoice(piece)
  const { mode } = pieceKey(piece)
  const chartWithoutMethods = search.pattern === 'chart' && !hasMethodCodes(piece)
  return {
    tonic: search.key ? tonicSpelling(pitchClassOf(noteFromParam(search.key)), mode) : own.tonic,
    pattern: search.pattern === undefined || chartWithoutMethods ? own.pattern : search.pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    voicing:
      piece.kind === 'progression' && piece.voicing.choosable ? (search.voicing ?? null) : null,
    melody,
  }
}

/** A Setup change as the URL writes it: a key, tempo, pattern or voicing equal to the piece's own is left out. */
export function searchPatch(piece: Piece, change: SetupChange): SetupChange {
  const own = ownChoice(piece)
  const ownVoicing = piece.kind === 'progression' ? piece.voicing.default : undefined
  const unlessOwn = <V>(value: V, ownValue: V): V | undefined =>
    value === ownValue ? undefined : value
  return {
    ...change,
    ...('key' in change ? { key: unlessOwn(change.key, noteParam(own.tonic)) } : {}),
    ...('tempo' in change ? { tempo: unlessOwn(change.tempo, piece.tempo) } : {}),
    ...('pattern' in change ? { pattern: unlessOwn(change.pattern, own.pattern) } : {}),
    ...('voicing' in change ? { voicing: unlessOwn(change.voicing, ownVoicing) } : {}),
  }
}
