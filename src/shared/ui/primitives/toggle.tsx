import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const toggleVariants = cva(
  "group/toggle inline-flex shrink-0 items-center justify-center border border-input bg-card text-base font-semibold whitespace-nowrap text-foreground transition-colors duration-200 ease-out select-none hover:bg-muted disabled:pointer-events-none disabled:opacity-50 aria-pressed:border-foreground aria-pressed:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      // Every size is at least a 44px touch target.
      size: {
        default: 'h-11 min-w-11 gap-2 rounded-2xl px-4',
        icon: 'size-11 rounded-full',
        // A tile: its icon over its name, as wide as its grid's column.
        tile: 'min-h-18 w-full flex-col gap-1.5 rounded-2xl px-2 py-2.5 text-sm leading-tight font-medium whitespace-normal text-muted-foreground aria-pressed:text-foreground',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

function Toggle({
  className,
  size = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
