import { useTranslation } from 'react-i18next'
import {
  PROGRESSION_NAMES,
  PROGRESSION_VOICINGS,
  selectProgressions,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setProgressions } from '@/features/set-preference'
import { INVERSIONS } from '@/shared/lib/music'
import { GroupField, GroupRows, GroupSegmented, InversionChoice } from '@/shared/ui'

/**
 * Progression settings, as ProgressionLaptop draws them (`PR_SET62`): how every progression is
 * written (Roman numerals, Nashville numbers or chord symbols) and voiced (led to the nearest notes,
 * or root-position blocks), and the first chord's inversion a voice-led row starts from, shown only
 * where the row is voice-led.
 */
export function ProgressionSettings() {
  const { t } = useTranslation('practice')
  const store = useSettingsStoreApi()
  const progressions = useSettings(selectProgressions)
  return (
    <GroupRows label={t('progressions.settings')}>
      <GroupSegmented
        setting="progressions.names"
        label={t('progressions.names.label')}
        value={progressions.names}
        options={PROGRESSION_NAMES.map((names) => ({
          value: names,
          label: t(`progressions.names.${names}`),
        }))}
        onChange={(names) => setProgressions(store, { names })}
      />
      <GroupSegmented
        setting="progressions.voicing"
        label={t('progressions.voicing.label')}
        value={progressions.voicing}
        options={PROGRESSION_VOICINGS.map((voicing) => ({
          value: voicing,
          label: t(`progressions.voicing.${voicing}`),
        }))}
        onChange={(voicing) => setProgressions(store, { voicing })}
      />
      {progressions.voicing === 'led' ? (
        <GroupField setting="progressions.inversion" label={t('progressions.inversion.label')}>
          <InversionChoice
            notes={4}
            label={t('progressions.inversion.label')}
            value={progressions.inversion}
            onChange={(next) => {
              const inversion = INVERSIONS.find((one) => one === next)
              if (inversion !== undefined) setProgressions(store, { inversion })
            }}
          />
        </GroupField>
      ) : null}
    </GroupRows>
  )
}
