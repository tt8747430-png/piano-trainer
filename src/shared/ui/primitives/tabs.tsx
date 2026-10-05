import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from 'cn'

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-6', className)}
      {...props}
    />
  )
}

/** A strip of tabs on a hairline: it scrolls sideways where its tabs outrun the screen. */
function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'relative flex gap-1 overflow-x-auto border-b border-border scrollbar-none',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-base font-semibold whitespace-nowrap text-muted-foreground transition-colors duration-200 ease-out select-none after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 after:transition-opacity after:duration-200 hover:text-foreground focus-visible:-outline-offset-3 disabled:pointer-events-none disabled:opacity-50 data-active:text-foreground data-active:after:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
