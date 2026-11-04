import { useKeyName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  CIRCLE_OF_FIFTHS,
  keySymbol,
  note,
  pitchClassOf,
  printedSymbol,
  sameKey,
  type CircleRing,
  type Key,
} from '@/shared/lib/music'
import { cellCentre, signatureCount, wedgePath, type WedgePart } from '../model/circle-layout'

const RINGS: readonly CircleRing[] = ['major', 'minor']

/**
 * The places whose key is written two ways, each half of its wedge one spelling, the sharps' first
 * (anticlockwise): B / C♭, F♯ / G♭, C♯ / D♭ outside, G♯m / A♭m, D♯m / E♭m, A♯m / B♭m inside.
 */
const SPLIT: Readonly<Record<number, Record<CircleRing, readonly [Key, Key]>>> = {
  5: {
    major: [
      { tonic: note('B'), minor: false },
      { tonic: note('C', -1), minor: false },
    ],
    minor: [
      { tonic: note('G', 1), minor: true },
      { tonic: note('A', -1), minor: true },
    ],
  },
  6: {
    major: [
      { tonic: note('F', 1), minor: false },
      { tonic: note('G', -1), minor: false },
    ],
    minor: [
      { tonic: note('D', 1), minor: true },
      { tonic: note('E', -1), minor: true },
    ],
  },
  7: {
    major: [
      { tonic: note('C', 1), minor: false },
      { tonic: note('D', -1), minor: false },
    ],
    minor: [
      { tonic: note('A', 1), minor: true },
      { tonic: note('B', -1), minor: true },
    ],
  },
}

/** One wedge, or half of one: the key it chooses and where it is drawn. */
export interface CircleWedge {
  readonly key: Key
  readonly place: number
  readonly ring: CircleRing
  readonly part: WedgePart
}

/** Every wedge, the majors clockwise from C, then the minors: the order the arrows go round. */
const WEDGES: readonly CircleWedge[] = RINGS.flatMap((ring) =>
  CIRCLE_OF_FIFTHS.flatMap((place, i): CircleWedge[] => {
    const split = SPLIT[i]?.[ring]
    return split
      ? [
          { key: split[0], place: i, ring, part: -1 },
          { key: split[1], place: i, ring, part: 1 },
        ]
      : [{ key: place[ring], place: i, ring, part: 0 }]
  }),
)

/** What a wedge shows in place of its key's name and signature: one of a key's chords, its numeral. */
export interface WedgeMark {
  readonly symbol: string
  readonly numeral: string
}

/** The wedge that shows a key: its own spelling's, else its pitch's on its ring (D♯ minor's E♭ half's twin). */
const wedgeOf = (key: Key): CircleWedge | undefined =>
  WEDGES.find((wedge) => sameKey(wedge.key, key)) ??
  WEDGES.find(
    (wedge) =>
      wedge.key.minor === key.minor && pitchClassOf(wedge.key.tonic) === pitchClassOf(key.tonic),
  )

/**
 * The circle of fifths as a picture (R29-P7: the Key view's, not a picker; the heading's menus choose
 * the key): majors outside and their relative minors inside, each wedge its key's name over its
 * signature's count, the keys written two ways split in halves. The key shown is tinted and named in
 * the middle; `mark` writes one of the key's chords in a wedge's place, tinted lighter. One image to
 * a screen reader, named by its label and the key.
 */
export function KeyCircle({
  label,
  value,
  mark,
  className,
}: {
  label: string
  value: Key
  mark?: (wedge: CircleWedge) => WedgeMark | undefined
  className?: string
}) {
  const name = useKeyName()
  const chosen = wedgeOf(value)
  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-sm', className)}>
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${label}: ${name(value)}`}
        className="absolute inset-0 size-full overflow-visible"
      >
        {WEDGES.map((wedge, index) => {
          const marked = mark?.(wedge)
          const on = wedge === chosen
          const { x, y } = cellCentre(wedge.place, wedge.ring, wedge.part)
          const half = wedge.part !== 0
          const size = (wedge.ring === 'major' ? 4.4 : 3.6) * (half ? 0.78 : 1)
          const small = wedge.ring === 'major' ? 3 : 2.6
          return (
            <g key={index} data-wedge={index} data-on={on || undefined}>
              <path
                d={wedgePath(wedge.place, wedge.ring, wedge.part)}
                strokeWidth={0.3}
                className={cn(
                  'stroke-border',
                  on ? 'fill-key-tonic' : marked ? 'fill-key-scale' : 'fill-card',
                )}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                className={cn(
                  'fill-current font-semibold',
                  on ? 'text-on-key-tonic' : marked ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                <tspan x={x} dy={-0.6} fontSize={size}>
                  {printedSymbol(marked ? marked.symbol : keySymbol(wedge.key))}
                </tspan>
                <tspan x={x} dy={small + 0.6} fontSize={small} className="font-normal">
                  {marked ? marked.numeral : signatureCount(wedge.key)}
                </tspan>
              </text>
            </g>
          )
        })}
      </svg>
      <p
        aria-hidden
        className="pointer-events-none absolute inset-[20%] grid place-content-center text-center font-display text-base leading-tight font-semibold text-balance"
      >
        {name(value)}
      </p>
    </div>
  )
}
