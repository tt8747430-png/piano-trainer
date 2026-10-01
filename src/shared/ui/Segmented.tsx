import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import type { Option, OptionValue } from './option'

/**
 * One choice of a few, always one chosen: a segmented control, the chosen segment a card on its
 * track. A radio group: the arrows move to a segment and choose it.
 */
export function Segmented<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string
  value: V
  options: readonly Option<V>[]
  onChange: (value: V) => void
  /** Shown, but not to be changed: its segments faded. */
  disabled?: boolean
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        const picked = options.find((option) => option.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className="flex w-full gap-1 rounded-2xl bg-muted p-1"
    >
      {options.map((option) => (
        <Radio.Root
          key={String(option.value)}
          value={option.value}
          aria-label={option.title}
          className="inline-flex h-11 min-w-11 flex-1 cursor-default items-center justify-center rounded-lg border border-transparent px-2 text-center text-base leading-tight font-semibold text-muted-foreground transition-colors duration-200 ease-out outline-none select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring data-checked:border-input data-checked:bg-card data-checked:text-foreground data-disabled:opacity-50 data-disabled:hover:text-muted-foreground"
        >
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
