import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import type { Option, OptionValue } from './option'

/** A place's views as its bar names them: their name, the one shown, and how to show another. */
export interface TitleViews<V extends OptionValue> {
  readonly label: string
  readonly value: V
  readonly options: readonly Option<V>[]
  readonly onChange: (value: V) => void
}

/**
 * A place's views as its title (R31-S, the App Store's Today · Games): the words in the bar where the
 * title stands, the one shown in ink with an ink line under it, the other in soft ink; the bar's row
 * full, nothing under it. A radio group, as `Segmented` is: the arrows move to a view and show it.
 */
export function TitleTabs<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
}: TitleViews<V>) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const picked = options.find((option) => option.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className="flex min-w-0 items-center gap-3"
    >
      {options.map((option) => (
        <Radio.Root
          key={String(option.value)}
          value={option.value}
          className="relative inline-flex min-h-11 shrink-0 cursor-default items-center text-[1.625rem] leading-tight font-bold whitespace-nowrap text-muted-foreground/70 transition-colors duration-200 select-none hover:text-muted-foreground focus-visible:outline-offset-2 data-checked:text-foreground"
        >
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
