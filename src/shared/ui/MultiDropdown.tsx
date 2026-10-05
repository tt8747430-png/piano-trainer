import { choiceGroups, type Choices, type OptionValue } from './option'
import { OptionItems } from './OptionItems'
import { DropdownTrigger } from './DropdownTrigger'
import { Select, SelectContent } from './primitives/select'

/**
 * Several choices of many behind a pop-up button: the button shows its label and the chosen (each by
 * its short name where it has one), the list checks each, a tap on an item turning it on or off. `none` names an empty choice; a pop-up
 * that never empties has none.
 */
export function MultiDropdown<V extends OptionValue>({
  label,
  none,
  value,
  onChange,
  bare = false,
  className,
  ...choices
}: {
  label: string
  none?: string
  value: readonly V[]
  onChange: (value: V[]) => void
  /** Under a name already printed: the button shows its value alone. */
  bare?: boolean
  className?: string
} & Choices<V>) {
  const groups = choiceGroups(choices)
  const options = groups.flatMap((group) => group.options)
  return (
    <Select
      multiple
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      value={[...value]}
      onValueChange={(next: V[]) => onChange(next)}
    >
      <DropdownTrigger label={label} bare={bare} className={className}>
        {(chosen: V[]) =>
          chosen.length === 0
            ? none
            : options
                .filter((option) => chosen.includes(option.value))
                .map((option) => option.short ?? option.label)
                .join(' ')
        }
      </DropdownTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <OptionItems groups={groups} />
      </SelectContent>
    </Select>
  )
}
