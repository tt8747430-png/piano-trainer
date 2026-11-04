import { useTranslation } from 'react-i18next'
import { barOf, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setBar } from '@/features/set-preference'
import { BarEditor } from '@/widgets/bar-editor'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › General › Select toolbar (R29 B10, memory-palaces'): the bar a selection of songs and
 * folders shows, 1 to 4 acts. Lessons, courses and takes get theirs with a Select mode of their own.
 */
export function SelectToolbarPage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const bar = useSettings((state) => barOf(state.bars, 'select.songs'))
  return (
    <SettingsScreen title={t('bars.selectToolbar')}>
      <section className="flex flex-col gap-2">
        <h2 className="font-sans text-base font-semibold">{t('bars.songs')}</h2>
        <BarEditor
          surface="select.songs"
          bar={bar}
          label={t('bars.selectToolbar')}
          onChange={(acts) => setBar(settings, 'select.songs', acts)}
        />
      </section>
    </SettingsScreen>
  )
}
