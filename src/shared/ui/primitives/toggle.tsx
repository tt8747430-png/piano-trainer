import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1.5 text-base font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'rounded-xl bg-transparent hover:bg-muted data-pressed:bg-muted',
        outline: 'rounded-xl border border-input bg-transparent hover:bg-muted',
        // A choice in a scrolling row: roots, families, keys.
        chip: 'rounded-full bg-card px-4 text-foreground ring-1 ring-border hover:bg-muted data-pressed:bg-primary data-pressed:text-primary-foreground data-pressed:ring-primary',
        // A segment of a pill segmented control.
        segment:
          'flex-1 rounded-xl px-3 text-muted-foreground hover:text-foreground data-pressed:bg-card data-pressed:text-foreground data-pressed:shadow-sm',
      },
      size: {
        default: 'h-11 min-w-11 px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
