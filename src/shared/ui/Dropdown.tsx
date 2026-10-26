import type { ReactNode } from 'react'
import { choiceGroups, listKey, type Choices, type OptionValue } from './option'
import { OptionItems } from './OptionItems'
import { DropdownTrigger } from './DropdownTrigger'
import { Select, SelectContent } from './primitives/select'

/**
 * One choice of many behind a pop-up button (Apple's): the button shows its label and the current
 * value, the list checks it. Five or fewer short nouns are a `Segmented` instead.
 */
export function Dropdown<V extends OptionValue>({
  label,
  value,
  onChange,
  bare = false,
  face,
  align,
  className,
  ...choices
}: {
  label: string
  value: V
  onChange: (value: V) => void
  /** Under a name already printed: the button shows its value alone. */
  bare?: boolean
  /** How the button shows the value where it is not its label: shorter, beside a picture. */
  face?: (value: V) => ReactNode
  /** Where the list opens from the button's edge, in place of over the button. */
  align?: 'start' | 'end'
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
      <DropdownTrigger label={label} bare={bare} className={className}>
        {face}
      </DropdownTrigger>
      <SelectContent
        key={listKey(groups)}
        {...(align ? { align, alignItemWithTrigger: false } : {})}
      >
        <OptionItems groups={groups} />
      </SelectContent>
    </Select>
  )
}
