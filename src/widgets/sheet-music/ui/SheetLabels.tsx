import { memo } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'

/**
 * Over the staff: each bar's number, a section's name at its first bar, and each chord symbol at its
 * onset (spec §2.6). The bars' buttons carry the same words for a screen reader.
 */
export const SheetLabels = memo(function SheetLabels({
  layout,
  performance,
  headings,
}: {
  layout: ScoreLayout
  performance: Performance
  headings: readonly string[]
}) {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-full h-11">
      {layout.measures.map((measure, index) => {
        const section = performance.bars[index]?.section
        const starts = section !== undefined && section !== performance.bars[index - 1]?.section
        return (
          <span
            key={index}
            className="absolute top-0 text-xs whitespace-nowrap text-muted-foreground tabular-nums"
            style={{ left: measure.x + 4 }}
          >
            {index + 1}
            {starts && headings[section] ? ` · ${headings[section]}` : null}
          </span>
        )
      })}
      {performance.chords.map((chord, index) => (
        <span
          key={index}
          className="absolute bottom-0.5 font-display text-lg font-semibold whitespace-nowrap"
          style={{ left: xAtTick(layout, chord.startTick) }}
        >
          {chord.symbol}
        </span>
      ))}
    </div>
  )
})
