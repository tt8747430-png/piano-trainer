import type { ComponentProps } from 'react'
import { Button } from './primitives/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip'

/**
 * A tool in a palette: a 44px square of its icon or glyph, named by `label` for a screen reader and
 * in a tooltip under a pointer. With `pressed` it is a toggle, filled and ringed in ink while on.
 */
export function ToolButton({
  label,
  pressed,
  children,
  ...props
}: { label: string; pressed?: boolean } & Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size' | 'aria-label' | 'aria-pressed' | 'render' | 'nativeButton'
>) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={label}
            aria-pressed={pressed}
            className="shrink-0 aria-pressed:border-foreground aria-pressed:bg-muted"
            {...props}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
