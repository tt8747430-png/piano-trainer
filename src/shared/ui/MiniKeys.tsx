import { cn } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'

/** The boards' MINIKEYS stretch: F3 to E5, fourteen white keys (`calmKeys(53, 76, …)`). */
const LOW = 53
const HIGH = 76
const NATURAL = new Set([0, 2, 4, 5, 7, 9, 11])
const WHITES = Array.from({ length: HIGH - LOW + 1 }, (_, i) => LOW + i).filter((m) =>
  NATURAL.has(m % 12),
)
const WIDTH = 100 / WHITES.length
/** A black key is 60% of a white key's width and 28 of the 46 tall picture. */
const BLACK_WIDTH = WIDTH * 0.6

/** The chord moved by whole octaves so its lowest key stands in the stretch's first octave, as the boards place it. */
const placed = (keys: readonly Midi[]): ReadonlySet<number> => {
  if (keys.length === 0) return new Set()
  const low = Math.min(...keys)
  const shift = Math.floor((LOW + 11 - low) / 12) * 12
  return new Set(keys.map((key) => key + shift))
}

/**
 * A chord as a picture of the keys (the boards' MINIKEYS, on Scales' chord cards and a song's chords): the
 * app's ivory and ebony faces under the felt, 104 × 46 with a 6 corner, the chord's keys in a brick wash,
 * honey while it sounds. Hidden from readers: the card that holds it names the chord.
 */
export function MiniKeys({
  keys,
  sounding = false,
  className,
}: {
  keys: readonly Midi[]
  sounding?: boolean
  className?: string
}) {
  const held = placed(keys)
  const fill = sounding ? 'bg-primary' : 'bg-[var(--key-chord)]'
  return (
    <div
      aria-hidden
      className={cn(
        'relative isolate h-11.5 w-26 shrink-0 overflow-hidden rounded-control bg-border',
        className,
      )}
    >
      {WHITES.map((midi, i) => (
        <span
          key={midi}
          className={cn(
            'key-face-white absolute top-0 h-full rounded-b-[5px] border-e border-border',
            held.has(midi) ? fill : 'bg-[var(--key-white)]',
          )}
          style={{ left: `${i * WIDTH}%`, width: `${WIDTH}%` }}
        />
      ))}
      {WHITES.flatMap((midi, i) =>
        NATURAL.has((midi + 1) % 12) || midi + 1 > HIGH
          ? []
          : [
              <span
                key={midi + 1}
                className={cn(
                  'key-face-black absolute top-0 z-10 h-7 rounded-b-[3px]',
                  held.has(midi + 1) ? fill : 'bg-[var(--key-black)]',
                )}
                style={{ left: `${(i + 1) * WIDTH - BLACK_WIDTH / 2}%`, width: `${BLACK_WIDTH}%` }}
              />,
            ],
      )}
      <span className="key-felt absolute inset-x-0 top-0 z-20" />
    </div>
  )
}
