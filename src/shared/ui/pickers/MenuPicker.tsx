import type { ReactNode } from 'react'
import { Listbox } from '../Listbox'
import { choiceGroups, optionName, type Choices, type OptionValue } from '../option'
import { PickerShell } from './PickerShell'

/**
 * One choice of many in a plain list (a chord's quality, its voicing, a scale's kind, a tempo's rung):
 * the value with ⌃⌄, as every picker shows it, opening the list in a popover, or a sheet on a phone;
 * the chosen option checked, the arrows moving, Enter choosing and closing. An option that cannot be
 * chosen here (its `reason`) is left out (R30), never greyed.
 */
export function MenuPicker<V extends OptionValue>({
  label,
  value,
  onChange,
  bare,
  face,
  className,
  ...choices
}: {
  label: string
  value: V
  onChange: (value: V) => void
  bare?: boolean
  /** How the button shows the value, where not by its label: shorter, or a picture. */
  face?: (value: V) => ReactNode
  className?: string
} & Choices<V>) {
  const groups = choiceGroups(choices).map((group) => ({
    ...group,
    options: group.options.filter((option) => option.reason === undefined),
  }))
  const current = choiceGroups(choices)
    .flatMap((group) => group.options)
    .find((option) => option.value === value)
  const spoken = current ? (optionName(current) ?? current.label) : String(value)
  return (
    <PickerShell
      label={label}
      value={face ? face(value) : (current?.label ?? String(value))}
      spoken={spoken}
      bare={bare}
      className={className}
    >
      {({ close, start }) => (
        <div {...start}>
          <Listbox
            label={label}
            className="gap-0.5 [&_[role=group]>p]:px-3 [&_[role=group]>p]:pt-3 [&_[role=group]>p]:pb-1"
            optionClassName="min-h-11 rounded-xl px-3 text-base"
            groups={groups
              .filter((group) => group.options.length > 0)
              .map((group) => ({
                ...(group.label ? { label: group.label } : {}),
                options: group.options.map((option) => ({
                  key: String(option.value),
                  selected: option.value === value,
                  content: (
                    <span className="flex min-w-0 items-center gap-2">
                      {option.icon}
                      <span>{option.label}</span>
                      {option.detail ? (
                        <span className="text-muted-foreground">{option.detail}</span>
                      ) : null}
                    </span>
                  ),
                  onChoose: () => {
                    close()
                    if (option.value !== value) onChange(option.value)
                  },
                })),
              }))}
          />
        </div>
      )}
    </PickerShell>
  )
}
