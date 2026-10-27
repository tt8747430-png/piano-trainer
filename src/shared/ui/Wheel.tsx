import { useEffect, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { cn } from '@/shared/lib'

/** One value of a wheel, as it is printed on it; a greyed one is passed over. */
export interface WheelOption<T extends string | number> {
  readonly value: T
  readonly label: string
  readonly disabled?: boolean
}

/** Where a wheel shows its neighbours: either side, or only above or below its value (ADR 0114). */
export type WheelReveal = 'both' | 'above' | 'below'

/** A row's height, in CSS px, unless the wheel is given its own. */
const ROW = 40
/** How much of a neighbour's row shows, faded, on a side the wheel reveals. */
const NEIGHBOUR = 0.75
/** How long a scroll rests before the value under the band is taken, in ms. */
const SETTLE = 120
/** How long a digit typed waits for the next, in ms. */
const TYPED = 900

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** A wheel's scroller moved to `top`, said to be the wheel's own scroll (`placing`), smoothly where asked. */
function scrollTo(
  box: HTMLDivElement | null,
  placing: { current: boolean },
  top: number,
  smooth: boolean,
) {
  if (!box || Math.abs(box.scrollTop - top) < 1) return
  placing.current = true
  if (smooth && !reduced() && box.scrollTo) box.scrollTo({ top, behavior: 'smooth' })
  else box.scrollTop = top
}

/** The fade over a wheel's revealed sides: its value's row solid, a neighbour's fading out. */
function fadeOf(reveal: WheelReveal, room: number, row: number): string {
  const stop = (at: number) => `${(at / (room + row + (reveal === 'both' ? room : 0))) * 100}%`
  if (reveal === 'above') return `linear-gradient(to bottom, transparent, #000 ${stop(room)})`
  if (reveal === 'below') return `linear-gradient(to top, transparent, #000 ${stop(room)})`
  return `linear-gradient(to bottom, transparent, #000 ${stop(room)}, #000 ${stop(room + row)}, transparent)`
}

/**
 * A wheel of values slid up and down (ADR 0114, as a phone's picker): a row in the band, its value,
 * a neighbour's row faded on each side it reveals (`reveal`: both, or only above or below, so two
 * wheels stacked as a time signature's figures show theirs outside the pair, never over each other),
 * never cut off. A finger, a trackpad or the mouse wheel scrolls it, settling on a row; a row tapped
 * is taken; with the focus, ↑ ↓ step it (past a greyed value), Home and End go to its ends, and a value
 * typed (its digits one after the other) is taken. A screen reader hears a spin button named by
 * `label`, saying its value. Under reduced motion it moves at once.
 */
export function Wheel<T extends string | number>({
  label,
  options,
  value,
  onChange,
  reveal = 'both',
  row = ROW,
  band = true,
  className,
}: {
  label: string
  options: readonly WheelOption<T>[]
  value: T
  onChange: (value: T) => void
  reveal?: WheelReveal
  /** A row's height in CSS px. */
  row?: number
  /** The band the value stands in, drawn behind it. */
  band?: boolean
  className?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const current = options[index]
  // The scroll the wheel makes itself, so its own scroll events choose nothing.
  const placing = useRef(false)
  const settle = useRef<number | undefined>(undefined)
  const typed = useRef({ text: '', at: 0 })
  const room = Math.round(row * NEIGHBOUR)
  const above = reveal === 'below' ? 0 : room
  const below = reveal === 'above' ? 0 : room

  const place = (at: number, smooth: boolean) =>
    scrollTo(scroller.current, placing, at * row, smooth)
  // In place at once as it is drawn; smoothly to a value chosen after.
  const drawn = useRef(false)
  useLayoutEffect(() => {
    scrollTo(scroller.current, placing, index * row, drawn.current)
    drawn.current = true
  }, [index, row])
  useEffect(() => () => window.clearTimeout(settle.current), [])

  const choose = (at: number) => {
    const option = options[at]
    if (!option || option.disabled) return place(index, true)
    if (option.value !== value) onChange(option.value)
    else place(at, true)
  }
  // The nearest value it can take, from `at` the way given.
  const step = (from: number, by: 1 | -1) => {
    for (let at = from + by; at >= 0 && at < options.length; at += by)
      if (!options[at]?.disabled) return at
    return from
  }
  const ends = (by: 1 | -1) => step(by === 1 ? -1 : options.length, by)

  const onScroll = () => {
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => {
      const box = scroller.current
      if (!box) return
      const at = Math.round(box.scrollTop / row)
      if (placing.current) {
        placing.current = false
        if (at === index) return
      }
      choose(Math.min(options.length - 1, Math.max(0, at)))
    }, SETTLE)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const to = {
      ArrowUp: () => step(index, 1),
      ArrowDown: () => step(index, -1),
      Home: () => ends(1),
      End: () => ends(-1),
    }[event.key]
    if (to) {
      event.preventDefault()
      choose(to())
      return
    }
    if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return
    // Digits and letters typed one after the other, as long as they follow quickly.
    const now = event.timeStamp
    const text = (now - typed.current.at < TYPED ? typed.current.text : '') + event.key
    typed.current = { text, at: now }
    const exact = options.findIndex((option) => option.label === text)
    const at = exact >= 0 ? exact : options.findIndex((option) => option.label.startsWith(text))
    if (at < 0) return
    event.preventDefault()
    if (!options[at]?.disabled) choose(at)
  }

  const box: CSSProperties = {
    height: above + row + below,
    paddingTop: above,
    paddingBottom: below,
    scrollPaddingTop: above,
    maskImage: fadeOf(reveal, room, row),
  }
  return (
    // The focus ring round the value's row: the rows' fade would hide one on the scroller.
    <div
      className={cn('group/wheel relative w-16', className)}
      style={{
        marginTop: reveal === 'below' ? 0 : -above,
        marginBottom: reveal === 'above' ? 0 : -below,
      }}
    >
      {/* The band the value stands in, behind the rows; the focus ring drawn on it. */}
      <span
        aria-hidden
        data-slot="wheel-band"
        className={cn(
          'pointer-events-none absolute inset-x-0 rounded-xl',
          band && 'border border-input bg-chosen',
          'group-has-[:focus-visible]/wheel:outline-3 group-has-[:focus-visible]/wheel:outline-offset-2 group-has-[:focus-visible]/wheel:outline-ring',
        )}
        style={{ top: above, height: row }}
      />
      <div
        ref={scroller}
        data-slot="wheel"
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuetext={current?.label}
        aria-valuenow={typeof current?.value === 'number' ? current.value : undefined}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        className="relative snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none scrollbar-none"
        style={box}
      >
        {options.map((option, at) => (
          <div
            key={String(option.value)}
            aria-hidden
            data-value={option.value}
            data-current={at === index || undefined}
            data-off={option.disabled || undefined}
            onClick={() => choose(at)}
            className="grid cursor-pointer snap-start place-items-center font-display text-2xl leading-none font-bold text-muted-foreground tabular-nums transition-colors duration-200 ease-out select-none data-current:text-foreground data-off:cursor-default data-off:opacity-30 motion-reduce:transition-none"
            style={{ height: row }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}
