import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { IntervalExplorer, type IntervalView } from '@/widgets/interval-explorer'

/** The Intervals explorer: every interval over a chosen root, heard and written. */
export function IntervalsPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/practice/intervals' })
  const onChange = useViewChange<IntervalView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('intervals.title')}
        back={<BackButton fallback={{ to: '/practice' }} />}
      />
      <IntervalExplorer view={view} onChange={onChange} />
    </div>
  )
}
