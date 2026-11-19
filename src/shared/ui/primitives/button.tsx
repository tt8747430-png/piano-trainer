import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-pill border border-transparent bg-clip-padding text-base font-bold whitespace-nowrap transition-colors duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The one action: the only control filled with a colour, honey with the ink on it.
        default: 'bg-primary text-primary-foreground hover:brightness-95',
        outline:
          'border-input bg-card text-foreground hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:brightness-97 aria-expanded:brightness-97',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive:
          'border-destructive bg-card text-destructive hover:bg-destructive/10 focus-visible:outline-destructive',
        // The boards' quiet BTN: the act beside the honey one in a pair (Discard · Save to score), on the fill.
        quiet: 'bg-muted text-foreground hover:brightness-97',
        // A second action beside the honey one (Arpeggio, Hear these notes): paper, drawn in line.
        soft: 'border-input bg-card text-foreground hover:bg-muted aria-expanded:bg-muted',
        surface:
          'rounded-full border-input bg-card text-foreground hover:bg-muted aria-expanded:bg-muted',
        // Every bar's button, the canvas's IB and GLASSST: a 44 circle of glass (the line ring, the
        // float's shade, blurred 24 behind), its 22px icon in ink; Done and Edit the same glass as a capsule.
        bar: 'glass rounded-full border-0 text-[0.9375rem] font-semibold text-foreground hover:brightness-97 aria-expanded:brightness-97 aria-pressed:bg-chosen [&_svg:not([class*=size-])]:size-5.5',
        link: 'rounded-none text-base font-semibold text-link underline-offset-4 hover:underline',
        // A toolbar's round button, the score's bar's every one (ADR 0115, R31-E): no frame of its own on the
        // bar's band, the muted fill while it is hovered, open or pressed.
        tool: 'rounded-full font-semibold text-foreground hover:bg-muted aria-expanded:bg-muted aria-pressed:bg-chosen',
      },
      // Every size is at least a 44px touch target, so the CLI's smaller sizes are gone. A text
      // button has two heights (the kit's BTN): 44 compact in a row, 50 for a page's or a sheet's act,
      // each 20 in at its sides, 16 at the side an icon leads or trails.
      size: {
        default:
          'h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        lg: 'h-12.5 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        // Icons in icon-only buttons are 20px; text buttons keep 16px beside the label.
        icon: "size-11 [&_svg:not([class*='size-'])]:size-5",
        'icon-lg': "size-12 [&_svg:not([class*='size-'])]:size-5",
        // The Player's one round Play/Stop, 72px.
        play: "size-18 rounded-full [&_svg:not([class*='size-'])]:size-7",
      },
    },
    // A bar's 44 glass circle: a run of them side by side shares one capsule (theme.css, `.bar-round`).
    compoundVariants: [{ variant: 'bar', size: 'icon', class: 'bar-round' }],
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
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
