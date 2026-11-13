import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/shared/lib'
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
  scroll = false,
}: {
  label: string
  value: V
  options: readonly Option<V>[]
  onChange: (value: V) => void
  /** One row that scrolls sideways past the screen's edges, never wrapping (the four levels). */
  scroll?: boolean
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const picked = options.find((option) => option.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className={cn(
        'flex gap-2',
        scroll
          ? '-mx-(--gutter) scrollbar-none overflow-x-auto overscroll-x-contain px-(--gutter) py-0.5'
          : 'flex-wrap',
      )}
    >
      {options.map((option) => (
        <Radio.Root
          key={String(option.value)}
          value={option.value}
          aria-label={optionName(option)}
          className="inline-flex min-h-11 shrink-0 min-w-14 cursor-default items-center justify-center rounded-pill border border-transparent bg-muted px-4 text-[0.9375rem] font-semibold text-muted-foreground select-none choice focus-visible:-outline-offset-3"
        >
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
