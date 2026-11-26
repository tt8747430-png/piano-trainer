import { useMemo } from 'react'
import { LEFT_FIGURES, RIGHT_FIGURES, type BookPattern } from '@/entities/pattern'
import { figureRoll } from '../model/figure-roll'

/** The picture's own units (the board's viewBox): a bar across, both hands' reach up. */
const WIDTH = 100
const HEIGHT = 44
/** Where the bar's notes start and how far they run, between its edges. */
const EDGE = 2
const SPAN = 96
/** The room between one note and the next struck after it, and a note's height. */
const GAP = 4
const NOTE = 3
/** Each hand's band: the right hand's over the line, the left's under it, its top and its depth. */
const BANDS = { rh: { top: 6, depth: 10 }, lh: { top: 29, depth: 10 } } as const
const MIDDLE = 24.5

/**
 * What a pattern's two hands play together (the PlayerApp board's row picture): its bar over C on a
 * card's tile, the right hand over the middle line in its brick, the left under it in its lilac, each
 * note a bar as long as it is held, as high as it sounds.
 */
export function PatternRoll({ pattern }: { pattern: BookPattern }) {
  const hands = useMemo(
    () => ({
      rh: figureRoll('rh', RIGHT_FIGURES[pattern.rh].figure),
      lh: figureRoll('lh', LEFT_FIGURES[pattern.lh].figure),
    }),
    [pattern.rh, pattern.lh],
  )
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="h-7.5 w-14 shrink-0 rounded-tile bg-card"
    >
      <path d={`M0 ${MIDDLE}H${WIDTH}`} className="stroke-hairline" />
      {(['rh', 'lh'] as const).map((hand) => (
        <g key={hand} className={hand === 'rh' ? 'fill-hand-rh' : 'fill-hand-lh'}>
          {hands[hand].map((note, index) => (
            <rect
              key={index}
              x={EDGE + note.start * SPAN}
              y={BANDS[hand].top + (1 - note.height) * BANDS[hand].depth}
              width={Math.max(note.length * SPAN - GAP, NOTE)}
              height={NOTE}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
