import { Fragment } from 'react'
import type { Option, OptionGroup, OptionValue } from './option'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './primitives/select'

type Choices<V extends OptionValue> =
  | { readonly options: readonly Option<V>[]; readonly groups?: never }
  | { readonly groups: readonly OptionGroup<V>[]; readonly options?: never }

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
  const groups: readonly { readonly label?: string; readonly options: readonly Option<V>[] }[] =
    choices.groups ?? [{ options: choices.options }]
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
        <SelectValue className="min-w-0 flex-1 truncate text-left font-semibold" />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group, i) => (
          <Fragment key={group.label ?? i}>
            {i > 0 ? <SelectSeparator /> : null}
            <SelectGroup>
              {group.label ? <SelectLabel>{group.label}</SelectLabel> : null}
              {group.options.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={option.value}
                  aria-label={option.title}
                >
                  {option.label}
                  {option.detail ? (
                    <>
                      {' '}
                      <span className="text-muted-foreground">{option.detail}</span>
                    </>
                  ) : null}
                </SelectItem>
              ))}
            </SelectGroup>
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
