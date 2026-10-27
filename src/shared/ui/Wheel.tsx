import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react'
import { cn } from '@/shared/lib'

/** One value of a wheel, as it is printed on it; a greyed one is passed over. */
export interface WheelOption<T extends string | number> {
  readonly value: T
  readonly label: string
  readonly disabled?: boolean
}

/** A row's height, in CSS px; the wheel, a touch target twice as tall, shows one and the halves of two. */
const ROW = 40
/** How long a scroll rests before the value under the band is taken, in ms. */
const SETTLE = 120
/** How long a digit typed waits for the next, in ms. */
const TYPED = 900

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/**
 * A wheel of values slid up and down (ADR 0114, as a phone's picker): a row in the band, its value,
 * the halves of the rows either side faded. A finger, a trackpad or the mouse wheel scrolls it, settling on a row; a row
 * tapped is taken; with the focus, ↑ ↓ step it (past a greyed value), Home and End go to its ends, and
 * a value typed (its digits one after the other) is taken. A screen reader hears a spin button named
 * by `label`, saying its value.
 */
export function Wheel<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: readonly WheelOption<T>[]
  value: T
  onChange: (value: T) => void
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

  const place = (at: number, smooth: boolean) => {
    const box = scroller.current
    if (!box) return
    const top = at * ROW
    if (Math.abs(box.scrollTop - top) < 1) return
    placing.current = true
    if (smooth && !reduced() && box.scrollTo) box.scrollTo({ top, behavior: 'smooth' })
    else box.scrollTop = top
  }
  // In place at once as it is drawn; smoothly to a value chosen after.
  const drawn = useRef(false)
  useLayoutEffect(() => {
    place(index, drawn.current)
    drawn.current = true
  }, [index])
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
      const at = Math.round(box.scrollTop / ROW)
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
    const now = Date.now()
    const text = (now - typed.current.at < TYPED ? typed.current.text : '') + event.key
    typed.current = { text, at: now }
    const exact = options.findIndex((option) => option.label === text)
    const at = exact >= 0 ? exact : options.findIndex((option) => option.label.startsWith(text))
    if (at < 0) return
    event.preventDefault()
    if (!options[at]?.disabled) choose(at)
  }

  return (
    // The focus ring on the wheel's box: the rows' fade would hide one on the scroller.
    <div
      className={cn(
        'relative w-16 rounded-xl has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
        className,
      )}
    >
      {/* The band the value stands in, behind the rows. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-5 h-10 rounded-xl border border-input bg-chosen"
      />
      <div
        ref={scroller}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuetext={current?.label}
        aria-valuenow={typeof current?.value === 'number' ? current.value : undefined}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        className="relative h-20 snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-xl py-5 outline-none scrollbar-none [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]"
      >
        {options.map((option, at) => (
          <div
            key={String(option.value)}
            aria-hidden
            data-value={option.value}
            data-current={at === index || undefined}
            data-off={option.disabled || undefined}
            onClick={() => choose(at)}
            className="grid h-10 cursor-pointer snap-center place-items-center font-display text-2xl leading-none font-bold text-muted-foreground tabular-nums transition-colors duration-200 ease-out select-none data-current:text-foreground data-off:cursor-default data-off:opacity-30 motion-reduce:transition-none"
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}
