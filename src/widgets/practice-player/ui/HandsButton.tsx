import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { Hands } from '@/shared/lib/schedule'
import { Listbox } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useDockSide } from '../model/dock-side'
import { DOCK_BUTTON } from './dock-sizes'
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
  const side = useDockSide()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('player:handsOf', { hands: t(`common:hands.${hands}`) })}
            title={t('player:hands')}
            className={cn('size-12 rounded-full', DOCK_BUTTON)}
          />
        }
      >
        <HandsIcon hands={hands} />
      </PopoverTrigger>
      <PopoverContent
        side={side}
        aria-label={t('player:hands')}
        align="end"
        className="w-64 gap-1 p-2"
      >
        <Listbox
          label={t('player:hands')}
          optionClassName="min-h-11 rounded-lg px-2 text-base"
          groups={[
            {
              options: CHOICES.map((choice) => ({
                key: choice,
                selected: choice === hands,
                content: (
                  <>
                    <HandsIcon hands={choice} />
                    {t(`common:hands.${choice}`)}
                  </>
                ),
                onChoose: () => {
                  onChange(choice)
                  setOpen(false)
                },
              })),
            },
          ]}
        />
      </PopoverContent>
    </Popover>
  )
}
