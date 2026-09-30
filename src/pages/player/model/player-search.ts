import { LEFT_FIGURES, RIGHT_FIGURES, splitsBeat } from '@/entities/pattern'
import { hasMethodCodes, pieceKey, type Piece } from '@/entities/piece'
import { ownChoice, type PracticeChoice } from '@/features/practice'
import { splitsTheBeat, type Figure } from '@/shared/lib/arrangement'
import {
  isCompound,
  noteFromParam,
  noteParam,
  pitchClassOf,
  tonicSpelling,
} from '@/shared/lib/music'
import type { SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import { ownLeftOut } from './own-left-out'

/** The Player's URL: how it goes, and the piece's own choices (spec §2.10). */
export type PlayerSearch = PracticeView & SetupParams

/**
 * The Player's URL read against its piece: what the URL leaves out is the piece's own, and so is a
 * pattern or figure that plays inside the beat in a piece in 6/8 or 12/8.
 */
export function resolveChoice(piece: Piece, search: SetupParams, melody: boolean): PracticeChoice {
  const own = ownChoice(piece)
  const { minor } = pieceKey(piece)
  const compound = isCompound(piece.meter)
  const chartWithoutMethods = search.pattern === 'chart' && !hasMethodCodes(piece)
  const pattern =
    search.pattern === undefined ||
    chartWithoutMethods ||
    (compound && search.pattern !== 'chart' && splitsBeat(search.pattern))
      ? own.pattern
      : search.pattern
  const fits = (figure: Figure) => !compound || !splitsTheBeat(figure)
  return {
    tonic: search.key ? tonicSpelling(pitchClassOf(noteFromParam(search.key)), minor) : own.tonic,
    pattern,
    rh: search.rh && fits(RIGHT_FIGURES[search.rh].figure) ? search.rh : null,
    lh: search.lh && fits(LEFT_FIGURES[search.lh].figure) ? search.lh : null,
    chordSize:
      piece.kind === 'progression' && piece.chordSize.choosable ? (search.chordSize ?? null) : null,
    melody,
  }
}

/** A Setup change as the URL writes it: a key, pattern or chord size equal to the piece's own is left out. */
export function searchPatch(piece: Piece, change: SetupChange): SetupChange {
  const own = ownChoice(piece)
  const written = ownLeftOut(change, {
    pattern: own.pattern,
    chordSize: piece.kind === 'progression' ? piece.chordSize.default : undefined,
  })
  return 'key' in change
    ? { ...written, key: change.key === noteParam(own.tonic) ? undefined : change.key }
    : written
}
