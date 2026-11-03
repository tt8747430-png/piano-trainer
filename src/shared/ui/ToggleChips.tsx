import { cn } from '@/shared/lib'
import { optionName, type Option, type OptionValue } from './option'
import { Toggle } from './primitives/toggle'

/**
 * Several on-or-offs of a few, every one in sight: a row of chips that wraps, each pressed while it
 * is chosen. A group named by its label; the chosen come back in the options' order. `className`
 * sets the chips' face where it is not the controls' (chord symbols, in the book serif). `disabled`,
 * the row stays in its place with its chips greyed, so what is under it never moves (A31).
 */
export function ToggleChips<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
  className,
  disabled = false,
}: {
  label: string
  value: readonly V[]
  options: readonly Option<V>[]
  onChange: (value: V[]) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <Toggle
          key={String(option.value)}
          aria-label={optionName(option)}
          pressed={!disabled && value.includes(option.value)}
          disabled={disabled}
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
