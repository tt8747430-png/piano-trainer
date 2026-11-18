import { cn } from '@/shared/lib'

const NOTES = [0, 1, 2, 3, 4, 5, 6] as const

/**
 * A course's cover over its page, the canvas's COVER: a band 132 tall in its level's paint, a staff
 * across it and seven notes climbing and falling on it, drawn in the paint's ink.
 */
export function CourseBanner({ fill, ink }: { fill: string; ink: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'h-33 overflow-hidden rounded-card ring-1 ring-black/5 ring-inset dark:ring-white/5',
        fill,
        ink,
      )}
    >
      <svg viewBox="0 0 400 132" preserveAspectRatio="xMidYMid slice" className="size-full">
        <g className="stroke-current opacity-45" strokeWidth={1.6}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={0} x2={400} y1={44 + i * 11} y2={44 + i * 11} />
          ))}
        </g>
        {NOTES.map((i) => {
          const x = 70 + i * 46
          const y = 88 - (i % 4) * 5.5
          return (
            <g key={i}>
              <ellipse
                cx={x}
                cy={y}
                rx={7.5}
                ry={5.6}
                transform={`rotate(-20 ${x} ${y})`}
                className="fill-current"
              />
              <line
                x1={x + 7}
                x2={x + 7}
                y1={y - 2}
                y2={y - 36}
                strokeWidth={1.6}
                className="stroke-current"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
