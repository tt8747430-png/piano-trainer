import type { KeyboardEvent } from 'react'
import { useKeyName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  CIRCLE_OF_FIFTHS,
  keySymbol,
  pitchClassOf,
  printedSymbol,
  type CircleRing,
  type Key,
} from '@/shared/lib/music'

/** Each ring's band in a 400-unit box, as the canvas's `CIRCLE` draws it: majors outside, minors inside. */
const BAND: Readonly<Record<CircleRing, readonly [number, number]>> = {
  major: [120, 196],
  minor: [74, 120],
}
/** How far each ring's name sits from the centre. */
const LABEL: Readonly<Record<CircleRing, number>> = { major: 160, minor: 97 }
const RINGS: readonly CircleRing[] = ['major', 'minor']

const point = (radius: number, angle: number) =>
  `${(200 + radius * Math.sin(angle)).toFixed(1)} ${(200 - radius * Math.cos(angle)).toFixed(1)}`

/** A place's wedge of a ring: thirty degrees of its band, C at the top and each fifth clockwise. */
function wedgePath(place: number, ring: CircleRing): string {
  const [inner, outer] = BAND[ring]
  const from = ((place - 0.5) * Math.PI) / 6
  const to = ((place + 0.5) * Math.PI) / 6
  return `M${point(outer, from)}A${outer} ${outer} 0 0 1 ${point(outer, to)}L${point(inner, to)}A${inner} ${inner} 0 0 0 ${point(inner, from)}Z`
}

/** The place a key stands on, by its pitch on its ring (G♭ major stands on F♯'s). */
const placeOf = (key: Key) =>
  CIRCLE_OF_FIFTHS.findIndex(
    (at) => pitchClassOf(at[key.minor ? 'minor' : 'major'].tonic) === pitchClassOf(key.tonic),
  )

/**
 * The wheel of the Circle of fifths, as the canvas's `CIRCLE` draws it (canvas 182): majors outside
 * and their relative minors inside, each wedge its key's name alone, one spelling a place. The key
 * chosen is honey, its relative beside it a lighter wash, and the places either side of it a wash
 * again; a tap on a wedge chooses its key.
 */
export function KeyWheel({
  label,
  value,
  onChoose,
}: {
  label: string
  value: Key
  onChoose: (key: Key) => void
}) {
  const name = useKeyName()
  const chosen = placeOf(value)
  const ring: CircleRing = value.minor ? 'minor' : 'major'
  const fill = (place: number, at: CircleRing) => {
    if (place === chosen) {
      if (at === ring) return 'fill-primary'
      return at === 'major' ? 'fill-wheel-near' : 'fill-wheel-relative'
    }
    const near = place === (chosen + 1) % 12 || place === (chosen + 11) % 12
    if (near) return at === 'major' ? 'fill-wheel-near' : 'fill-wheel-near-inner'
    return at === 'major' ? 'fill-card' : 'fill-background'
  }
  return (
    <div className="@container relative mx-auto aspect-square w-full max-sm:-mx-2 max-sm:w-[calc(100%+1rem)] max-w-[min(38.75rem,calc(100dvh-12rem))]">
      <svg
        viewBox="0 0 400 400"
        role="group"
        aria-label={`${label}: ${name(value)}`}
        className="absolute inset-0 size-full"
      >
        {RINGS.flatMap((at) =>
          CIRCLE_OF_FIFTHS.map((place, index) => {
            const key = place[at]
            const on = index === chosen && at === ring
            return (
              <path
                key={`${at}${index}`}
                d={wedgePath(index, at)}
                role="button"
                tabIndex={0}
                aria-label={name(key)}
                aria-pressed={on}
                strokeWidth={1.2}
                className={cn(
                  'cursor-pointer stroke-border outline-none focus-visible:stroke-ring focus-visible:stroke-[3]',
                  fill(index, at),
                )}
                onClick={() => onChoose(key)}
                onKeyDown={(event: KeyboardEvent) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  onChoose(key)
                }}
              />
            )
          }),
        )}
        <circle
          cx={200}
          cy={200}
          r={74}
          strokeWidth={1.2}
          className="fill-background stroke-border"
        />
      </svg>
      {/* The names as text over the wheel, sized to it: majors bold in ink, minors in Soft Ink. */}
      {RINGS.flatMap((at) =>
        CIRCLE_OF_FIFTHS.map((place, index) => {
          const angle = (index * Math.PI) / 6
          return (
            <span
              key={`${at}${index}`}
              aria-hidden
              className={cn(
                'pointer-events-none absolute -translate-1/2 whitespace-nowrap',
                at === 'major'
                  ? 'text-[length:6cqw] font-bold text-foreground'
                  : 'text-[length:3.75cqw] text-muted-foreground',
                index === chosen && at === ring && 'text-foreground',
              )}
              style={{
                left: `${(200 + LABEL[at] * Math.sin(angle)) / 4}%`,
                top: `${(200 - LABEL[at] * Math.cos(angle)) / 4}%`,
              }}
            >
              {printedSymbol(keySymbol(place[at]))}
            </span>
          )
        }),
      )}
    </div>
  )
}
