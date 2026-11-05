import { useTranslation } from 'react-i18next'
import { barOf, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setBar } from '@/features/set-preference'
import { SettingsGroup } from '@/shared/ui'
import { BarEditor } from '@/widgets/bar-editor'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Library › Selection toolbar (R29 B10, R32; memory-palaces'): the bar a selection of
 * songs and folders shows, one to four actions. A page of Settings' own, so the list marks it and its
 * Back works. Lessons, courses and takes get theirs with a Select mode of their own.
 */
export function SelectToolbarPage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const bar = useSettings((state) => barOf(state.bars, 'select.songs'))
  return (
    <SettingsScreen title={t('pages.selectionToolbar')}>
      <SettingsGroup bare title={t('bars.songs')} footnote={t('bars.selectFootnote')}>
        <BarEditor
          surface="select.songs"
          bar={bar}
          label={t('pages.selectionToolbar')}
          onChange={(acts) => setBar(settings, 'select.songs', acts)}
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
