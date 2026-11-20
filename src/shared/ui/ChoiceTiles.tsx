import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** The canvas's `_TILE`: white on a hairline, ink once chosen. */
const TILE =
  'min-w-0 rounded-[12px] bg-card text-foreground ring-1 ring-border transition-colors duration-150 aria-checked:bg-foreground aria-checked:text-background'

/** Where the arrows take the choice: forward or back, wrapping at the ends. */
const STEPS: Readonly<Partial<Record<string, number>>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
}

/**
 * One choice of a few, drawn as tiles side by side (a new song's staves, key and time signature; a
 * block's layout and preset): a radio group with one tab stop on the chosen tile, the arrows moving
 * the choice as a radio group's do, a tap or Space choosing. `tile` draws a tile's face; `name` names a
 * tile whose face is a picture or a figure. The tiles are the canvas's `_TILE`; `bare` leaves the
 * face to `tileClassName` alone (a preset's card drawn in its own style).
 */
export function ChoiceTiles<V extends string | number>({
  label,
  value,
  options,
  onChange,
  tile,
  name,
  className,
  tileClassName,
  bare = false,
}: {
  label: string
  /** The chosen option, or none. */
  value: V | null
  options: readonly V[]
  onChange: (value: V) => void
  tile: (option: V, chosen: boolean) => ReactNode
  name?: (option: V) => string
  /** The tiles' layout (a grid of n columns, a row that scrolls). */
  className?: string
  tileClassName?: string
  bare?: boolean
}) {
  const stop = value !== null && options.includes(value) ? value : options[0]
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = STEPS[event.key]
    if (step === undefined) return
    event.preventDefault()
    const at = Math.max(
      0,
      options.findIndex((option) => option === stop),
    )
    const next = options[(at + step + options.length) % options.length]
    if (next === undefined) return
    onChange(next)
    event.currentTarget.querySelector<HTMLElement>(`[data-tile="${String(next)}"]`)?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className={className} onKeyDown={onKeyDown}>
      {options.map((option) => {
        const chosen = option === value
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={chosen}
            aria-label={name?.(option)}
            tabIndex={option === stop ? 0 : -1}
            data-tile={option}
            onClick={() => onChange(option)}
            className={cn(!bare && TILE, 'focus-visible:-outline-offset-3', tileClassName)}
          >
            {tile(option, chosen)}
          </button>
        )
      })}
    </div>
  )
}
