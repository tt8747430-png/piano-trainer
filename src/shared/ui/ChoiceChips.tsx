import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/shared/lib'
import { optionName, type Option, type OptionValue } from './option'

/**
 * How the chips look: `ink`, 36 drawn in a 44 reach and 8 apart, the chosen filled in ink with the
 * page's colour on it (canvas 153);
 * `honey`, on a sheet of choices that each show what they are (the Player's Pattern sheet), each a
 * card's pill in a hairline, the chosen washed in honey in the honey ring, 36 drawn in a 44 reach.
 */
const TONES = {
  ink: {
    group: '-my-1 gap-x-2 gap-y-0',
    chip: 'min-w-11 border-y-4 bg-muted px-4 text-sm text-muted-foreground choice data-checked:bg-foreground! data-checked:text-background!',
  },
  honey: {
    group: '-my-1 gap-x-2 gap-y-0',
    chip: 'gap-1 border-y-4 whitespace-nowrap bg-card px-4 text-[0.8125rem] text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors duration-200 ease-out hover:bg-muted data-checked:bg-chosen-honey data-checked:shadow-[inset_0_0_0_1px_var(--color-honey-ring)] data-[empty]:not-data-checked:opacity-45',
  },
} as const

/**
 * One choice of a few whose names are too long for a segmented control's track: a row of chips that
 * wraps, every one in sight, in its `tone`. A radio group: the arrows move to a chip and choose it.
 * A chip's `count` follows its name, soft; one that keeps none dims.
 */
export function ChoiceChips<V extends OptionValue>({
  label,
  value,
  options,
  onChange,
  scroll = false,
  tone = 'ink',
  className,
}: {
  label: string
  /** The chosen one; none where the choice is another group's (a hand's figures by family). */
  value: V | null
  options: readonly Option<V>[]
  onChange: (value: V) => void
  /** One row that scrolls sideways past the screen's edges, never wrapping (the four levels). */
  scroll?: boolean
  tone?: keyof typeof TONES
  /** The room between its rows, where its place sets it (the filters' groups). */
  className?: string
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
        'flex',
        TONES[tone].group,
        scroll
          ? '-mx-(--gutter) scrollbar-none overflow-x-auto overscroll-x-contain px-(--gutter)'
          : 'flex-wrap',
        className,
      )}
    >
      {options.map((option) => (
        <Radio.Root
          key={String(option.value)}
          value={option.value}
          aria-label={optionName(option)}
          data-empty={option.count === 0 ? '' : undefined}
          className={cn(
            'inline-flex h-11 max-w-full shrink-0 cursor-default items-center justify-center rounded-pill border-x-0 border-transparent bg-clip-padding font-semibold select-none focus-visible:-outline-offset-3',
            TONES[tone].chip,
          )}
        >
          <span className="truncate">{option.label}</span>
          {option.count === undefined ? null : (
            <>
              {' '}
              <span className="font-medium text-muted-foreground tabular-nums">{option.count}</span>
            </>
          )}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
