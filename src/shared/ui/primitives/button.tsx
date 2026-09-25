import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-base font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        soft: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary/80',
        surface:
          'rounded-full bg-card text-foreground shadow-sm ring-1 ring-border hover:bg-muted aria-expanded:bg-muted',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      // Every size is at least a 44px touch target (spec §8), so the CLI's smaller sizes are gone.
      size: {
        default:
          'h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        lg: 'h-12 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        // Icons in icon-only buttons are 20px (spec §2.3); text buttons keep 16px beside the label.
        icon: "size-11 [&_svg:not([class*='size-'])]:size-5",
        'icon-lg': "size-12 [&_svg:not([class*='size-'])]:size-5",
        pill: 'h-14 gap-2 rounded-full px-6 text-lg has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        // The Player's one round Play/Stop, 72px.
        play: "size-18 rounded-full [&_svg:not([class*='size-'])]:size-7",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
