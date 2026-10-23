import type { ComponentProps } from 'react'
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
 * tooltip under a pointer; with `pressed` a toggle, filled while on; disabled, greyed.
 */
export function ToolKey({
  label,
  pressed,
  span = 'one',
  className,
  children,
  ...props
}: {
  label: string
  pressed?: boolean
  span?: keyof typeof SPAN
} & Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size' | 'aria-label' | 'aria-pressed' | 'render' | 'nativeButton'
>) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            aria-label={label}
            aria-pressed={pressed}
            className={cn(
              'h-12 min-w-0 rounded-xl landscape-phone:h-10 px-1 text-2xl leading-none font-normal hover:bg-chosen aria-pressed:border-selected aria-pressed:bg-selected aria-pressed:text-selected-foreground disabled:opacity-35 [&_svg:not([class*=size-])]:size-5',
              SPAN[span],
              className,
            )}
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
