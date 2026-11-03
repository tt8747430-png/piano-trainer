import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { Hands } from '@/shared/lib/schedule'
import { selectOtherHand, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setOtherHand } from '@/features/set-preference'
import { Listbox, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useDockSide } from '../model/dock-side'
import { DOCK_BUTTON } from './dock-sizes'
import { HandsIcon } from './HandsIcon'

/** The popover's order: one hand, the other, both. */
const CHOICES: readonly Hands[] = ['rh', 'lh', 'both']

/**
 * The hands button in the transport and its popover (R29): right, left or both, then whether Wait
 * mode plays the other hand as you play yours (Hear the other hand, its one home).
 */
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
  const settings = useSettingsStoreApi()
  const hearOther = useSettings((state) => selectOtherHand(state).play)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('player:handsOf', { hands: t(`common:hands.${hands}`) })}
            title={t('player:hands')}
            className={cn('size-12 rounded-pill', DOCK_BUTTON)}
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
          optionClassName="min-h-11 rounded-control px-2 text-base"
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
        <SwitchRow
          setting="otherHand.play"
          label={t('player:settingsPage.playOther')}
          info={t('player:settingsPage.playOtherInfo')}
          checked={hearOther}
          onCheckedChange={(play) => setOtherHand(settings, { play })}
          className="border-t border-hairline border-b-0 px-2"
        />
      </PopoverContent>
    </Popover>
  )
}
