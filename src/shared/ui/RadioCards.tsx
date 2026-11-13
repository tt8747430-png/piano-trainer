import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Check, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import type { Paint } from './paint'
import { TileMark } from './TileMark'

/** One card of `RadioCards`: its name and its picture. */
export interface RadioCard<V extends string> {
  readonly value: V
  readonly label: string
  readonly icon: LucideIcon
}

/**
 * Two or three exclusive choices side by side as cards (the Player's canvas: Wait · Play, 3D piano ·
 * 2D keys): each a picture and its name, the chosen tinted with its check. A radio group: the arrows
 * move to a card and choose it.
 */
export function RadioCards<V extends string>({
  label,
  value,
  cards,
  paint = 'sand',
  onChange,
}: {
  label: string
  value: V
  cards: readonly RadioCard<V>[]
  paint?: Paint
  onChange: (value: V) => void
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const picked = cards.find((card) => card.value === next)
        if (picked && picked.value !== value) onChange(picked.value)
      }}
      className="grid grid-flow-col auto-cols-fr gap-3"
    >
      {cards.map((card) => (
        <Radio.Root
          key={card.value}
          value={card.value}
          className={cn(
            'card flex min-h-16 min-w-0 cursor-default items-center gap-3 p-3 text-left text-base font-semibold select-none',
            'data-checked:border-primary data-checked:bg-primary/10 data-checked:ring-1 data-checked:ring-primary',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          <TileMark icon={card.icon} paint={paint} />
          <span className="min-w-0 flex-1 text-pretty">{card.label}</span>
          {card.value === value ? (
            <Check aria-hidden className="size-5 shrink-0 text-primary" />
          ) : null}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
