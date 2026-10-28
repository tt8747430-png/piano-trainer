import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { optionName, type Option, type OptionValue } from './option'

/**
 * One choice of a few whose names are too long for a segmented control's track: a row of chips that
 * wraps, every one in sight, the chosen ink on sand in an ink line, as a toggle chip is when on. A
 * radio group: the arrows move to a chip and choose it.
 */
export function ChoiceChips<V extends OptionValue>({
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
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => (
        <Radio.Root
          key={String(option.value)}
          value={option.value}
          aria-label={optionName(option)}
          className="inline-flex min-h-11 min-w-14 cursor-default items-center justify-center rounded-xl border border-input bg-card px-3 text-base font-semibold text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring data-checked:border-foreground data-checked:bg-muted data-checked:text-foreground"
        >
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
