import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/shared/lib'

/** A choice's ring: the chosen one in ink, the others a hairline (canvas 128). */
const RING =
  'ring-1 ring-border transition-shadow duration-200 ease-out data-checked:ring-[2.5px] data-checked:ring-foreground'

/** The same ring on a screen's picture, read from its radio. */
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
 * General's Appearance (canvas 128, "these are very heavy to read"): three small screens, Match system
 * split light and dark, Light and Dark, each a bar, a card and the honey button on its own paper,
 * the chosen one ringed in ink, its name under it. Tall as a phone on a phone, wide as a laptop's
 * screen on one. A radio group: the arrows move to a choice and choose it.
 */
export function AppearanceChoice({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: Theme
  options: readonly { value: Theme; label: string }[]
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
      className="grid grid-cols-3 gap-3"
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className="group/screen flex min-w-0 cursor-default flex-col items-center gap-2 text-center text-[0.9375rem] font-semibold select-none"
        >
          <span
            aria-hidden
            className={cn(
              'flex aspect-[0.72] w-full flex-col overflow-hidden rounded-card lg:aspect-[1.4]',
              SCREEN_RING,
              SCREEN[option.value],
            )}
          >
            <span className="mx-2.5 mt-3 h-2 w-1/2 rounded-pill bg-(--p-bed)" />
            <span
              className={cn('mx-2.5 mt-2 flex-1 rounded-control opacity-90', CARD[option.value])}
            />
            <span className="mx-2.5 mt-2 mb-2.5 h-3.5 rounded-pill bg-(--p-honey)" />
          </span>
          <span className="text-pretty">{option.label}</span>
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}

/**
 * General's Language (canvas 128): each language a tall button with its own name, the chosen one
 * ringed in ink and heavier. A radio group, as Appearance.
 */
export function LanguageChoice<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: V
  options: readonly { value: V; label: string }[]
  onChange: (value: V) => void
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const option = options.find((each) => each.value === next)
        if (option && option.value !== value) onChange(option.value)
      }}
      className="grid grid-cols-2 gap-3"
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          className={cn(
            'flex h-14 min-w-0 cursor-default items-center justify-center rounded-card bg-card px-3 text-lg font-medium select-none data-checked:font-bold',
            RING,
          )}
        >
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
