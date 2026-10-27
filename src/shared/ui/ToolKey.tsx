import { useId, type ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip'

/** How far a key reaches in the grid: a wide key two columns, a tall one two rows, a row the whole row. */
const SPAN = {
  one: '',
  wide: 'col-span-2',
  tall: 'row-span-2 h-auto landscape-phone:h-auto',
  row: 'col-span-full',
} as const satisfies Record<string, string>

/**
 * A palette's key: a big square of its glyph or icon, named by `label` for a screen reader and in a
 * tooltip under a pointer; with `pressed` a toggle, filled while on; disabled, greyed. What a term
 * on its face means (`description`: dolce, sweetly) is its tooltip and a screen reader's description,
 * never a line on it; greyed, it says why (`reason`) in the browser's own tooltip, the pointer kept
 * on it so it can, and to a screen reader (ADR 0096). Pressed, it gives a little under the finger
 * (ADR 0114).
 */
export function ToolKey({
  label,
  tip = label,
  description,
  reason,
  pressed,
  span = 'one',
  disabled,
  className,
  children,
  ...props
}: {
  label: string
  /** Its tooltip, where it says more than its name: the group it is in (the palette's row). */
  tip?: string
  /** What the key's face means, where it prints a term. */
  description?: string | undefined
  /** Why it is greyed, said while it is. */
  reason?: string | undefined
  pressed?: boolean
  span?: keyof typeof SPAN
} & Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size' | 'aria-label' | 'aria-pressed' | 'render' | 'nativeButton' | 'title'
>) {
  const id = useId()
  const why = disabled ? reason : undefined
  const about = description ? `${id}-about` : undefined
  const whyId = why ? `${id}-why` : undefined
  return (
    // Greyed with a reason, the browser's tooltip says it: the key's own would only name it.
    <Tooltip disabled={why !== undefined}>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            aria-label={label}
            aria-pressed={pressed}
            aria-describedby={[about, whyId].filter(Boolean).join(' ') || undefined}
            title={why}
            disabled={disabled}
            className={cn(
              'h-12 min-w-0 rounded-xl landscape-phone:h-10 px-1 text-2xl leading-none font-normal duration-80 ease-out hover:bg-chosen active:scale-95 motion-reduce:active:scale-100 aria-pressed:border-selected aria-pressed:bg-selected aria-pressed:text-selected-foreground disabled:opacity-35 [&_svg:not([class*=size-])]:size-5',
              why && 'disabled:pointer-events-auto disabled:hover:bg-card',
              SPAN[span],
              className,
            )}
            {...props}
          />
        }
      >
        {children}
        {description ? (
          <span id={about} hidden>
            {description}
          </span>
        ) : null}
        {why ? (
          <span id={whyId} hidden>
            {why}
          </span>
        ) : null}
      </TooltipTrigger>
      <TooltipContent>{description ?? tip}</TooltipContent>
    </Tooltip>
  )
}
