import { Bluetooth } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { RowButton, Sheet, SheetContent } from '@/shared/ui'

/** The pairing on each system: an iPhone's or iPad's browser cannot. */
const SYSTEMS = ['mac', 'windows', 'android', 'ios'] as const

/** A step, its number in a round mark before it. */
function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full bg-muted font-semibold tabular-nums"
      >
        {number}
      </span>
      <div className="min-w-0 flex-1 pt-1 text-pretty">{children}</div>
    </li>
  )
}

/**
 * Connect a Bluetooth MIDI keyboard: a web page cannot pair one, so its row opens the steps that pair
 * it with the device (the keyboard's Bluetooth, then the system's own pairing on a Mac, Windows or
 * Android, never an iPhone's browser); paired, it shows under Connected devices.
 */
export function BluetoothPairing() {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  return (
    <>
      <RowButton
        title={t('midiSettings.bluetooth.connect')}
        icon={Bluetooth}
        paint="sky"
        onClick={() => setOpen(true)}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          title={t('midiSettings.bluetooth.connect')}
          description={t('midiSettings.bluetooth.steps')}
        >
          <ol className="flex flex-col divide-y divide-hairline">
            <Step number={1}>{t('midiSettings.bluetooth.power')}</Step>
            <Step number={2}>
              {t('midiSettings.bluetooth.pair')}
              <ul className="mt-2 flex list-disc flex-col gap-1.5 ps-5 marker:text-muted-foreground">
                {SYSTEMS.map((system) => (
                  <li key={system}>{t(`midiSettings.bluetooth.${system}`)}</li>
                ))}
              </ul>
            </Step>
            <Step number={3}>{t('midiSettings.bluetooth.back')}</Step>
          </ol>
        </SheetContent>
      </Sheet>
    </>
  )
}
