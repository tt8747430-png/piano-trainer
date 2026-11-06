import { Anchor, Brackets } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectScaleStaff, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScaleStaff } from '@/features/set-preference'
import { SettingRows, SettingsGroup, SwitchRow } from '@/shared/ui'
import { PracticeSettingsScreen } from './PracticeSettingsScreen'

/**
 * Scales and keys' Settings (A24, A43): the theory written on its staff besides its one layer of
 * labels, which the page chooses in place (R34).
 */
export function ScalesSettingsPage() {
  const { t } = useTranslation('practice')
  const store = useSettingsStoreApi()
  const layers = useSettings(selectScaleStaff)
  return (
    <PracticeSettingsScreen title={t('pages.scales')}>
      <SettingsGroup title={t('scaleStaff.group')}>
        <SettingRows>
          <SwitchRow
            setting="scaleStaff.tonic"
            icon={<Anchor />}
            label={t('scaleStaff.tonic')}
            checked={layers.tonic}
            onCheckedChange={(tonic) => setScaleStaff(store, { tonic })}
          />
          <SwitchRow
            setting="scaleStaff.tetrachords"
            icon={<Brackets />}
            label={t('scaleStaff.tetrachords')}
            info={t('scaleStaff.tetrachordsDetail')}
            checked={layers.tetrachords}
            onCheckedChange={(tetrachords) => setScaleStaff(store, { tetrachords })}
          />
        </SettingRows>
      </SettingsGroup>
    </PracticeSettingsScreen>
  )
}
