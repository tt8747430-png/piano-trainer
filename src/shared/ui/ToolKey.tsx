import { use, useId, type ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip'
import { KeysWait } from './keys-wait'

/**
 * A palette's key: a big square of its glyph or icon, named by `label` for a screen reader and in a
 * tooltip under a pointer; with `pressed` a toggle, filled while on. A key that cannot act here
 * stays in its place, greyed (loop round 31, Flat's rule): `aria-disabled`, so it keeps its focus
 * and its tooltip, which says why ("Tie: No note of the same pitch follows."); a press does nothing. What a term on its
 * face means (`description`: dolce, sweetly) is its tooltip and a screen reader's description, never
 * a line on it (ADR 0096). Pressed, it gives a little under the finger (ADR 0114).
 */
export function ToolKey({
  label,
  tip = label,
  description,
  pressed,
  tipSide = 'top',
  disabled,
  reason,
  className,
  onClick,
  children,
  ...props
}: {
  label: string
  /** Its tooltip, where it says more than its name: the group it is in (the palette's row). */
  tip?: string
  /** What the key's face means, where it prints a term. */
  description?: string | undefined
  pressed?: boolean
  /** Where its tooltip opens: over it, or under it where it stands at the screen's top. */
  tipSide?: 'top' | 'bottom'
  /** Why it cannot act now, said after its name in its tooltip while `disabled`. */
  reason?: string | undefined
} & Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size' | 'aria-label' | 'aria-pressed' | 'render' | 'nativeButton' | 'title'
>) {
  const id = useId()
  const wait = use(KeysWait)
  const off = Boolean(disabled) || wait !== null
  const why = reason ?? wait ?? undefined
  const about = description ? `${id}-about` : undefined
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            aria-label={label}
            aria-pressed={pressed}
            aria-describedby={about}
            aria-disabled={off || undefined}
            onClick={off ? (event) => event.preventDefault() : onClick}
            className={cn(
              'h-12 min-w-0 rounded-control landscape-phone:h-11 px-1 text-2xl leading-none font-normal duration-80 ease-out hover:bg-muted aria-pressed:bg-chosen aria-pressed:text-foreground aria-disabled:cursor-not-allowed aria-disabled:text-muted-foreground/40 aria-disabled:hover:bg-transparent [&_svg:not([class*=size-])]:size-5',
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
      </TooltipTrigger>
      <TooltipContent side={tipSide}>
        {off && why ? `${label}: ${why}` : (description ?? tip)}
      </TooltipContent>
    </Tooltip>
  )
}
