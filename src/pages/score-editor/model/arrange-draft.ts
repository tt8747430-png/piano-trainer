import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece, HandId } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import {
  startsIn,
  writeDraft,
  type Draft,
  type DraftNote,
  type PlacedBar,
} from '@/features/score-editor'
import type { Performance } from '@/shared/lib/arrangement'

/** The draft as the Player plays it as written: its key and pattern, its melody heard. */
export function arrangeDraft(draft: Draft): Performance {
  const piece: ChartPiece = { id: 'draft', kind: 'song', title: '', ...writeDraft(draft) }
  return arrangePiece(piece, { ...ownChoice(piece), melody: true }, BUILT_IN_PATTERNS)
}

/** What a hand plays in a bar: the notes starting there, as the editor writes them. */
export function playedInBar(
  performance: Performance,
  hand: HandId,
  placed: PlacedBar,
): DraftNote[] {
  return performance.notes
    .filter((n) => n.hand === hand && startsIn(n.startTick, placed))
    .map((n) => ({
      midi: n.midi,
      spelled: n.spelled,
      startTick: n.startTick,
      durationTicks: n.durationTicks,
      ...(n.finger === undefined ? {} : { finger: n.finger }),
    }))
}
