import { useMemo, useRef } from 'react'
import { notate } from '@/shared/lib/notation'
import { useElementSize } from '@/shared/lib'
import { TappableStaff } from '@/features/play-example'
import type { PatternSample } from '../model/pattern-sample'

/** A note or bar tapped on the sample sounds at this tempo. */
const NOTE_TEMPO = 84

/**
 * The board's staff spans the column (MUSIC63, a 254-unit view at 7 units a space): a space is 7/254
 * of the width, and scale 1 draws 10, so the scale is the width over this.
 */
const UNITS_A_SCALE = 2540 / 7
/** The widest the bar is drawn, centred, as the board's 560. */
const MOST_WIDTH = 560
/** The board's view is 254 units wide and 132 tall: the room its two staves take. */
const HEIGHT_A_WIDTH = 132 / 254

/**
 * The sample on the grand staff, each hand on its own, justified to the column at the board's size;
 * a note or bar tapped plays. What it is played over is Play's menu's, never a caption.
 */
export function PatternStaff({ sample }: { sample: PatternSample }) {
  const score = useMemo(() => notate(sample.music), [sample.music])
  const box = useRef<HTMLDivElement>(null)
  const { width: room } = useElementSize(box)
  const width = Math.min(room, MOST_WIDTH)
  return (
    <div
      ref={box}
      className="flex items-center justify-center"
      style={{ minHeight: width * HEIGHT_A_WIDTH }}
    >
      {width > 0 ? (
        <TappableStaff
          music={sample.music}
          score={score}
          scale={width / UNITS_A_SCALE}
          fill={width}
          tempo={NOTE_TEMPO}
        />
      ) : null}
    </div>
  )
}
