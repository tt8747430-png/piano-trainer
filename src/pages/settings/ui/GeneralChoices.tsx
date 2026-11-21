import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/shared/lib'

/** A screen's ring, read from its radio: the chosen one in ink, the others a hairline (canvas 128). */
const SCREEN_RING =
  'ring-1 ring-border transition-shadow duration-200 ease-out group-data-checked/screen:ring-[2.5px] group-data-checked/screen:ring-foreground'

/** The paper of each little screen, in its own theme whatever the app's. */
const SCREEN = {
  system: 'bg-linear-135 from-(--p-paper) from-50% to-(--p-dusk-950) to-50%',
  light: 'bg-(--p-paper)',
  dark: 'bg-(--p-dusk-950)',
} as const

/** A card on each little screen: light on Light, dark on Dark, light over the split. */
const CARD = {
  system: 'bg-(--p-paper-card)',
  light: 'bg-(--p-paper-card)',
  dark: 'bg-(--p-dusk-800)',
} as const

type Theme = keyof typeof SCREEN

/**
 * Appearance's theme (canvas 128, "these are very heavy to read"): three small screens, Match system
 * split light and dark, Light and Dark, each a bar, a card and the honey button on its own paper,
 * the chosen one ringed in ink, its name under it. On a phone they share the column, tall as a
 * phone (the board's THEMES); `row` sets them 80 × 56 at a Theme row's end, as the laptop's dialog
 * (the board's LTHEME, claude.ai's Appearance). A radio group: the arrows move to a choice and choose it.
 */
export function AppearanceChoice({
  label,
  value,
  options,
  row = false,
  onChange,
}: {
  label: string
  value: Theme
  options: readonly { value: Theme; label: string }[]
  row?: boolean
  onChange: (value: Theme) => void
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const option = options.find((each) => each.value === next)
        if (option && option.value !== value) onChange(option.value)
      }}
      className={row ? 'flex gap-3' : 'grid grid-cols-3 gap-3'}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className={cn(
            'group/screen flex min-w-0 cursor-default flex-col items-center gap-2 text-center font-semibold select-none',
            row ? 'text-footnote' : 'text-subhead',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'flex flex-col overflow-hidden',
              row ? 'h-14 w-20 rounded-thumb' : 'aspect-[0.72] w-full rounded-card',
              SCREEN_RING,
              SCREEN[option.value],
            )}
          >
            <span
              className={cn(
                'w-1/2 rounded-pill bg-(--p-bed)',
                row ? 'mx-1.75 mt-1.75 h-1.25' : 'mx-2.5 mt-3 h-2',
              )}
            />
            <span
              className={cn(
                'flex-1 opacity-90',
                row ? 'mx-1.75 mt-1.25 rounded-[5px]' : 'mx-2.5 mt-2 rounded-control',
                CARD[option.value],
              )}
            />
            <span
              className={cn(
                'rounded-pill bg-(--p-honey)',
                row ? 'mx-1.75 mt-1.25 mb-1.75 h-1.75' : 'mx-2.5 mt-2 mb-2.5 h-3.5',
              )}
            />
          </span>
          <span className="text-pretty">{option.label}</span>
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
