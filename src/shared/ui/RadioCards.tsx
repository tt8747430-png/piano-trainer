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
  readonly picture?: ReactNode
  /** Its own settings, shown under it while it is chosen (the 3D piano's Angle). */
  readonly children?: ReactNode
  /** Its settings shown chosen or not (the Arrangement's Level, the Accompaniment's Pattern). */
  readonly open?: boolean
}

/**
 * Two or three exclusive choices as cards, the boards' CARDV and the Practice sheet's mode tiles
 * value for value: 8 apart, the chosen in a honey wash ringed 2px in the deep honey with a honey dot
 * and its tick, the others white with a hairline and a ringed dot. Cards holding rows of their own
 * (the 3D piano's Angle) stack, their picture in a 64 by 48 tile; cards holding none stand
 * side by side, both in the card corner, their picture in a 44 by 40 tile. A radio group: the arrows move to a
 * card and choose it. Its rows (the card's `children`) are parted by a hairline, the card's own, under its
 * head: a caller draws no line.
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
        'gap-2 data-disabled:opacity-50',
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
              'rounded-card',
              // The chosen card's rows are parted by its own hairline, the honey ring at 30%.
              chosen
                ? 'bg-chosen-honey ring-2 ring-honey-ring [--color-hairline:color-mix(in_oklab,var(--color-honey-ring)_30%,transparent)]'
                : 'bg-card ring-1 ring-hairline',
            )}
          >
            <Radio.Root
              value={card.value}
              className={cn(
                'flex w-full cursor-default items-center gap-3 py-2 pe-4 text-left select-none focus-visible:-outline-offset-3',
                across ? 'min-h-14' : card.picture === undefined ? 'min-h-12' : 'min-h-16',
                card.picture === undefined ? 'ps-4' : 'ps-2',
              )}
            >
              {card.picture === undefined ? null : (
                <span
                  aria-hidden
                  className={cn(
                    'grid flex-none place-items-center bg-card text-foreground ring-1 ring-border',
                    across
                      ? 'h-10 w-11 rounded-control [&_svg]:size-5.5'
                      : 'h-12 w-16 rounded-control',
                  )}
                >
                  {card.picture}
                </span>
              )}
              <span className="min-w-0 flex-1 text-base font-semibold text-pretty">
                {card.label}
              </span>
              <span
                aria-hidden
                className={cn(
                  'grid size-5.5 flex-none place-items-center rounded-pill',
                  chosen
                    ? 'bg-honey-ring text-card'
                    : 'shadow-[inset_0_0_0_2px_var(--color-border)]',
                )}
              >
                {chosen ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </span>
            </Radio.Root>
            {(chosen || card.open) && card.children ? (
              <div className="flex flex-col rows-hairline border-t border-hairline">
                {card.children}
              </div>
            ) : null}
          </div>
        )
      })}
    </RadioGroup>
  )
}
