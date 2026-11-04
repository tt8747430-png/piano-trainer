import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { IntervalExplorer, type IntervalView } from '@/widgets/interval-explorer'
import { SettingsGear } from '@/widgets/practice-pages'
import { ToolsButton } from '@/widgets/tools-sheet'

/** The Intervals explorer: every interval over a chosen root, heard and written. */
export function IntervalsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/intervals' })
  const onChange = useSetSearch<IntervalView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.intervals')}
        back={<BackButton />}
        tools={<ToolsButton />}
        settings={<SettingsGear page="intervals" />}
      />
      <IntervalExplorer view={view} onChange={onChange} />
    </div>
  )
}
