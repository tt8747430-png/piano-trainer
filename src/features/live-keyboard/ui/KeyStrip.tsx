import { isBlackKey, type Midi } from '@/shared/lib/music'

const LOWEST = 21
const HIGHEST = 108
const WHITES = 52
const WIDTH = 340
const HEIGHT = 26

/** Where a key stands across the strip, in its units: by white keys, a black key between two. */
function across(key: number): number {
  let whites = 0
  for (let k = LOWEST; k < key; k++) if (!isBlackKey(k as Midi)) whites++
  return (whites * WIDTH) / WHITES
}

/**
 * The 88 keys in a strip, the stretch a piano shows washed in honey and ringed, as the canvas's
 * Piano sheet draws its Range (STRIP): 40 high, the black keys in ink.
 */
export function KeyStrip({ low, high, label }: { low: Midi; high: Midi; label: string }) {
  const white = WIDTH / WHITES
  const blacks: string[] = []
  for (let key = LOWEST; key <= HIGHEST; key++)
    if (isBlackKey(key as Midi))
      blacks.push(
        `M${(across(key) - white * 0.3).toFixed(2)} 0h${(white * 0.6).toFixed(2)}v15h-${(white * 0.6).toFixed(2)}z`,
      )
  const from = across(low)
  const to = across(high) + (isBlackKey(high) ? white * 0.3 : white)
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="block h-10 w-full overflow-hidden rounded-sm"
    >
      <rect width={WIDTH} height={HEIGHT} className="fill-card stroke-border" />
      <rect x={from} width={to - from} height={HEIGHT} className="fill-primary/40" />
      <path d={blacks.join('')} className="fill-key-black" />
      <rect
        x={from}
        y={0.75}
        width={to - from}
        height={HEIGHT - 1.5}
        fill="none"
        strokeWidth={1.5}
        className="stroke-honey-ring"
      />
    </svg>
  )
}
