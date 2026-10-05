import type { TimedMusic } from '@/shared/lib/notation'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'

/** A bar's number sits this far right of its barline, clear of the line. */
const NUMBER_INSET_PX = 4

/** Over a line's staff: each bar's number and, with chord names, each chord symbol at its onset, as the Player's sheet sets them. */
export function LineLabels({
  layout,
  music,
  firstBar,
  chordNames,
}: {
  layout: ScoreLayout
  music: TimedMusic
  /** The number of the line's first bar. */
  firstBar: number
  /** Whether the chord symbols are shown. */
  chordNames: boolean
}) {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-full h-11">
      {layout.measures.map((measure, index) => (
        <span
          key={index}
          className="absolute top-0 text-xs whitespace-nowrap text-muted-foreground tabular-nums"
          style={{ left: measure.x + NUMBER_INSET_PX }}
        >
          {firstBar + index}
        </span>
      ))}
      {(chordNames ? music.chords : []).map((chord, index) => (
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
}
