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
 * Two or three exclusive choices as cards, the boards' CARDV and the Practice sheet's mode tiles
 * value for value: 8 apart, the chosen in a honey wash ringed 2px in the deep honey with a honey dot
 * and its tick, the others white with a hairline and a ringed dot. Cards holding rows of their own
 * (the 3D piano's Angle) stack, 16 round, their picture in a 64 by 48 tile; cards holding none stand
 * side by side, 14 round, their picture in a 44 by 40 tile. A radio group: the arrows move to a
 * card and choose it.
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
  // Cards with nothing of their own under them stand two across, as the Practice sheet's Wait · Play.
  const across = cards.every((card) => card.children === undefined)
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        const picked = cards.find((card) => card.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className={cn(
        'gap-2 data-disabled:opacity-45',
        across ? 'grid grid-cols-2' : 'flex flex-col',
      )}
    >
      {cards.map((card) => {
        const chosen = card.value === value
        return (
          <div
            key={card.value}
            className={cn(
              'overflow-hidden',
              across ? 'rounded-[0.875rem]' : 'rounded-2xl',
              chosen
                ? 'bg-[color-mix(in_oklab,var(--color-primary)_22%,var(--color-card))] ring-2 ring-honey-ring'
                : 'bg-card ring-1 ring-foreground/7',
            )}
          >
            <Radio.Root
              value={card.value}
              className={cn(
                'flex w-full cursor-default items-center gap-3 py-2 ps-2 pe-4 text-left select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                across ? 'min-h-14' : 'min-h-16',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'grid flex-none place-items-center bg-card text-foreground ring-1 ring-border',
                  across ? 'h-10 w-11 rounded-md [&_svg]:size-5.5' : 'h-12 w-16 rounded-lg',
                )}
              >
                {card.picture}
              </span>
              <span className="min-w-0 flex-1 text-base font-semibold text-pretty">
                {card.label}
              </span>
              <span
                aria-hidden
                className={cn(
                  'grid size-5.5 flex-none place-items-center rounded-full',
                  chosen
                    ? 'bg-honey-ring text-card'
                    : 'shadow-[inset_0_0_0_2px_var(--color-border)]',
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
