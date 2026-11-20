import { Link } from '@tanstack/react-router'
import { Anchor, Brackets, Plug } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectScaleStaff, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { setScaleStaff } from '@/features/set-preference'
import { RowLink, SettingRows, SettingsGroup, SwitchRow } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * What Scales and keys writes on its staff (A24, A43), opened from Scale settings' Staff row: the
 * theory besides its one layer of labels, which the page chooses in place (R34), then a row to a
 * connected piano's page, its one home. Opened from the page it keeps Back to that page on a laptop
 * too.
 */
export function ScalesSettingsPage() {
  const { t } = useTranslation(['practice', 'settings'])
  const store = useSettingsStoreApi()
  const layers = useSettings(selectScaleStaff)
  const midi = useMidiSummary()
  return (
    <SettingsScreen title={t('pages.scales')}>
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
      <SettingsGroup flush title={t('settings:groups.piano.label')}>
        <RowLink
          title={t('settings:pages.connectPiano')}
          icon={Plug}
          paint="sky"
          value={midi}
          render={<Link to="/settings/connect-piano" />}
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
