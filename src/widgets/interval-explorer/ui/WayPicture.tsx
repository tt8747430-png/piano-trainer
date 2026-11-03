import type { IntervalWay } from '@/shared/lib/schedule'

/** Each way's two note heads, left to right on a staff's two lines: stacked, rising, falling. */
const HEADS: Readonly<Record<IntervalWay, readonly (readonly [number, number])[]>> = {
  together: [
    [12, 7],
    [12, 17],
  ],
  up: [
    [7, 17],
    [17, 7],
  ],
  down: [
    [7, 7],
    [17, 17],
  ],
}

/**
 * How an interval is heard, drawn as theory books print it (R21): two notes stacked (harmonic), two
 * notes rising or falling (melodic).
 */
export function WayPicture({ way }: { way: IntervalWay }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="currentColor">
      <path d="M2 9.5h20M2 14.5h20" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
      {HEADS[way].map(([x, y]) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          rx={3.2}
          ry={2.4}
          transform={`rotate(-20 ${x} ${y})`}
        />
      ))}
    </svg>
  )
}
