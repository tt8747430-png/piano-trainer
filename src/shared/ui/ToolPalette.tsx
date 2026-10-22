import { Tabs } from '@base-ui/react/tabs'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip'

/** A palette's grid: five columns, a row of finger-sized keys each; a key may span more. */
const GRID = 'grid grid-cols-5 gap-1.5'

/**
 * A notation app's palette (the score editor's): a floating panel of big keys, the actions used without pause
 * on top (`ToolPaletteActions`), then the kinds of tools as tabs of icons (`ToolPaletteTabs`), the
 * chosen tab's keys in a grid (`ToolPalettePanel`), and at its foot what the keys write into
 * (`ToolPaletteFoot`). A region named by its label; where it stands is its page's.
 */
export function ToolPalette<Tab extends string>({
  label,
  tab,
  onTabChange,
  className,
  children,
}: {
  label: string
  /** The kind of tools shown. */
  tab: Tab
  onTabChange: (tab: Tab) => void
  className?: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        'flex flex-col gap-2 rounded-4xl border border-border bg-muted p-2 shadow-xl shadow-foreground/15',
        className,
      )}
    >
      <Tabs.Root
        value={tab}
        onValueChange={(next: Tab) => onTabChange(next)}
        className="flex flex-col gap-2 landscape-phone:gap-1.5"
      >
        {children}
      </Tabs.Root>
    </section>
  )
}

/** The keys used again and again whatever the tab (Delete, Undo, Redo), in one row on top. */
export function ToolPaletteActions({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className={GRID}>
      {children}
    </div>
  )
}

/** The kinds of tools, each a tab drawn as its icon; `end` closes the palette, after the tabs. */
export function ToolPaletteTabs({
  label,
  end,
  className,
  children,
}: {
  label: string
  end?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 border-y border-hairline py-1.5 landscape-phone:py-0.5',
        className,
      )}
    >
      <Tabs.List
        aria-label={label}
        className="fade-scroll-x flex min-w-0 flex-1 gap-0.5 overflow-x-auto [scrollbar-width:none]"
      >
        {children}
      </Tabs.List>
      {end}
    </div>
  )
}

/**
 * One kind of tools: its picture alone, in one 24 px box so the row stands level (a notation app's
 * palette, Sibelius's), named by its label for a screen reader and in a tooltip; out of reach for
 * what the keys write, greyed.
 */
export function ToolPaletteTab({
  value,
  label,
  disabled = false,
  className,
  children,
}: {
  value: string
  label: string
  disabled?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <Tabs.Tab
      value={value}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        'grid h-11 min-w-11 flex-1 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground aria-selected:bg-selected aria-selected:text-selected-foreground data-disabled:opacity-35 data-disabled:hover:text-muted-foreground landscape-phone:h-9 [&_svg]:size-6',
        className,
      )}
    >
      {children}
    </Tabs.Tab>
  )
}

/** A tab's keys, in the palette's grid; shown while its tab is chosen. */
export function ToolPalettePanel({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: ReactNode
}) {
  return (
    <Tabs.Panel value={value} className={cn(GRID, 'outline-none', className)}>
      {children}
    </Tabs.Panel>
  )
}

/** The palette's foot: what the keys write into (a notation app's voices); `end` after it, in its corner. */
export function ToolPaletteFoot({ end, children }: { end?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1 border-t border-hairline pt-2 landscape-phone:pt-1.5">
      {/* A palette is a phone's width wherever it stands: its foot's choices a size down, to fit. */}
      <div className="min-w-0 flex-1 [&_[role=radio]]:px-1 [&_[role=radio]]:text-sm">
        {children}
      </div>
      {end}
    </div>
  )
}

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
