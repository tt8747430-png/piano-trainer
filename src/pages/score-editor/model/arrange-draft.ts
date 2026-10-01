import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import {
  writeDraft,
  type Draft,
  type DraftNote,
  type HandId,
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
  { start, bar }: PlacedBar,
): DraftNote[] {
  return performance.notes
    .filter((n) => n.hand === hand && n.startTick >= start && n.startTick < start + bar.ticks)
    .map((n) => ({
      midi: n.midi,
      spelled: n.spelled,
      startTick: n.startTick,
      durationTicks: n.durationTicks,
      ...(n.finger === undefined ? {} : { finger: n.finger }),
    }))
}
