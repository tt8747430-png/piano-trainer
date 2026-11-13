import type { ComponentProps } from 'react'
import type { OptionValue } from './option'
import { Segmented } from './Segmented'

/**
 * A segmented control with its name on screen above it, full width, as every field's name stands
 * (`Labelled`; canvas 127). A screen reader hears the name once.
 */
export function NamedSegmented<V extends OptionValue>(props: ComponentProps<typeof Segmented<V>>) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span aria-hidden className="text-sm text-muted-foreground">
        {props.label}
      </span>
      <Segmented {...props} />
    </div>
  )
}
