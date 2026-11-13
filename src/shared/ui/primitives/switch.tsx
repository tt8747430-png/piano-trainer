import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@/shared/lib'

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // The canvas's SWITCH value for value: 51 by 31, the chosen line's fill when off, sage when on.
        'peer group/switch relative inline-flex h-[1.9375rem] w-[3.1875rem] shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ease-out group-has-[:focus-visible]/field-label:outline-none after:absolute after:-inset-x-3 after:-inset-y-2 aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-checked:bg-switch-on data-unchecked:bg-chosen data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        // Its knob, 27 round, white, a soft ink shadow under it, 20 over when on.
        className="pointer-events-none block size-[1.6875rem] rounded-full bg-switch-knob shadow-[0_2px_4px_rgb(51_41_33/0.2)] transition-transform data-checked:translate-x-5 data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
