import { pickedOption, toggleValue, type Option, type OptionValue } from './option'
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'

/** One choice of a few, always one chosen: a segmented control, the chosen segment a card on its track. */
export function Segmented<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: V
  options: readonly Option<V>[]
  onChange: (value: V) => void
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[toggleValue(value)]}
      onValueChange={(pressed) => {
        const picked = pickedOption(options, value, pressed)
        if (picked) onChange(picked.value)
      }}
      variant="segment"
      spacing={1}
      className="flex w-full rounded-2xl bg-muted p-1"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={toggleValue(option.value)}
          value={toggleValue(option.value)}
          aria-label={option.title}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
