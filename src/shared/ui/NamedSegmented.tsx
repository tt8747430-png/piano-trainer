import type { ComponentProps } from 'react'
import type { OptionValue } from './option'
import { Segmented } from './Segmented'

/**
 * A segmented control with its name on screen beside it, for one whose words could be mistaken for
 * another's on the same screen (DESIGN: Segmented). A screen reader hears the name once.
 */
export function NamedSegmented<V extends OptionValue>(props: ComponentProps<typeof Segmented<V>>) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="shrink-0 text-muted-foreground">
        {props.label}
      </span>
      <Segmented {...props} />
    </div>
  )
}
