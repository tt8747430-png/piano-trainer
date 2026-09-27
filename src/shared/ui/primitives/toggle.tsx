import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1.5 text-base font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'rounded-xl bg-transparent hover:bg-muted data-pressed:bg-muted',
        outline: 'rounded-xl border border-input bg-transparent hover:bg-muted',
        // A segment of a segmented control: the chosen one is a card on the muted track, in the line.
        segment:
          'flex-1 rounded-lg border border-transparent px-2 text-center leading-tight whitespace-normal text-muted-foreground hover:text-foreground data-pressed:border-input data-pressed:bg-card data-pressed:text-foreground',
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
