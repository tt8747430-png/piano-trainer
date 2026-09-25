import { pickedOption, toggleValue, type Option, type OptionValue } from './option'
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'

/** One choice of many in a row that scrolls sideways past the screen's edge. */
export function ChipRow<V extends OptionValue>({
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
      variant="chip"
      spacing={2}
      className="-mx-4 flex w-auto snap-x scroll-px-4 overflow-x-auto px-4 pb-1 scrollbar-none"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={toggleValue(option.value)}
          value={toggleValue(option.value)}
          aria-label={option.title}
          className="snap-start"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
