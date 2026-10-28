import type { Finger, Hand } from '@/shared/lib/music'

/** The drawing's width and height, in its own units. */
const WIDTH = 100
const HEIGHT = 112

/**
 * A right hand seen from above, palm down, thumb first: where each finger stands across the palm,
 * where its tip reaches, and how wide it is. The left hand is its mirror.
 */
const FINGERS: readonly { finger: Finger; x: number; tip: number; width: number }[] = [
  { finger: 1, x: 14, tip: 48, width: 15 },
  { finger: 2, x: 33, tip: 14, width: 14 },
  { finger: 3, x: 50, tip: 6, width: 14 },
  { finger: 4, x: 67, tip: 13, width: 13.5 },
  { finger: 5, x: 83, tip: 30, width: 12 },
]
/** Where the fingers meet the palm, and where the palm ends. */
const KNUCKLES = 62
const WRIST = HEIGHT - 2

/**
 * A hand drawn with its fingers numbered as piano fingering counts them, thumb 1 to little finger 5,
 * as the reference app shows beside a scale's fingering: the right hand's thumb on the left, the
 * left hand's on the right, as the hands lie on the keys. Named for a screen reader by `label`.
 */
export function HandDiagram({
  hand,
  label,
  className,
}: {
  hand: Hand
  label: string
  className?: string
}) {
  const at = (x: number) => (hand === 'rh' ? x : WIDTH - x)
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`-12 0 ${WIDTH + 24} ${HEIGHT}`}
      className={className}
    >
      <g className="fill-muted stroke-border" strokeWidth={1.5}>
        <rect x={6} y={KNUCKLES - 6} width={WIDTH - 12} height={WRIST - KNUCKLES + 6} rx={18} />
        {FINGERS.map(({ finger, x, tip, width }) => (
          <rect
            key={finger}
            x={at(x) - width / 2}
            y={tip}
            width={width}
            height={(finger === 1 ? KNUCKLES + 18 : KNUCKLES + 4) - tip}
            rx={width / 2}
            transform={
              finger === 1
                ? `rotate(${hand === 'rh' ? -24 : 24} ${at(x)} ${KNUCKLES + 18})`
                : undefined
            }
          />
        ))}
      </g>
      {FINGERS.map(({ finger, x, tip, width }) => {
        // The thumb's number rides its tip, tilted out with it.
        const shift = finger === 1 ? (hand === 'rh' ? -9 : 9) : 0
        return (
          <g key={finger} aria-hidden>
            <circle cx={at(x) + shift} cy={tip + width / 2 + 4} r={6} className="fill-foreground" />
            <text
              x={at(x) + shift}
              y={tip + width / 2 + 4}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-background text-[9px] font-bold"
            >
              {finger}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
