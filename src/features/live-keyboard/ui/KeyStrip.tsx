import type { KeyboardEvent, PointerEvent } from 'react'
import { isBlackKey, WHITE_KEYS, type Midi } from '@/shared/lib/music'

const LOWEST = 21
const HIGHEST = 108
const WIDTH = 340
const HEIGHT = 26
const WHITE = WIDTH / WHITE_KEYS.length

/** Where a key stands across the strip, in its units: by white keys, a black key between two. */
const across = (key: Midi): number => WHITE_KEYS.filter((white) => white < key).length * WHITE

/** Moving the stretch along the 88: how many white keys it spans, and where it goes. */
export interface KeyStripMove {
  readonly whites: number
  readonly onMove: (from: Midi) => void
}

/**
 * The 88 keys in a strip, the stretch a piano shows washed in honey and ringed, as the canvas's
 * Piano sheet draws its Range (STRIP): 40 high, the black keys in ink. Given `move`, it is a slider:
 * dragged by finger or mouse, the stretch centred under the pointer; the arrows step it a white key.
 */
export function KeyStrip({
  low,
  high,
  label,
  move,
}: {
  low: Midi
  high: Midi
  label: string
  move?: KeyStripMove
}) {
  const blacks: string[] = []
  for (let key = LOWEST; key <= HIGHEST; key++)
    if (isBlackKey(key as Midi))
      blacks.push(
        `M${(across(key as Midi) - WHITE * 0.3).toFixed(2)} 0h${(WHITE * 0.6).toFixed(2)}v15h-${(WHITE * 0.6).toFixed(2)}z`,
      )
  const from = across(low)
  const to = across(high) + (isBlackKey(high) ? WHITE * 0.3 : WHITE)
  const last = move ? WHITE_KEYS.length - move.whites : 0
  const place = (at: number) => {
    const key = WHITE_KEYS[Math.max(0, Math.min(last, at))]
    if (move && key !== undefined && key !== low) move.onMove(key)
  }
  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!move || (event.type === 'pointermove' && !event.buttons)) return
    if (event.type === 'pointerdown') event.currentTarget.setPointerCapture(event.pointerId)
    const box = event.currentTarget.getBoundingClientRect()
    place(
      Math.round(((event.clientX - box.left) / box.width) * WHITE_KEYS.length - move.whites / 2),
    )
  }
  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (!step) return
    event.preventDefault()
    place(WHITE_KEYS.indexOf(low) + step)
  }
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={`block h-10 w-full overflow-hidden rounded-sm ${move ? 'cursor-grab touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring' : ''}`}
      {...(move
        ? {
            role: 'slider',
            tabIndex: 0,
            'aria-label': label,
            'aria-valuemin': 0,
            'aria-valuemax': last,
            'aria-valuenow': WHITE_KEYS.indexOf(low),
            'aria-valuetext': label,
            onPointerDown: onPointer,
            onPointerMove: onPointer,
            onKeyDown: onKey,
          }
        : { role: 'img', 'aria-label': label })}
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
