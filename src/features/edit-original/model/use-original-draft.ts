import { useMemo } from 'react'
import {
  originalPiece,
  originalWith,
  pieceRecordBody,
  pieceRecordMeta,
  type ChartPiece,
  type PieceMusic,
} from '@/entities/piece'
import { useContentDraft, type DraftSpec } from './use-content-draft'

/**
 * An editor's draft of a built-in song (ADR 0116, round 6, round 28): the song whole, its music read
 * as the song's (a draft whose music does not read is none) and what its page says of it, written by
 * the score editor (its music) and by the song's page in Edit (its title, credits and note).
 */
export function useOriginalDraft(piece: ChartPiece) {
  const spec = useMemo<DraftSpec<ChartPiece>>(
    () => ({
      kind: 'piece',
      id: piece.id,
      read: (body) => originalPiece(piece, body),
      write: (original) => ({ body: pieceRecordBody(original), meta: pieceRecordMeta(original) }),
      fallback: piece,
    }),
    [piece],
  )
  return useContentDraft(spec)
}

/** The draft's song with this music written into it, the rest of it as the draft has it. */
export const draftWithMusic = (draft: ChartPiece, music: PieceMusic): ChartPiece =>
  originalWith(draft, music)
