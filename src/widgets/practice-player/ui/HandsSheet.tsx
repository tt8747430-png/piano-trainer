import { Hand as HandIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectOtherHand, selectSound, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setOtherHand, setStaffVolume } from '@/features/set-preference'
import { cn } from '@/shared/lib'
import type { Hand } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'
import { Sheet, SheetContent, SwitchRow, VolumeSlider } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'

/** Each hand's staff, whose volume is the hand's. */
const STAFF = { rh: 'treble', lh: 'bass' } as const
/** The hand left when one is switched off. */
const OTHER: Readonly<Record<Hand, Hand>> = { rh: 'lh', lh: 'rh' }

/**
 * The foot's Parts (loop round 24, the board's Parts sheet, after Yamaha's parts and Synthesia's):
 * a card for each hand, the right first. Its switch says whether the learner plays it (one stays
 * on: switching the last off turns the other on); its volume is how loud the app plays it when the
 * learner does not (0, not at all); Dim, on the hand the learner does not play, fades its staff.
 * Counted in every mode: Wait mode waits for the hands played, Listen plays the rest.
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
  const sound = useSettings(selectSound)
  const dim = useSettings((state) => selectOtherHand(state).look === 'dim')
  const plays = (hand: Hand) => hands === 'both' || hands === hand
  const toggle = (hand: Hand, on: boolean) =>
    onHands(on ? (plays(OTHER[hand]) ? 'both' : hand) : OTHER[hand])
  return (
    <Sheet at={{ side: 'top', width: 'w-90' }} open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('parts.title')}>
        <div className="flex flex-col gap-3">
          {(['rh', 'lh'] as const).map((hand) => (
            <div key={hand} role="group" aria-label={t(hand)} className="overflow-hidden card">
              <div className="flex min-h-14 items-center gap-3 px-3 py-2">
                <span
                  aria-hidden
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-mark',
                    hand === 'rh'
                      ? 'bg-hand-rh-wash text-(--hand-rh-ink)'
                      : 'bg-hand-lh-wash text-(--hand-lh-ink)',
                  )}
                >
                  <HandIcon className={cn('size-6', hand === 'lh' && '-scale-x-100')} />
                </span>
                <span className="min-w-0 flex-1 truncate text-base font-semibold">{t(hand)}</span>
                <Switch
                  aria-label={t('parts.play', { hand: t(hand) })}
                  checked={plays(hand)}
                  onCheckedChange={(on) => toggle(hand, on)}
                />
              </div>
              <div className="border-t border-hairline px-3">
                <VolumeSlider
                  speakers
                  setting="sound.staves"
                  label={t('parts.volume', { hand: t(hand) })}
                  value={sound.staves[STAFF[hand]] ?? 100}
                  onChange={(percent) => setStaffVolume(settings, STAFF[hand], percent)}
                />
              </div>
              {plays(hand) ? null : (
                <SwitchRow
                  label={t('parts.dim')}
                  setting="otherHand.look"
                  checked={dim}
                  onCheckedChange={(on) => setOtherHand(settings, { look: on ? 'dim' : 'show' })}
                  className="min-h-12 border-t border-b-0 border-hairline px-3 py-0"
                />
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
