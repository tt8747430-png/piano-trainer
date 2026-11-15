import { Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { METRONOME_VOLUMES } from '@/entities/settings'
import type { Metronome } from '@/features/metronome'
import { GroupRow, GroupRows, RoundButton, Sheet, SheetContent, Stepper } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'

/**
 * The Metronome's gear (canvas 179, its bar's Settings): what it does beside its sound, in one sheet.
 * Flash on the beat lights the screen on each beat, to follow it by eye; Volume sets how loud it
 * clicks, in steps of ten.
 */
export function MetronomeGear({ metronome }: { metronome: Metronome }) {
  const { t } = useTranslation('practice')
  const [open, setOpen] = useState(false)
  const title = t('metronome.settingsTitle')
  const volume = METRONOME_VOLUMES.findIndex((each) => each === metronome.volume)
  return (
    <>
      <RoundButton
        label={title}
        icon={Settings}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent title={title}>
          <GroupRows label={title}>
            <GroupRow label={t('metronome.flash')} setting="metronome.flash">
              <Switch
                aria-label={t('metronome.flash')}
                checked={metronome.flash}
                onCheckedChange={metronome.setFlash}
              />
            </GroupRow>
            <GroupRow label={t('metronome.volume')} setting="metronome.volume">
              <Stepper
                label={t('metronome.volume')}
                value={volume}
                min={0}
                max={METRONOME_VOLUMES.length - 1}
                format={(at) => `${METRONOME_VOLUMES[at] ?? metronome.volume}%`}
                onChange={(at) => {
                  const next = METRONOME_VOLUMES[at]
                  if (next !== undefined) metronome.setVolume(next)
                }}
                decrease={`${t('metronome.volume')} −`}
                increase={`${t('metronome.volume')} +`}
              />
            </GroupRow>
          </GroupRows>
        </SheetContent>
      </Sheet>
    </>
  )
}
