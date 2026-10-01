import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Hands } from '@/shared/lib/schedule'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { ChoiceRow } from './ChoiceRow'
import { HandsIcon } from './HandsIcon'

/** The popover's order: one hand, the other, both. */
const CHOICES: readonly Hands[] = ['rh', 'lh', 'both']

/** The hands button and its popover: right, left or both (spec §2.8). */
export function HandsButton({
  hands,
  onChange,
}: {
  hands: Hands
  onChange: (hands: Hands) => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            aria-label={t('player:handsOf', { hands: t(`common:hands.${hands}`) })}
          />
        }
      >
        <HandsIcon hands={hands} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 gap-1 p-2">
        {CHOICES.map((choice) => (
          <ChoiceRow
            key={choice}
            chosen={choice === hands}
            onChoose={() => {
              onChange(choice)
              setOpen(false)
            }}
          >
            <HandsIcon hands={choice} />
            {t(`common:hands.${choice}`)}
          </ChoiceRow>
        ))}
      </PopoverContent>
    </Popover>
  )
}
