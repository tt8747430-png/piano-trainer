import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { useId } from 'react'
import { cn } from '@/shared/lib'
import { optionName, type Option, type OptionValue } from './option'

/**
 * One choice of a few: a segmented control, the chosen segment a card on its track, a segment's
 * picture (an option's `icon`) over its label; `null` chooses none (what it shows is none of them).
 * A segment that cannot be chosen (an option's `reason`) is greyed, saying why in the browser's own
 * tooltip and to a screen reader. A radio group: the arrows move to a segment and choose it.
 */
export function Segmented<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  compact = false,
}: {
  label: string
  value: V | null
  options: readonly Option<V>[]
  onChange: (value: V) => void
  /** Shown, but not to be changed: its segments faded. */
  disabled?: boolean
  /** In a bar's second row (a document's language): 36px tall, its reach still 44px. */
  compact?: boolean
}) {
  const id = useId()
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
      className={cn(
        'flex w-full rounded-2xl bg-muted',
        compact ? 'gap-0.5 rounded-full p-0.5' : 'gap-1 p-1',
      )}
    >
      {options.map((option, index) => {
        const why = option.reason ? `${id}-why-${index}` : undefined
        return (
          <Radio.Root
            key={String(option.value)}
            value={option.value}
            aria-label={optionName(option)}
            aria-describedby={why}
            title={option.reason}
            disabled={option.reason !== undefined}
            className={cn(
              'inline-flex min-h-11 min-w-11 flex-1 cursor-default flex-col items-center justify-center gap-1 rounded-lg border border-transparent px-2 py-1.5 text-center text-base leading-tight font-semibold hyphens-auto wrap-break-word text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground data-checked:border-input data-checked:bg-chosen data-checked:text-foreground data-disabled:opacity-50 data-disabled:hover:text-muted-foreground',
              // Crowded on a phone's width: the words a size down, to fit.
              crowded && 'max-sm:px-1 max-sm:text-sm',
              compact &&
                'relative min-h-8 rounded-full py-0.5 text-sm before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[""]',
            )}
          >
            {option.icon}
            {option.label}
            {why ? (
              <span id={why} hidden>
                {option.reason}
              </span>
            ) : null}
          </Radio.Root>
        )
      })}
    </RadioGroup>
  )
}
