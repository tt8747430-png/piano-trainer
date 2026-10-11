import { useEffect, useRef } from 'react'
import type { Layer } from '@/features/score-editor'
import type { Tick } from '@/shared/lib/music'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { CHORD_ROW } from './chord-row'

/** How far left of a notehead the band starts, how far past its staff it reaches, its least width. */
const LEAD = 8
const REACH = 12
const LEAST = 28

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
  // A line wider than the screen scrolls sideways to keep the caret in sight as it moves.
  const caret = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const line = caret.current?.closest<HTMLElement>('[data-slot="sheet-line"]')
    if (!line) return
    const margin = line.clientWidth / 4
    if (
      left < line.scrollLeft + margin / 2 ||
      right > line.scrollLeft + line.clientWidth - margin / 2
    )
      line.scrollLeft = Math.max(0, left - margin)
  }, [left, right])
  const box =
    layer === 'chords' || !staff
      ? { top: -CHORD_ROW, height: CHORD_ROW }
      : { top: staff.top - REACH, height: staff.bottom - staff.top + 2 * REACH }
  return (
    <div
      ref={caret}
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
