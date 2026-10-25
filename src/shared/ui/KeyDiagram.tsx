import { cn, diagramRange, keyboardLayout } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { KEY_LENGTH } from './piano-keyboard/PianoKeyboard'

/** A white key's width in the drawing's units; the rest follows from it. */
const WHITE = 10
const HEIGHT = WHITE * KEY_LENGTH
/** A key's foot is rounded; its top is square, where the keys meet. */
const ROUND = { white: 1.5, black: 1 } as const
/** A dot's radius, and how far its middle stands above its key's foot. */
const DOT = { white: 3, black: 2.2 } as const
const LIFT = { white: 6.5, black: 4 } as const
/** The bass's ring: its line, drawn inside the dot's edge. */
const RING = 1.2

/** What a key held wears: a dot, or the bass's ring. */
type Mark = 'dot' | 'ring'

/** A key placed in the drawing's units. */
interface PlacedKey {
  readonly midi: Midi
  readonly black: boolean
  readonly x: number
  readonly width: number
  readonly height: number
}

/** A key's face: a square top and a rounded foot. */
const face = ({ x, width, height }: PlacedKey, round: number) =>
  `M${x} 0H${x + width}V${height - round}Q${x + width} ${height} ${x + width - round} ${height}` +
  `H${x + round}Q${x} ${height} ${x} ${height - round}Z`

/** One key, its mark on it where it is held, in its key's ink: dark on white, light on black. */
function DiagramKey({ placed, mark }: { placed: PlacedKey; mark: Mark | null }) {
  const colour = placed.black ? 'black' : 'white'
  const ink = placed.black ? 'fill-on-key-black' : 'fill-on-key-white'
  const radius = DOT[colour]
  return (
    <g data-midi={placed.midi} data-held={mark ? '' : undefined}>
      <path
        d={face(placed, ROUND[colour])}
        vectorEffect="non-scaling-stroke"
        className={placed.black ? 'fill-key-black' : 'fill-key-white stroke-key-bed'}
      />
      {mark ? (
        <circle
          data-mark={mark}
          cx={placed.x + placed.width / 2}
          cy={placed.height - LIFT[colour]}
          r={mark === 'ring' ? radius - RING / 2 : radius}
          strokeWidth={mark === 'ring' ? RING : undefined}
          className={
            mark === 'ring'
              ? cn('fill-none', placed.black ? 'stroke-on-key-black' : 'stroke-on-key-white')
              : ink
          }
        />
      ) : null}
    </g>
  )
}

/**
 * A chord drawn as a keyboard (ADR 0099), a picture beside its symbol: the keys round it as the
 * app's keys look, from the C or F at or below its lowest key to the E or B at or above its highest
 * (ten white keys at least), each key held marked by a dot near its foot, dark on a white key and
 * light on a black one; the lowest a ring where the bass is asked for. `muted` greys it whole (the
 * next chord). It takes its container's width, its keys a piano's proportion, and is named for a
 * screen reader by `label`: its chord and its notes.
 */
export function KeyDiagram({
  keys,
  label,
  bass = false,
  muted = false,
  className,
}: {
  /** The keys held. */
  keys: readonly Midi[]
  /** Its chord as printed and its notes: "C♯m7: E G# B". */
  label: string
  /** The lowest key held is the chord's bass: a ring rather than a dot. */
  bass?: boolean
  muted?: boolean
  className?: string
}) {
  const { keys: laid, whites } = keyboardLayout(diagramRange(keys))
  const width = whites * WHITE
  const held = new Set(keys)
  const lowest = Math.min(...keys)
  const markOf = (key: Midi): Mark | null =>
    !held.has(key) ? null : bass && key === lowest ? 'ring' : 'dot'
  // The white keys first, so the black keys stand over them.
  const placed = [...laid]
    .sort((a, b) => Number(a.black) - Number(b.black))
    .map((key): PlacedKey => ({
      midi: key.midi,
      black: key.black,
      x: (key.left / 100) * width,
      width: (key.width / 100) * width,
      height: (key.height / 100) * HEIGHT,
    }))
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      data-muted={muted ? '' : undefined}
      className={cn('block h-auto w-full data-muted:opacity-40', className)}
    >
      {placed.map((key) => (
        <DiagramKey key={key.midi} placed={key} mark={markOf(key.midi)} />
      ))}
    </svg>
  )
}
