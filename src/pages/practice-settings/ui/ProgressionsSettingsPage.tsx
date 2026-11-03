import { useTranslation } from 'react-i18next'
import {
  PROGRESSION_NAMES,
  PROGRESSION_VOICINGS,
  selectProgressions,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setProgressions } from '@/features/set-preference'
import type { Inversion } from '@/shared/lib/music'
import { InversionChoice, Segmented, SettingField, SettingRows, SettingsGroup } from '@/shared/ui'
import { PracticeSettingsScreen } from './PracticeSettingsScreen'

/**
 * Progressions' Settings (A23, A24): how every progression is written (Roman numerals, Nashville
 * numbers or chord symbols) and voiced (led to the nearest notes, or root-position blocks), and the
 * first chord's inversion a voice-led row starts from, drawn only where the row is voice-led (R30).
 * Chord size and approach chords change the music shown, so they stay on the page.
 */
export function ProgressionsSettingsPage() {
  const { t } = useTranslation(['practice', 'music'])
  const store = useSettingsStoreApi()
  const progressions = useSettings(selectProgressions)
  return (
    <PracticeSettingsScreen title={t('practice:pages.progressions')}>
      <SettingsGroup>
        <SettingRows>
          <SettingField
            setting="progressions.names"
            label={t('practice:progressions.names.label')}
            info={t('practice:progressions.names.info')}
          >
            <Segmented
              label={t('practice:progressions.names.label')}
              value={progressions.names}
              options={PROGRESSION_NAMES.map((names) => ({
                value: names,
                label: t(`practice:progressions.names.${names}`),
              }))}
              onChange={(names) => setProgressions(store, { names })}
            />
          </SettingField>
          <SettingField
            setting="progressions.voicing"
            label={t('practice:progressions.voicing.label')}
            info={t('practice:progressions.voicing.info')}
          >
            <Segmented
              label={t('practice:progressions.voicing.label')}
              value={progressions.voicing}
              options={PROGRESSION_VOICINGS.map((voicing) => ({
                value: voicing,
                label: t(`practice:progressions.voicing.${voicing}`),
              }))}
              onChange={(voicing) => setProgressions(store, { voicing })}
            />
          </SettingField>
          {progressions.voicing === 'led' ? (
            <SettingField
              setting="progressions.inversion"
              label={t('practice:progressions.inversion.label')}
              info={t('practice:progressions.inversion.info')}
            >
              <InversionChoice
                notes={4}
                label={t('practice:progressions.inversion.label')}
                value={progressions.inversion}
                onChange={(inversion) =>
                  setProgressions(store, { inversion: inversion as Inversion })
                }
              />
            </SettingField>
          ) : null}
        </SettingRows>
      </SettingsGroup>
    </PracticeSettingsScreen>
  )
}
