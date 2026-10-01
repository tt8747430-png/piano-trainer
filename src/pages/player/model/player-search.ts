import { LEFT_FIGURES, playableFigure, playablePattern, RIGHT_FIGURES } from '@/entities/pattern'
import { choosableChordSize, pieceFit, pieceKey, type Piece } from '@/entities/piece'
import { ownChoice, type PracticeChoice } from '@/features/practice'
import { noteFromParam, noteParam, pitchClassOf, tonicSpelling } from '@/shared/lib/music'
import type { SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import { ownLeftOut } from './own-left-out'

/** The Player's URL: how it goes, and the piece's own choices (spec §2.10). */
export type PlayerSearch = PracticeView & SetupParams

/**
 * The Player's URL read against its piece: what the URL leaves out is the piece's own, and so is a
 * pattern or figure the piece cannot play (one that plays a tune it lacks, or inside the beat of
 * 6/8 or 12/8).
 */
export function resolveChoice(piece: Piece, search: SetupParams, melody: boolean): PracticeChoice {
  const own = ownChoice(piece)
  const fit = pieceFit(piece)
  const { minor } = pieceKey(piece)
  return {
    tonic: search.key ? tonicSpelling(pitchClassOf(noteFromParam(search.key)), minor) : own.tonic,
    pattern: playablePattern(search.pattern, own.pattern, fit),
    rh: playableFigure(search.rh, RIGHT_FIGURES, fit),
    lh: playableFigure(search.lh, LEFT_FIGURES, fit),
    chordSize: choosableChordSize(piece) === null ? null : (search.chordSize ?? null),
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
