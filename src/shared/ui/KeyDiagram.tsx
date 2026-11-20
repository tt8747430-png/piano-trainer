import { useId } from 'react'
import { cn, keyboardLayout } from '@/shared/lib'
import type { KeyRange, Midi } from '@/shared/lib/music'

/**
 * The tile's measures in the drawing's units, the Player's Diagrams board's (loop round 61): a white
 * key 15 wide, the tile 72 tall in a 2px frame with a 6px corner, a black key 60% of the white's
 * width and of the tile's height, a dot half a white key across near a white key's foot (0.42 of it
 * on a black key).
 */
const WHITE = 15
const HEIGHT = 72
const FRAME = 2
const CORNER = 6
const BLACK = { width: WHITE * 0.6, height: HEIGHT * 0.6 } as const
const DOT = { white: WHITE * 0.25, black: WHITE * 0.21 } as const
const LIFT = { white: HEIGHT * 0.09, black: HEIGHT * 0.07 } as const
/** A ring's line, drawn inside the dot's edge. */
const RING = 1.5

/** What a key held wears: a dot, or a ring (a bass the chord has not). */
type Mark = 'dot' | 'ring'

/**
 * A chord drawn as a keyboard (ADR 0108), a picture beside its symbol, as the Player's Diagrams
 * board draws it: a white tile in an ink frame, the keys its caller gives (every chord diagram's F3
 * to B4) parted by ink lines, the black keys ink, each key held marked by a dot near its foot, ink
 * on a white key and white on a black one; the key `ring` names wears a ring instead (a bass the
 * chord has not). `muted` greys it whole (the next chord). It takes its container's width, and is
 * named for a screen reader by `label`: its chord and its notes.
 */
export function KeyDiagram({
  keys,
  range,
  label,
  ring,
  muted = false,
  className,
}: {
  /** The keys held. */
  keys: readonly Midi[]
  /** The keys drawn. */
  range: KeyRange
  /** Its chord as printed and its notes: "C♯m7: G# B C# E". */
  label: string
  /** The key held drawn as a ring rather than a dot. */
  ring?: Midi | undefined
  muted?: boolean
  className?: string
}) {
  const clip = useId()
  const { keys: laid, whites } = keyboardLayout(range)
  const inner = whites * WHITE
  const width = inner + 2 * FRAME
  const held = new Set(keys)
  const markOf = (key: Midi): Mark | null => (!held.has(key) ? null : key === ring ? 'ring' : 'dot')
  const placed = laid.map((key) => {
    const middle = FRAME + ((key.left + key.width / 2) / 100) * inner
    return { midi: key.midi, black: key.black, middle, mark: markOf(key.midi) }
  })
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      data-muted={muted ? '' : undefined}
      className={cn('block h-auto w-full data-muted:opacity-[0.38]', className)}
    >
      <defs>
        <clipPath id={clip}>
          <rect width={width} height={HEIGHT} rx={CORNER} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width={width} height={HEIGHT} className="fill-key-white" />
        {Array.from({ length: whites - 1 }, (_, i) => (
          <line
            key={i}
            x1={FRAME + (i + 1) * WHITE}
            x2={FRAME + (i + 1) * WHITE}
            y1={0}
            y2={HEIGHT}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            className="stroke-key-black"
          />
        ))}
        {placed
          .filter((key) => key.black)
          .map((key) => (
            <rect
              key={key.midi}
              data-midi={key.midi}
              x={key.middle - BLACK.width / 2}
              y={0}
              width={BLACK.width}
              height={BLACK.height}
              className="fill-key-black"
            />
          ))}
        {placed.map(({ midi, black, middle, mark }) => {
          if (!mark) return null
          const colour = black ? 'black' : 'white'
          const radius = DOT[colour]
          const foot = black ? BLACK.height : HEIGHT - FRAME
          return (
            <circle
              key={midi}
              data-midi={midi}
              data-held=""
              data-mark={mark}
              cx={middle}
              cy={foot - LIFT[colour] - radius}
              r={mark === 'ring' ? radius - RING / 2 : radius}
              strokeWidth={mark === 'ring' ? RING : undefined}
              className={
                mark === 'ring'
                  ? cn('fill-none', black ? 'stroke-on-key-black' : 'stroke-on-key-white')
                  : black
                    ? 'fill-on-key-black'
                    : 'fill-on-key-white'
              }
            />
          )
        })}
      </g>
      <rect
        x={FRAME / 2}
        y={FRAME / 2}
        width={width - FRAME}
        height={HEIGHT - FRAME}
        rx={CORNER - FRAME / 2}
        fill="none"
        strokeWidth={FRAME}
        vectorEffect="non-scaling-stroke"
        className="stroke-key-black"
      />
    </svg>
  )
}
