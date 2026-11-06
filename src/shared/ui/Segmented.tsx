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
        // Its segments side by side in its line, the chosen filled to the control's edges (R15).
        'flex w-full border border-input bg-card',
        compact ? 'rounded-pill' : 'rounded-control',
      )}
    >
      {options.map((option, index) => {
        const why = option.reason ? `${id}-why-${index}` : undefined
        return (
          <Radio.Root
            key={String(option.value)}
            value={option.value}
            // Named by its word; its second line (`detail`) describes it.
            aria-label={optionName(option) ?? (option.detail ? option.label : undefined)}
            aria-describedby={
              [why, option.detail ? `${id}-detail-${index}` : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
            title={option.reason}
            disabled={option.reason !== undefined}
            className={cn(
              'inline-flex min-h-11 min-w-11 flex-1 cursor-default flex-col items-center justify-center gap-1 px-2 py-1.5 text-center text-base leading-tight font-semibold hyphens-manual wrap-break-word text-muted-foreground select-none choice border-s border-input first-of-type:border-s-0 focus-visible:-outline-offset-3 data-disabled:opacity-50',
              // Crowded on a phone's width: the words a size down, to fit.
              crowded && 'max-sm:px-1 max-sm:text-sm',
              compact
                ? 'first-of-type:rounded-s-pill last-of-type:rounded-e-pill'
                : 'first-of-type:rounded-s-control last-of-type:rounded-e-control',
              compact &&
                'relative min-h-8 py-0.5 text-sm whitespace-nowrap before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[""]',
            )}
          >
            {option.icon}
            {option.label}
            {/* A second line under its word, in soft ink: what the segment holds (Scales' "7 notes"). */}
            {option.detail ? (
              <span
                id={`${id}-detail-${index}`}
                className="text-sm font-normal text-muted-foreground"
              >
                {option.detail}
              </span>
            ) : null}
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
