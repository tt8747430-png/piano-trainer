import { Square, Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { CALIBRATION_CLICKS, cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { isMidiConnected, useMidiConnection } from '../use-midi-connection'
import { useTimingCalibration, type Calibration } from '../use-timing-calibration'

/** The clicks to tap with, each a dot: struck once passed, ringed while it sounds. */
const DOTS = Array.from({ length: CALIBRATION_CLICKS }, (_, click) => click)

/**
 * Calibrate timing (R34, ADR 0028): what it does, the clicks as dots, what the calibration says as it
 * runs (read out as it changes), the one Start (Stop while it runs), and the lateness kept. Greyed
 * until a MIDI keyboard is connected, as the line under it says.
 */
export function TimingCalibration() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const latency = useSettings((state) => selectMidi(state).latency)
  const connected = isMidiConnected(useMidiConnection().connection)
  const { calibration, start, stop } = useTimingCalibration((measured) =>
    setMidi(store, { latency: measured }),
  )
  const running = calibration.stage === 'counting' || calibration.stage === 'tapping'
  const passed =
    calibration.stage === 'tapping'
      ? calibration.click
      : calibration.stage === 'measured' || calibration.stage === 'unclear'
        ? CALIBRATION_CLICKS
        : -1
  return (
    <div className="card flex flex-col gap-5 px-5 py-5">
      <p className="text-pretty text-muted-foreground">{t('midiSettings.timing.how')}</p>
      <ol className="flex flex-wrap gap-2" aria-hidden>
        {DOTS.map((click) => (
          <li
            key={click}
            className={cn(
              'size-4 rounded-full border-2 border-muted-foreground/40 transition-colors motion-reduce:transition-none',
              click < passed && 'border-foreground bg-foreground',
              click === passed && running && 'border-foreground ring-2 ring-foreground/30',
            )}
          />
        ))}
      </ol>
      <p role="status" aria-live="polite" className="min-h-6 font-medium tabular-nums">
        {said(calibration, t)}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {running ? (
          <Button variant="outline" className="min-h-11" onClick={stop}>
            <Square aria-hidden />
            {t('midiSettings.timing.stop')}
          </Button>
        ) : (
          <Button className="min-h-11" disabled={!connected} onClick={start}>
            <Timer aria-hidden />
            {calibration.stage === 'ready'
              ? t('midiSettings.timing.start')
              : t('midiSettings.timing.again')}
          </Button>
        )}
        <span className="text-muted-foreground tabular-nums">
          {t('midiSettings.timing.kept', { latency })}
        </span>
      </div>
      {connected ? null : (
        <p className="text-sm text-muted-foreground">{t('midiSettings.timing.connect')}</p>
      )}
    </div>
  )
}

function said(
  calibration: Calibration,
  t: ReturnType<typeof useTranslation<'common'>>['t'],
): string {
  switch (calibration.stage) {
    case 'ready':
      return ''
    case 'counting':
      return t('midiSettings.timing.counting', { beat: calibration.beat })
    case 'tapping':
      return t('midiSettings.timing.tapping', {
        click: calibration.click + 1,
        count: CALIBRATION_CLICKS,
      })
    case 'measured':
      return t('midiSettings.timing.measured', { latency: calibration.latency })
    case 'unclear':
      return t('midiSettings.timing.unclear')
  }
}
