import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import type { Option } from '../option'

/**
 * One choice of a few set in the keyboard's rail: its name small, then its words as chips on the
 * drawn rail, the chosen one filled as a pressed rail button is. A radio group named by its label.
 */
export function RailChoice<V extends string>({
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
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const picked = options.find((option) => option.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className="flex h-11 shrink-0 items-end gap-0.5 px-1"
    >
      <span aria-hidden className="flex h-7 items-center pr-1 text-xs text-on-key-rail/70">
        {label}
      </span>
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          className="flex h-11 cursor-default items-end outline-none select-none group/choice"
        >
          <span className="flex h-7 items-center rounded-md px-2 text-sm font-semibold whitespace-nowrap text-on-key-rail transition-colors duration-200 ease-out group-hover/choice:bg-on-key-rail/10 group-focus-visible/choice:outline-3 group-focus-visible/choice:-outline-offset-3 group-focus-visible/choice:outline-ring group-data-checked/choice:bg-on-key-rail group-data-checked/choice:text-key-rail">
            {option.label}
          </span>
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
