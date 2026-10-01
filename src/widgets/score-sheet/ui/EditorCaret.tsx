import type { Layer } from '@/features/score-editor'
import type { Tick } from '@/shared/lib/music'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'

/** How far left of a notehead the band starts, how far past its staff it reaches, its least width. */
const LEAD = 8
const REACH = 12
const LEAST = 28
/** The chord symbols' row over the staff (the sheet's `pt-11`). */
const CHORD_ROW = 44

/**
 * The caret: the Player's cursor band where the next note or chord goes, on the layer's staff (or over
 * the chord symbols), as wide as the value chosen.
 */
export function EditorCaret({
  layout,
  layer,
  tick,
  ticks,
}: {
  layout: ScoreLayout
  layer: Layer
  /** From the line's start. */
  tick: Tick
  ticks: Tick
}) {
  const left = xAtTick(layout, tick) - LEAD
  const right = xAtTick(layout, tick + ticks) - LEAD
  const staff = layer === 'lh' ? layout.staves.bass : layout.staves.treble
  const box =
    layer === 'chords' || !staff
      ? { top: -CHORD_ROW, height: CHORD_ROW }
      : { top: staff.top - REACH, height: staff.bottom - staff.top + 2 * REACH }
  return (
    <div
      aria-hidden
      data-slot="caret"
      className="absolute z-0 rounded-md bg-secondary transition-transform duration-200 ease-out"
      style={{
        ...box,
        left: 0,
        width: Math.max(LEAST, right - left),
        transform: `translateX(${left}px)`,
      }}
    />
  )
}
