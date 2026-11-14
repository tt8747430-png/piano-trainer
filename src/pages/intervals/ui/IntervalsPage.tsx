import { useSearch } from '@tanstack/react-router'
import { PageKeyboardTools } from '@/features/live-keyboard'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { IntervalExplorer, type IntervalView } from '@/widgets/interval-explorer'
import { SettingsGear } from '@/widgets/practice-pages'

/**
 * The Intervals explorer (canvas 176, in the Chords page's shape): every interval over a chosen root,
 * heard and written; its bar Back, the page's Settings and the piano's.
 */
export function IntervalsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/intervals' })
  const onChange = useSetSearch<IntervalView>()
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('pages.intervals')}
        back={<BackButton variant="glass" />}
        tools={<PageKeyboardTools />}
        settings={<SettingsGear page="intervals" />}
      />
      <IntervalExplorer view={view} onChange={onChange} />
    </div>
  )
}
