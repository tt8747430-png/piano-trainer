import { SWING_SHARE, type SwingFeel } from '@/shared/lib/schedule'

/** Where a beat starts and ends on the picture, in its units. */
const BEAT = { from: 6, to: 58 } as const
/** The note heads' line, and their stems' tops. */
const HEAD = 26
const TOP = 8

/** A note of the picture: its head at `x`, its stem up from its right side. */
function Note({ x }: { x: number }) {
  return (
    <g className="fill-current stroke-current">
      <ellipse cx={x} cy={HEAD} rx={3.2} ry={2.3} transform={`rotate(-20 ${x} ${HEAD})`} />
      <line x1={x + 2.9} x2={x + 2.9} y1={HEAD - 0.5} y2={TOP} strokeWidth={1.2} />
    </g>
  )
}

/**
 * A beat of two 8ths as a feel plays it (ADR 0115): the second as late as the feel swings it, the
 * beat's span marked under them, so straight is even and hard is long-short. In the ink of its tile.
 */
export function SwingPicture({ feel }: { feel: SwingFeel }) {
  const second = BEAT.from + (BEAT.to - BEAT.from) * SWING_SHARE[feel]
  return (
    <svg aria-hidden viewBox="0 0 64 40" className="h-10 w-16 overflow-visible">
      <Note x={BEAT.from} />
      <Note x={second} />
      <line
        x1={BEAT.from + 2.9}
        x2={second + 2.9}
        y1={TOP}
        y2={TOP}
        strokeWidth={2.4}
        className="stroke-current"
      />
      <g strokeWidth={0.9} className="stroke-current opacity-40">
        <line x1={BEAT.from} x2={BEAT.to} y1={35} y2={35} />
        {[BEAT.from, (BEAT.from + BEAT.to) / 2, BEAT.to].map((x) => (
          <line key={x} x1={x} x2={x} y1={32} y2={38} />
        ))}
      </g>
    </svg>
  )
}
