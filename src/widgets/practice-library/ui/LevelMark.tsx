import { StageMark, stageRank, type Stage } from '@/entities/step'

/** A row's level as the libraries show it: its rising pips and its number (R30-4). */
export function LevelMark({ stage }: { stage: Stage }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground tabular-nums">
      <StageMark stage={stage} />
      <span aria-hidden>{stageRank(stage)}</span>
    </span>
  )
}
