import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * The canvas's `_TILE`: white on a hairline, ink once chosen; the muted fill under a pointer while it
 * is not the one chosen; faded where it cannot be chosen.
 */
const TILE =
  'min-w-0 cursor-default rounded-control bg-card text-foreground ring-1 ring-border transition-colors duration-150 select-none hover:not-aria-checked:bg-muted aria-checked:bg-foreground aria-checked:text-background data-disabled:opacity-50'

/**
 * One choice of a few, drawn as tiles side by side (a new song's staves, key and time signature; a
 * block's preset): the kit's radio group, as `Segmented` and `PictureTiles` are, the arrows moving
 * to a tile and choosing it. `tile` draws a tile's face; `name` names a tile whose face is a picture
 * or a figure. A tap on the tile already chosen calls `onChange` with it again, for a choice that a
 * second tap takes back (the key, back to C major). The tiles are the canvas's `_TILE`; `bare` leaves
 * the face to `tileClassName` alone (a preset's card drawn in its own style).
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
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const picked = options.find((option) => option === next)
        if (picked !== undefined && picked !== value) onChange(picked)
      }}
      className={className}
    >
      {options.map((option) => {
        const chosen = option === value
        return (
          <Radio.Root
            key={option}
            value={option}
            aria-label={name?.(option)}
            onClick={chosen ? () => onChange(option) : undefined}
            className={cn(!bare && TILE, 'focus-visible:-outline-offset-3', tileClassName)}
          >
            {tile(option, chosen)}
          </Radio.Root>
        )
      })}
    </RadioGroup>
  )
}
