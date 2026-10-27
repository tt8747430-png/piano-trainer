import { useMemo } from 'react'
import type { Figure } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { figureRoll } from '../model/figure-roll'

/** The picture's size in its own units: a bar across, a hand's reach up. */
const WIDTH = 64
const HEIGHT = 24
const NOTE = 3.2
/** A note's head: where it is struck. */
const HEAD = 3.4

/**
 * What a hand's figure plays (ADR 0115): its bar over C as a little piano roll, each note a head where
 * it is struck at its height and a faint tail as long as it is held, the beats marked under them. In the ink of the row it is on.
 */
export function FigureRoll({
  hand,
  figure,
  className,
}: {
  hand: 'rh' | 'lh'
  figure: Figure
  className?: string
}) {
  const roll = useMemo(() => figureRoll(hand, figure), [hand, figure])
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={cn('h-6 w-16 shrink-0 overflow-visible', className)}
    >
      <g strokeWidth={0.6} className="stroke-current opacity-25">
        {[0, 1, 2, 3, 4].map((beat) => (
          <line
            key={beat}
            x1={(beat * WIDTH) / 4}
            x2={(beat * WIDTH) / 4}
            y1={HEIGHT - 3}
            y2={HEIGHT}
          />
        ))}
        <line x1={0} x2={WIDTH} y1={HEIGHT - 0.3} y2={HEIGHT - 0.3} />
      </g>
      {roll.map((note, index) => {
        const x = note.start * WIDTH + 0.4
        const y = (1 - note.height) * (HEIGHT - 4 - NOTE)
        return (
          // Where it is struck, a head; how long it is held, a faint tail after it.
          <g key={index} className="fill-current">
            <rect
              x={x}
              y={y + NOTE / 2 - 0.6}
              width={Math.max(note.length * WIDTH - 0.8, HEAD)}
              height={1.2}
              className="opacity-30"
            />
            <rect x={x} y={y} width={HEAD} height={NOTE} rx={1.2} />
          </g>
        )
      })}
    </svg>
  )
}
