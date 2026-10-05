import type { Option, OptionValue } from './option'
import { Toggle } from './primitives/toggle'

/**
 * Several on-or-offs of a few, every one in sight: a row of chips that wraps, each pressed while it
 * is chosen. A group named by its label; the chosen come back in the options' order.
 */
export function ToggleChips<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: readonly V[]
  options: readonly Option<V>[]
  onChange: (value: V[]) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Toggle
          key={String(option.value)}
          aria-label={option.title}
          pressed={value.includes(option.value)}
          onPressedChange={(on) =>
            onChange(
              options
                .filter((each) => (each.value === option.value ? on : value.includes(each.value)))
                .map((each) => each.value),
            )
          }
          className="min-w-14 text-muted-foreground aria-pressed:text-foreground"
        >
          {option.label}
        </Toggle>
      ))}
    </div>
  )
}
