import {
  LEFT_FIGURES,
  playableFigure,
  playablePattern,
  RIGHT_FIGURES,
  type PatternBook,
} from '@/entities/pattern'
import { choosableChordSize, isDegreePiece, pieceFit, pieceKey, type Piece } from '@/entities/piece'
import { ownChoice, type PracticeChoice } from '@/features/practice'
import { noteFromParam, noteParam, transposedKey, transposition } from '@/shared/lib/music'
import type { SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import { ownLeftOut } from './own-left-out'

/** A piece's own choices as the Player's URL holds them: its Setup's, and Simplify (ADR 0105). */
export type PieceParams = SetupParams & { readonly simple?: boolean }

/**
 * The Player's URL: how it goes, and the piece's own choices, Simplify on or off (ADR
 * 0105); and the bar as printed its cursor opens on, the editor's caret's where Practise came from
 * it (ADR 0115).
 */
export type PlayerSearch = PracticeView &
  SetupParams & { readonly simple: boolean; readonly bar?: number }

/**
 * The Player's URL read against its piece: what the URL leaves out is the piece's own, and so is a
 * pattern or figure the piece cannot play (one that plays a tune it lacks, or inside the beat of
 * 6/8 or 12/8). The key it is moved to is spelled by its simplest signature, the piece's own as it is
 * written (ADR 0105).
 */
export function resolveChoice(
  piece: Piece,
  search: PieceParams,
  tune: boolean,
  book: PatternBook,
): PracticeChoice {
  const own = ownChoice(piece)
  const fit = pieceFit(piece)
  const key = pieceKey(piece)
  return {
    tonic: search.key
      ? transposedKey(key, transposition(key.tonic, noteFromParam(search.key))).tonic
      : own.tonic,
    pattern: playablePattern(book, search.pattern, own.pattern, fit),
    rh: playableFigure(search.rh, RIGHT_FIGURES, fit),
    lh: playableFigure(search.lh, LEFT_FIGURES, fit),
    inversion: search.inversion ?? null,
    nearest: search.nearest !== false,
    chordSize: choosableChordSize(piece) === null ? null : (search.chordSize ?? null),
    tune,
    simple: search.simple === true,
  }
}

/** A Setup change as the URL writes it: a key, pattern or chord size equal to the piece's own is left out. */
export function searchPatch(piece: Piece, change: SetupChange): SetupChange {
  const own = ownChoice(piece)
  const written = ownLeftOut(change, {
    pattern: own.pattern,
    chordSize: isDegreePiece(piece) ? piece.chordSize.default : undefined,
  })
  return 'key' in change
    ? { ...written, key: change.key === noteParam(own.tonic) ? undefined : change.key }
    : written
}
