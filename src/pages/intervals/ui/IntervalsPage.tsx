import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { IntervalExplorer, type IntervalView } from '@/widgets/interval-explorer'

/** The Intervals reference: every interval over a chosen root, heard and written. */
export function IntervalsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/intervals' })
  const navigate = useNavigate({ from: '/learn/intervals' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<IntervalView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:intervals.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <IntervalExplorer view={view} onChange={onChange} />
    </div>
  )
}
