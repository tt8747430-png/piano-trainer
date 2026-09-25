import { pickedOption, toggleValue, type Option, type OptionValue } from './option'
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'

/** One choice of a few, always one chosen: a pill segmented control. */
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
      spacing={0}
      className="flex w-full gap-1 rounded-2xl bg-muted p-1"
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
