import type { Option, OptionValue } from './option'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './primitives/select'

/**
 * Several choices of many behind a pop-up button: the button shows its label and the chosen, the
 * list checks each, a tap on an item turning it on or off. `none` names an empty choice.
 */
export function MultiDropdown<V extends OptionValue>({
  label,
  none,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  none: string
  value: readonly V[]
  options: readonly Option<V>[]
  onChange: (value: V[]) => void
  className?: string
}) {
  return (
    <Select
      multiple
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      value={[...value]}
      onValueChange={(next: V[]) => onChange(next)}
    >
      <SelectTrigger aria-label={label} className={className}>
        <span aria-hidden className="text-muted-foreground">
          {label}
        </span>
        <SelectValue className="block min-w-0 flex-1 truncate text-left font-semibold">
          {(chosen: V[]) =>
            chosen.length === 0
              ? none
              : options
                  .filter((option) => chosen.includes(option.value))
                  .map((option) => option.label)
                  .join(' ')
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {options.map((option) => (
          <SelectItem key={String(option.value)} value={option.value} aria-label={option.title}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
