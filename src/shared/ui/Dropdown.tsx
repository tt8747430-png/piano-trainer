import { choiceGroups, type Choices, type OptionValue } from './option'
import { OptionItems } from './OptionItems'
import { Select, SelectContent, SelectTrigger, SelectValue } from './primitives/select'

/**
 * One choice of many behind a pop-up button (Apple's): the button shows its label and the current
 * value, the list checks it. Five or fewer short nouns are a `Segmented` instead.
 */
export function Dropdown<V extends OptionValue>({
  label,
  value,
  onChange,
  className,
  ...choices
}: {
  label: string
  value: V
  onChange: (value: V) => void
  className?: string
} & Choices<V>) {
  const groups = choiceGroups(choices)
  const items = groups.flatMap((group) =>
    group.options.map((option) => ({ value: option.value, label: option.label })),
  )
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next !== null && next !== value) onChange(next)
      }}
    >
      <SelectTrigger aria-label={label} className={className}>
        <span aria-hidden className="text-muted-foreground">
          {label}
        </span>
        <SelectValue className="block min-w-0 flex-1 truncate text-left font-semibold" />
      </SelectTrigger>
      <SelectContent>
        <OptionItems groups={groups} />
      </SelectContent>
    </Select>
  )
}
