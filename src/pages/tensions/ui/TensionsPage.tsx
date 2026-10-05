import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { TensionExplorer, type TensionView } from '@/widgets/tension-explorer'

/** The Available tensions explorer: the owner's table, computed for a 7th chord on any root. */
export function TensionsPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/practice/tensions' })
  const onChange = useViewChange<TensionView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('tensions.title')}
        back={<BackButton fallback={{ to: '/practice' }} />}
      />
      <TensionExplorer view={view} onChange={onChange} />
    </div>
  )
}
