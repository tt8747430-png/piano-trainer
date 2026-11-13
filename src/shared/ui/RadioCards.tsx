import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** One card of `RadioCards`: its name, its picture, and the rows it holds while chosen. */
export interface RadioCard<V extends string> {
  readonly value: V
  readonly label: string
  /** What the choice looks like, drawn in a 64 by 48 tile: a picture of a 3D piano, the 2D keys. */
  readonly picture: ReactNode
  /** Its own settings, shown under it while it is chosen (the 3D piano's Angle). */
  readonly children?: ReactNode
}

/**
 * Two or three exclusive choices as cards, the canvas's CARDV value for value: stacked 8 apart, each
 * 16 round, its picture in a 64 by 48 tile (8 round, the sheet, a hairline), its name, and a 24px
 * dot at its end, ink with a tick when chosen, a ring when not. The chosen card takes the chosen
 * fill and holds its own rows under it. A radio group: the arrows move to a card and choose it.
 */
export function RadioCards<V extends string>({
  label,
  value,
  cards,
  disabled = false,
  onChange,
}: {
  label: string
  value: V
  cards: readonly RadioCard<V>[]
  /** Waiting on another choice (the piano hidden): dimmed, not chosen from. */
  disabled?: boolean
  onChange: (value: V) => void
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        const picked = cards.find((card) => card.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className="flex flex-col gap-2 data-disabled:opacity-45"
    >
      {cards.map((card) => {
        const chosen = card.value === value
        return (
          <div
            key={card.value}
            className={cn(
              'overflow-hidden rounded-2xl',
              chosen ? 'bg-chosen' : 'bg-card ring-1 ring-foreground/7',
            )}
          >
            <Radio.Root
              value={card.value}
              className="flex min-h-16 w-full cursor-default items-center gap-3 py-2 ps-2 pe-4 text-left select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <span
                aria-hidden
                className="grid h-12 w-16 flex-none place-items-center rounded-lg bg-card text-foreground ring-1 ring-border"
              >
                {card.picture}
              </span>
              <span
                className={cn(
                  'min-w-0 flex-1 text-base text-pretty',
                  chosen ? 'font-semibold' : 'font-medium',
                )}
              >
                {card.label}
              </span>
              <span
                aria-hidden
                className={cn(
                  'grid size-6 flex-none place-items-center rounded-full',
                  chosen
                    ? 'bg-foreground text-card'
                    : 'shadow-[inset_0_0_0_2px_var(--color-chosen)]',
                )}
              >
                {chosen ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </span>
            </Radio.Root>
            {chosen && card.children ? card.children : null}
          </div>
        )
      })}
    </RadioGroup>
  )
}
