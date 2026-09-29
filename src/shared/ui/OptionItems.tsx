import { Fragment } from 'react'
import type { ChoiceGroup, OptionValue } from './option'
import { SelectGroup, SelectItem, SelectLabel, SelectSeparator } from './primitives/select'

/**
 * A pop-up list's items group by group: a group's label over its items, a line between groups, an
 * item's second word in soft ink after its label.
 */
export function OptionItems<V extends OptionValue>({
  groups,
}: {
  groups: readonly ChoiceGroup<V>[]
}) {
  return (
    <>
      {groups.map((group, i) => (
        <Fragment key={group.label ?? i}>
          {i > 0 ? <SelectSeparator /> : null}
          <SelectGroup>
            {group.label ? <SelectLabel>{group.label}</SelectLabel> : null}
            {group.options.map((option) => (
              <SelectItem key={String(option.value)} value={option.value} aria-label={option.title}>
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
    </>
  )
}
