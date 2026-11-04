import { useTranslation } from 'react-i18next'
import {
  RECORDER_COUNT_INS,
  selectRecorder,
  useSettings,
  useSettingsStoreApi,
  type RecorderCountIn,
} from '@/entities/settings'
import { setRecorderClick, setRecorderCountIn } from '@/features/set-preference'
import { Segmented } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'

/**
 * The recording bar's own choices (A40, Flat's): the Metronome with the song's tempo, and Start
 * countdown (Off, 1 bar, 2 bars), the saved recorder settings Settings › Recording also holds.
 */
export function RecordingChoices({ tempo, countdown }: { tempo: string; countdown: boolean }) {
  const { t } = useTranslation('common')
  const settings = useSettingsStoreApi()
  const { click, countIn } = useSettings(selectRecorder)
  return (
    <>
      <label className="flex items-center gap-2">
        <Switch
          checked={click}
          onCheckedChange={(on) => setRecorderClick(settings, on)}
          aria-label={t('recorderSettings.metronome')}
        />
        <span aria-hidden>{t('recorderSettings.metronome')}</span>
        <span className="text-muted-foreground tabular-nums">{tempo}</span>
      </label>
      <div className="min-w-48">
        <Segmented
          label={t('recorderSettings.countIn')}
          compact
          disabled={!countdown}
          value={String(countIn)}
          options={RECORDER_COUNT_INS.map((bars) => ({
            value: String(bars),
            label: t(`recorderSettings.countIns.${bars}`),
          }))}
          onChange={(bars) => setRecorderCountIn(settings, Number(bars) as RecorderCountIn)}
        />
      </div>
    </>
  )
}
