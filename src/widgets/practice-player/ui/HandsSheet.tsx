import { useTranslation } from 'react-i18next'
import { selectOtherHand, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setOtherHand } from '@/features/set-preference'
import type { Hands } from '@/shared/lib/schedule'
import { HandsSegmented, Sheet, SheetContent, SwitchRow } from '@/shared/ui'

/**
 * The foot's Hands (R36, flowkey's "Which hand would you like to learn?"): the hands the learner
 * plays, Left · Both · Right in the keys' order, counted in every mode: Wait mode waits for them,
 * Interpret follows them, Listen plays them. With one hand chosen, Hear the other hand, its one home
 * (A35).
 */
export function HandsSheet({
  open,
  onOpenChange,
  hands,
  onHands,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  hands: Hands
  onHands: (hands: Hands) => void
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const hearOther = useSettings((state) => selectOtherHand(state).play)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('handsChoice')}>
        <div className="flex flex-col gap-2">
          <HandsSegmented label={t('hands')} value={hands} onChange={onHands} painted />
          {hands === 'both' ? null : (
            <SwitchRow
              setting="otherHand.play"
              label={t('settingsPage.playOther')}
              info={t('settingsPage.playOtherInfo')}
              checked={hearOther}
              onCheckedChange={(play) => setOtherHand(settings, { play })}
              className="border-b-0 px-0"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
