import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/shared/lib'
import { optionName, type Option, type OptionValue } from './option'

/**
 * One choice of a few, always one chosen: a segmented control, the chosen segment a card on its
 * track, a segment's picture (an option's `icon`) over its label. A radio group: the arrows move to a
 * segment and choose it.
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
  // Four segments, or words enough for a line (Трезвучия · Септаккорды · Нонаккорды), crowd a phone.
  const crowded =
    options.length >= 4 || options.reduce((sum, option) => sum + option.label.length, 0) > 24
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
          aria-label={optionName(option)}
          className={cn(
            'inline-flex min-h-11 min-w-11 flex-1 cursor-default flex-col items-center justify-center gap-1 rounded-lg border border-transparent px-2 py-1.5 text-center text-base leading-tight font-semibold hyphens-auto wrap-break-word text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground data-checked:border-input data-checked:bg-chosen data-checked:text-foreground data-disabled:opacity-50 data-disabled:hover:text-muted-foreground',
            // Crowded on a phone's width: the words a size down, to fit.
            crowded && 'max-sm:px-1 max-sm:text-sm',
          )}
        >
          {option.icon}
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
