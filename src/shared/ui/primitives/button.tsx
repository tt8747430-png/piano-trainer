import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border-2 border-transparent bg-clip-padding font-display text-lg whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The book's yellow button, drawn with the brown line.
        default: 'border-border bg-primary text-primary-foreground hover:brightness-95',
        outline:
          'border-border bg-card text-foreground hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:brightness-97 aria-expanded:brightness-97',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive:
          'border-destructive bg-card text-destructive hover:bg-destructive/10 focus-visible:ring-destructive',
        // A second action beside the yellow one (Arpeggio, Hear these notes): paper, drawn in line.
        soft: 'border-border bg-card text-foreground hover:bg-muted aria-expanded:bg-muted',
        surface:
          'rounded-full border-border bg-card text-foreground hover:bg-muted aria-expanded:bg-muted',
        link: 'font-sans text-base font-semibold text-link underline-offset-4 hover:underline',
      },
      // Every size is at least a 44px touch target (spec §8), so the CLI's smaller sizes are gone.
      size: {
        default:
          'h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        lg: 'h-12 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        // Icons in icon-only buttons are 20px (spec §2.3); text buttons keep 16px beside the label.
        icon: "size-11 [&_svg:not([class*='size-'])]:size-5",
        'icon-lg': "size-12 [&_svg:not([class*='size-'])]:size-5",
        pill: 'h-14 gap-2 px-6 text-xl has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
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
