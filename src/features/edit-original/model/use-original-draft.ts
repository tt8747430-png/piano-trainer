import { useMemo } from 'react'
import {
  musicOf,
  originalMusic,
  originalWith,
  pieceRecordBody,
  pieceRecordMeta,
  type ChartPiece,
  type PieceMusic,
} from '@/entities/piece'
import { useContentDraft, type DraftSpec } from './use-content-draft'

/**
 * An editor's draft of a built-in song's original (ADR 0116, round 6): its music, read as the song's
 * (a draft whose music does not read is none) and written into the song in place of its own.
 */
export function useOriginalDraft(piece: ChartPiece) {
  const spec = useMemo<DraftSpec<PieceMusic>>(
    () => ({
      kind: 'piece',
      id: piece.id,
      read: (body) => originalMusic(piece, body),
      write: (music) => {
        const original = originalWith(piece, music)
        return { body: pieceRecordBody(original), meta: pieceRecordMeta(original) }
      },
      fallback: musicOf(piece),
    }),
    [piece],
  )
  return useContentDraft(spec)
}
