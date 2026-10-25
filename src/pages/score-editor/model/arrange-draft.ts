import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { writeDraft, type Draft } from '@/features/score-editor'
import type { Performance } from '@/shared/lib/arrangement'

/** The draft as the Player plays it as written: its key, every bar's written hands, its tune heard. */
export function arrangeDraft(draft: Draft): Performance {
  const piece: ChartPiece = { id: 'draft', kind: 'song', title: '', ...writeDraft(draft) }
  return arrangePiece(piece, { ...ownChoice(piece), melody: true }, BUILT_IN_PATTERNS)
}
