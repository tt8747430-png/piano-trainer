import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/shared/lib'
import { optionName, type Option, type OptionValue } from './option'

/**
 * One choice of a few whose names are too long for a segmented control's track: a row of chips that
 * wraps, every one in sight, the chosen filled in ink with the page's colour on it (canvas 153). A
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
        '-my-[5px] flex gap-1.5',
        scroll
          ? '-mx-(--gutter) scrollbar-none overflow-x-auto overscroll-x-contain px-(--gutter)'
          : 'flex-wrap',
      )}
    >
      {options.map((option) => (
        <Radio.Root
          key={String(option.value)}
          value={option.value}
          aria-label={optionName(option)}
          className="inline-flex h-11 shrink-0 min-w-14 cursor-default items-center justify-center rounded-pill border-x-0 border-y-[5px] border-transparent bg-muted bg-clip-padding px-3.5 text-sm font-semibold text-muted-foreground select-none choice focus-visible:-outline-offset-3 data-checked:bg-foreground! data-checked:text-background!"
        >
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
